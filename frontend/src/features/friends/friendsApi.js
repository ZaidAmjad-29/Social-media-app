import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const friendsApi = createApi({
  reducerPath: "friendsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Friends"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "me",
      providesTags: ["Friends"],
    }),
    getAllUsers: builder.query({
      query: () => "users",
      providesTags: ["Friends"],
    }),
    sendRequest: builder.mutation({
      query: (userIdTo) => ({
        url: "send-request",
        method: "POST",
        body: { userIdTo },
      }),
      invalidatesTags: ["Friends"],
    }),
    acceptRequest: builder.mutation({
      query: (userIdFrom) => ({
        url: "accept-request",
        method: "POST",
        body: { userIdFrom },
      }),
      invalidatesTags: ["Friends"],
    }),
    rejectRequest: builder.mutation({
      query: (userIdFrom) => ({
        url: "reject-request",
        method: "POST",
        body: { userIdFrom },
      }),
      invalidatesTags: ["Friends"],
    }),
    removeFriend: builder.mutation({
      query: (friendId) => ({
        url: `remove-friend/${friendId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetAllUsersQuery,
  useSendRequestMutation,
  useAcceptRequestMutation,
  useRejectRequestMutation,
  useRemoveFriendMutation,
} = friendsApi;
