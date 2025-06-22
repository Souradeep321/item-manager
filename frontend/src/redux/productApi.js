import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import toast from 'react-hot-toast';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.MODE === 'development'
      ? 'http://localhost:5000/api/v1'
      : '/api/v1',
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => '/products',
      providesTags: ['Product'],
    }),

    createProducts: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
      async onQueryStarted(arg, { queryFulfilled }) {
        const toastId = toast.loading('Adding product...');
        try {
          await queryFulfilled;
          toast.success('Product added successfully!', { id: toastId });
        } catch (err) {
          toast.error('Failed to add product', { id: toastId });
        }
      },
    }),

    deleteProducts: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
      async onQueryStarted(arg, { queryFulfilled }) {
        const toastId = toast.loading('Deleting product...');
        try {
          await queryFulfilled;
          toast.success('Product deleted successfully!', { id: toastId });
        } catch (err) {
          toast.error('Failed to delete product', { id: toastId });
        }
      },
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useCreateProductsMutation,
  useDeleteProductsMutation,
} = productApi;
