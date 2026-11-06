"use client";

import ProductRepresenter from "@/components/stock/ProductRepresenter";
import { getErrorMessage } from "@/lib/error";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useGetTrashProductsQuery,
  useRestoreProductMutation,
} from "@/store/feature/productApi";
import { Product } from "@/types/product";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");

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

  const [deleteProduct] = useDeleteProductMutation();
  const [restoreProduct] = useRestoreProductMutation();

  const activeProducts: Product[] = useMemo(() => {
    if (!activeResponse?.data) return [];
    return Array.isArray(activeResponse.data)
      ? activeResponse.data
      : activeResponse.data.products || [];
  }, [activeResponse]);

  const trashProducts: Product[] = useMemo(() => {
    if (!trashResponse?.data) return [];
    return Array.isArray(trashResponse.data)
      ? trashResponse.data
      : trashResponse.data.products || [];
  }, [trashResponse]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to move this product to trash?"))
      return;
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product moved to trash");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreProduct(id).unwrap();
      toast.success("Product restored successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleRefresh = () => {
    if (activeTab === "active") {
      refetchActive();
    } else {
      refetchTrash();
    }
  };

  return (
    <ProductRepresenter
      activeProducts={activeProducts}
      trashProducts={trashProducts}
      isLoadingActive={isLoadingActive}
      isLoadingTrash={isLoadingTrash}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onRefresh={handleRefresh}
      onDelete={handleDelete}
      onRestore={handleRestore}
    />
  );
}
