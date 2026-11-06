import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ProductMetricsProps } from "@/types/product";
import { AlertTriangle, Boxes, DollarSign, Package } from "lucide-react";

export default function ProductMetrics({
  totalProducts,
  totalStockUnits,
  lowStockCount,
  totalInventoryValue,
}: ProductMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Products
            </p>
            <p className="text-2xl font-bold font-heading">{totalProducts}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Package className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Stock On Hand
            </p>
            <p className="text-2xl font-bold font-heading">
              {totalStockUnits.toLocaleString()} units
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Boxes className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Low Stock Alert
            </p>
            <p className="text-2xl font-bold font-heading text-amber-500">
              {lowStockCount} items
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
            <AlertTriangle className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Inventory Valuation
            </p>
            <p className="text-2xl font-bold font-heading">
              {formatCurrency(totalInventoryValue)}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
            <DollarSign className="size-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
