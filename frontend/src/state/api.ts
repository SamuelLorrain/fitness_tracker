import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

const prepareHeaders = (headers, { getState }) => {
  const token = (getState() as RootState)?.user?.token;
  if (token != null) {
    headers.set('authorization', `Bearer ${token}`)
  }
  return headers;
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_DOMAIN}`,
    prepareHeaders
  }),
  tagTypes: ["Entry"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(Object.entries(credentials)).toString()
      }),
    }),
    verify: builder.mutation({
      query: (payload) => ({
        url: '/auth/verify',
        method: 'GET',
        headers: {
          'authorization': `Bearer ${payload.access_token}`
        }
      }),
    }),
    userInfo: builder.mutation({
      query: () => ({
        url: '/user/',
        method: 'GET'
      })
    }),
    searchFood: builder.mutation({
      query: (search) => ({
        url: `/food?name_filter=${search}`,
        method: 'GET'
      })
    }),
    createFood: builder.mutation({
      query: (data) => ({
        url: '/food',
        method: 'POST',
        body: data
      })
    }),
    getFood: builder.query({
      query: (uuid) => ({
        url: `/food/${uuid}`,
        method: 'GET'
      })
    }),
    createEntry: builder.mutation({
      query: (data) => ({
        url: '/entry',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ["Entry"]
    }),
    listEntry: builder.query({
      query: (date) => {
        return {
          url: `/entry/${date}`,
          method: 'GET'
        }
      },
      providesTags: ["Entry"]
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyMutation,
  useUserInfoMutation,
  useSearchFoodMutation,
  useCreateFoodMutation,
  useGetFoodQuery,
  useCreateEntryMutation,
  useListEntryQuery,
} = api;

