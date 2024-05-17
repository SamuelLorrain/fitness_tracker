import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

const prepareHeaders = (headers, { getState }) => {
  const token = (getState() as RootState)?.user?.token;
  if (token != null) {
    headers.set("authorization", `Bearer ${token}`);
  }
  return headers;
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_DOMAIN}`,
    prepareHeaders,
  }),
  tagTypes: ["Entry", "Report"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(Object.entries(credentials)).toString(),
      }),
    }),
    verify: builder.mutation({
      query: (payload) => ({
        url: "/auth/verify",
        method: "GET",
        headers: {
          authorization: `Bearer ${payload.access_token}`,
        },
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    userInfo: builder.mutation({
      query: () => ({
        url: "/user/",
        method: "GET",
      }),
    }),
    setUserInfo: builder.mutation({
      query: (data) => ({
        url: "/user/",
        method: "PUT",
        body: data,
      }),
    }),
    setUserGoals: builder.mutation({
      query: (data) => ({
        url: "/user/goals/",
        method: "PUT",
        body: data,
      }),
    }),
    searchFood: builder.mutation({
      query: (search) => ({
        url: `/food?name_filter=${search}`,
        method: "GET",
      }),
    }),
    createFood: builder.mutation({
      query: (data) => ({
        url: "/food",
        method: "POST",
        body: data,
      }),
    }),
    getFood: builder.query({
      query: (uuid) => ({
        url: `/food/${uuid}`,
        method: "GET",
      }),
    }),
    createEntry: builder.mutation({
      query: (data) => ({
        url: "/entry",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Entry", "Report"],
    }),
    deleteEntry: builder.mutation({
      query: ({ date, uuid }) => ({
        url: `/entry/${date}/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Entry", "Report"],
    }),
    listEntry: builder.query({
      query: (date) => {
        return {
          url: `/entry/${date}`,
          method: "GET",
        };
      },
      providesTags: ["Entry"],
    }),
    getFoodBarcode: builder.mutation({
      query: (barcode) => {
        return {
          url: "/food/barcode",
          method: "POST",
          body: barcode,
        };
      },
    }),
    updateWaterNotification: builder.mutation({
      query: (data) => ({
        url: "/user/water-notification",
        method: "PUT",
        body: data,
      }),
    }),
    updateFirebaseNotificationToken: builder.mutation({
      query: (data) => ({
        url: "/notification/token",
        method: "PUT",
        body: data,
      }),
    }),
    sendTestNotification: builder.mutation({
      query: () => ({
        url: "/notification/send-test",
        method: "POST",
      }),
    }),
    getStats: builder.query({
      query: (data) => ({
        url: `/report/?mode=${data.mode}&aggregate=${data.aggregate}`,
        method: "GET",
        providesTags: ["Report"],
      }),
    }),
    triggerDebug: builder.mutation({
      query: (data) => ({
        url: "/debug",
        method: "POST",
        body: data,
      }),
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
  useDeleteEntryMutation,
  useListEntryQuery,
  useSetUserInfoMutation,
  useSetUserGoalsMutation,
  useGetFoodBarcodeMutation,
  useRegisterMutation,
  useUpdateWaterNotificationMutation,
  useSendTestNotificationMutation,
  useGetStatsQuery,
  useTriggerDebugMutation,
} = api;
