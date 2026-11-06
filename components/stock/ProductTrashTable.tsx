import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { ProductTrashTableProps } from "@/types/product";
import { RefreshCw } from "lucide-react";

export default function ProductTrashTable({
  products,
  isLoading,
  onRestore,
}: ProductTrashTableProps) {
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
            Loading trash bin...
          </TableCell>
        </TableRow>
      );
    }

    if (products.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
            Trash bin is empty.
          </TableCell>
        </TableRow>
      );
    }

    return products.map((product) => (
      <TableRow key={product.id}>
        <TableCell className="font-medium text-foreground">
          {product.name}
        </TableCell>
        <TableCell>
          <Badge variant="outline">{product.type || "General"}</Badge>
        </TableCell>
        <TableCell className="text-right font-mono">
          {formatCurrency(product.price || 0)}
        </TableCell>
        <TableCell className="text-right font-mono">
          {product.stock}
        </TableCell>
        <TableCell className="text-right">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => onRestore(product.id)}
          >
            <RefreshCw className="size-3.5" />
            <span>Restore</span>
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableContent()}</TableBody>
      </Table>
    </div>
  );
}
