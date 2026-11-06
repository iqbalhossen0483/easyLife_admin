"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getErrorMessage } from "@/lib/error";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useGetTrashProductsQuery,
  useRestoreProductMutation,
} from "@/store/feature/productApi";
import { Product } from "@/types/product";
import {
  AlertTriangle,
  ArrowUpDown,
  Boxes,
  DollarSign,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ProductFormValues {
  name: string;
  short_name?: string;
  type?: string;
  price: number;
  cost: number;
  sl?: number;
  init_stock?: number;
  image?: FileList;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    data: activeResponse,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useGetProductsQuery({ search: searchTerm });

  const {
    data: trashResponse,
    isLoading: isLoadingTrash,
    refetch: refetchTrash,
  } = useGetTrashProductsQuery(undefined, {
    skip: activeTab !== "trash",
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [restoreProduct, { isLoading: isRestoring }] = useRestoreProductMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>();

  const activeProducts: Product[] = Array.isArray(activeResponse?.data)
    ? activeResponse.data
    : activeResponse?.data?.products || [];

  const trashProducts: Product[] = Array.isArray(trashResponse?.data)
    ? trashResponse.data
    : trashResponse?.data?.products || [];

  const handleCreateSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.short_name) formData.append("short_name", data.short_name);
      if (data.type) formData.append("type", data.type);
      formData.append("price", String(data.price));
      formData.append("cost", String(data.cost));
      if (data.sl) formData.append("sl", String(data.sl));
      if (data.init_stock) formData.append("init_stock", String(data.init_stock));

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      await createProduct(formData).unwrap();
      toast.success("Product created successfully!");
      setIsCreateOpen(false);
      reset();
      refetchActive();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to move this product to trash?")) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product moved to trash");
      refetchActive();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreProduct(id).unwrap();
      toast.success("Product restored successfully");
      refetchTrash();
      refetchActive();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Metrics calculation
  const totalProducts = activeProducts.length;
  const totalStockUnits = activeProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = activeProducts.filter((p) => (p.stock || 0) <= 5).length;
  const totalInventoryValue = activeProducts.reduce(
    (sum, p) => sum + (p.stock || 0) * (p.cost || 0),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products & Stock</h1>
          <p className="text-sm text-muted-foreground">
            Manage your catalog, stock thresholds, pricing, and supplier items.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="size-4" />
            <span>Add New Product</span>
          </Button>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Define new SKU, initial inventory, and pricing details.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleCreateSubmit)}>
              <div className="py-3">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Product Name *</FieldLabel>
                    <Input
                      id="name"
                      placeholder="e.g. Engine Oil 20W-50"
                      {...register("name", { required: "Name is required" })}
                    />
                    <FieldError errors={[errors.name]} />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel htmlFor="short_name">Short Name / Code</FieldLabel>
                      <Input
                        id="short_name"
                        placeholder="e.g. OIL-20W50"
                        {...register("short_name")}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="type">Category / Type</FieldLabel>
                      <Input
                        id="type"
                        placeholder="e.g. Lubricants"
                        {...register("type")}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel htmlFor="cost">Cost Price (৳) *</FieldLabel>
                      <Input
                        id="cost"
                        type="number"
                        placeholder="0.00"
                        {...register("cost", {
                          required: "Cost is required",
                          valueAsNumber: true,
                        })}
                      />
                      <FieldError errors={[errors.cost]} />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="price">Selling Price (৳) *</FieldLabel>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        {...register("price", {
                          required: "Price is required",
                          valueAsNumber: true,
                        })}
                      />
                      <FieldError errors={[errors.price]} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel htmlFor="init_stock">Initial Stock</FieldLabel>
                      <Input
                        id="init_stock"
                        type="number"
                        placeholder="0"
                        {...register("init_stock", { valueAsNumber: true })}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="sl">Serial / Position</FieldLabel>
                      <Input
                        id="sl"
                        type="number"
                        placeholder="1"
                        {...register("sl", { valueAsNumber: true })}
                      />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="image">Product Image</FieldLabel>
                    <Input id="image" type="file" accept="image/*" {...register("image")} />
                  </Field>
                </FieldGroup>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Saving..." : "Create Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Metric Summary Cards */}
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
                ৳ {totalInventoryValue.toLocaleString()}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
              <DollarSign className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs & Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  activeTab === "active" ? refetchActive() : refetchTrash()
                }
                title="Refresh"
              >
                <RefreshCw className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {activeTab === "active" ? (
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
                <TableBody>
                  {isLoadingActive ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                        Loading products catalog...
                      </TableCell>
                    </TableRow>
                  ) : activeProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        No products found. Click &quot;Add New Product&quot; to create your first item.
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeProducts.map((p) => {
                      const margin =
                        p.price && p.cost
                          ? Math.round(((p.price - p.cost) / p.price) * 100)
                          : 0;

                      return (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground">{p.name}</span>
                              {p.short_name && (
                                <span className="text-xs text-muted-foreground font-mono">
                                  {p.short_name}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{p.type || "General"}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            ৳ {p.cost?.toLocaleString() ?? "0"}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            ৳ {p.price?.toLocaleString() ?? "0"}
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
                            {p.stock <= 0 ? (
                              <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Out of Stock
                              </Badge>
                            ) : p.stock <= 5 ? (
                              <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Low: {p.stock} units
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {p.stock} in stock
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(p.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
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
                <TableBody>
                  {isLoadingTrash ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                        Loading trash bin...
                      </TableCell>
                    </TableRow>
                  ) : trashProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        Trash bin is empty.
                      </TableCell>
                    </TableRow>
                  ) : (
                    trashProducts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium text-foreground">
                          {p.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{p.type || "General"}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ৳ {p.price?.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {p.stock}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => handleRestore(p.id)}
                          >
                            <RefreshCw className="size-3.5" />
                            <span>Restore</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
