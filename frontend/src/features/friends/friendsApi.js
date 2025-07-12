import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const friendsApi = createApi({
  reducerPath: "friendsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users", "Me"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getMe: builder.query({
      query: () => "/user/me",
      providesTags: ["Me"],
    }),
    sendRequest: builder.mutation({
      query: (userId) => ({
        url: `/send-request/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["Me"],
    }),
    acceptRequest: builder.mutation({
      query: (userId) => ({
        url: `/accept-request/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["Me"],
    }),
    cancelRequest: builder.mutation({
      query: (userId) => ({
        url: `/cancel-request/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Me"],
    }),
    removeFriend: builder.mutation({
      query: (userId) => ({
        url: `/remove-friend/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetMeQuery,
  useSendRequestMutation,
  useAcceptRequestMutation,
  useCancelRequestMutation,
  useRemoveFriendMutation,
} = friendsApi;
