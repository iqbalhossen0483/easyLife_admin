import ProductCreateDialog from "@/components/stock/ProductCreateDialog";
import ProductMetrics from "@/components/stock/ProductMetrics";
import ProductTable from "@/components/stock/ProductTable";
import ProductTrashTable from "@/components/stock/ProductTrashTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductRepresenterProps } from "@/types/product";
import { Package, RefreshCw, Search, Trash2 } from "lucide-react";

export default function ProductRepresenter({
  activeProducts,
  trashProducts,
  isLoadingActive,
  isLoadingTrash,
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  onRefresh,
  onDelete,
  onRestore,
}: ProductRepresenterProps) {
  const totalProducts = activeProducts.length;
  const totalStockUnits = activeProducts.reduce(
    (sum, p) => sum + (p.stock || 0),
    0,
  );
  const lowStockCount = activeProducts.filter(
    (p) => (p.stock || 0) <= 5,
  ).length;
  const totalInventoryValue = activeProducts.reduce(
    (sum, p) => sum + (p.stock || 0) * (p.cost || 0),
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Products & Stock
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your catalog, stock thresholds, pricing, and supplier items.
          </p>
        </div>

        <ProductCreateDialog />
      </div>

      {/* KPI Metric Summary Cards */}
      <ProductMetrics
        totalProducts={totalProducts}
        totalStockUnits={totalStockUnits}
        lowStockCount={lowStockCount}
        totalInventoryValue={totalInventoryValue}
      />

      {/* Main Tabs & Table Container */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Tabs
              value={activeTab}
              onValueChange={onTabChange}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="active" className="gap-2">
                  <Package className="size-4" />
                  <span>Active Catalog ({activeProducts.length})</span>
                </TabsTrigger>
                <TabsTrigger value="trash" className="gap-2">
                  <Trash2 className="size-4" />
                  <span>Trash Bin ({trashProducts.length})</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search products or SKU..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                title="Refresh"
              >
                <RefreshCw className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {activeTab === "active" ? (
            <ProductTable
              products={activeProducts}
              isLoading={isLoadingActive}
              onDelete={onDelete}
            />
          ) : (
            <ProductTrashTable
              products={trashProducts}
              isLoading={isLoadingTrash}
              onRestore={onRestore}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
