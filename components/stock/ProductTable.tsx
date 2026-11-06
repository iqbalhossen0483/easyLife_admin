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
import { ProductTableProps } from "@/types/product";
import { Trash2 } from "lucide-react";

export default function ProductTable({
  products,
  isLoading,
  onDelete,
}: ProductTableProps) {
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
            Loading products catalog...
          </TableCell>
        </TableRow>
      );
    }

    if (products.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
            No products found. Click &quot;Add New Product&quot; to create your first item.
          </TableCell>
        </TableRow>
      );
    }

    return products.map((product) => {
      const margin =
        product.price && product.cost
          ? Math.round(((product.price - product.cost) / product.price) * 100)
          : 0;

      return (
        <TableRow key={product.id}>
          <TableCell className="font-medium">
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{product.name}</span>
              {product.short_name && (
                <span className="text-xs text-muted-foreground font-mono">
                  {product.short_name}
                </span>
              )}
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="outline">{product.type || "General"}</Badge>
          </TableCell>
          <TableCell className="text-right font-mono">
            {formatCurrency(product.cost || 0)}
          </TableCell>
          <TableCell className="text-right font-mono font-semibold">
            {formatCurrency(product.price || 0)}
          </TableCell>
          <TableCell className="text-right font-mono">
            <span
              className={
                margin >= 20
                  ? "text-emerald-500"
                  : margin > 0
                  ? "text-amber-500"
                  : "text-rose-500"
              }
            >
              {margin}%
            </span>
          </TableCell>
          <TableCell className="text-center">
            {product.stock <= 0 ? (
              <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Out of Stock
              </Badge>
            ) : product.stock <= 5 ? (
              <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Low: {product.stock} units
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {product.stock} in stock
              </Badge>
            )}
          </TableCell>
          <TableCell className="text-right">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(product.id)}
              aria-label={`Delete ${product.name}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Cost Price</TableHead>
            <TableHead className="text-right">Selling Price</TableHead>
            <TableHead className="text-right">Margin</TableHead>
            <TableHead className="text-center">Stock Level</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableContent()}</TableBody>
      </Table>
    </div>
  );
}
