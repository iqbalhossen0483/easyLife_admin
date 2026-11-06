import {
  ProductListResponse,
  ProductQueryParams,
  SingleProductResponse,
} from "@/types/product";
import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, ProductQueryParams | void>({
      query: (params) => ({
        url: "/product/all",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Product" as const, id: "LIST" },
              ...(Array.isArray(result.data)
                ? result.data.map((p) => ({
                    type: "Product" as const,
                    id: p.id,
                  }))
                : (result.data?.products || []).map((p) => ({
                    type: "Product" as const,
                    id: p.id,
                  }))),
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),

    getProductById: builder.query<SingleProductResponse, number | string>({
      query: (id) => ({
        url: `/product/single/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation<SingleProductResponse, FormData>({
      query: (formData) => ({
        url: "/product/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation<
      SingleProductResponse,
      { id: number | string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/product/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<
      { success: boolean; message: string },
      number | string
    >({
      query: (id) => ({
        url: `/product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "Product", id: "TRASH" },
      ],
    }),

    restoreProduct: builder.mutation<
      { success: boolean; message: string },
      number | string
    >({
      query: (id) => ({
        url: `/product/restore/${id}`,
        method: "PUT",
      }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "Product", id: "TRASH" },
      ],
    }),

    getTrashProducts: builder.query<ProductListResponse, void>({
      query: () => ({
        url: "/product/trash",
        method: "GET",
      }),
      providesTags: [{ type: "Product", id: "TRASH" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestoreProductMutation,
  useGetTrashProductsQuery,
} = productApi;
