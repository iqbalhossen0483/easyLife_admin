import { BaseApiResponse } from "./index";

export interface Product {
  id: number;
  name: string;
  short_name?: string | null;
  type?: string | null;
  price: number;
  cost: number;
  sl?: number | null;
  stock: number;
  init_stock?: number | null;
  image?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

export interface PaginatedProductData {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export type ProductListResponse = BaseApiResponse<PaginatedProductData | Product[]>;
export type SingleProductResponse = BaseApiResponse<Product>;

export interface ProductMetricsProps {
  totalProducts: number;
  totalStockUnits: number;
  lowStockCount: number;
  totalInventoryValue: number;
}

export interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onDelete: (id: number) => void;
}

export interface ProductTrashTableProps {
  products: Product[];
  isLoading: boolean;
  onRestore: (id: number) => void;
}

export interface ProductCreateDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface ProductRepresenterProps {
  activeProducts: Product[];
  trashProducts: Product[];
  isLoadingActive: boolean;
  isLoadingTrash: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  onRefresh: () => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
}


