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
    searchFood: builder.query({
      query: (search) => `/food/?name_filter=${search}`
    }),
    createFood: builder.mutation({
      query: (data) => ({
        url: '/food',
        method: 'POST',
        body: data
      })
    })
  }),
});

export const {
  useLoginMutation,
  useVerifyMutation,
  useSearchFoodQuery,
  useCreateFoodMutation
} = api;
