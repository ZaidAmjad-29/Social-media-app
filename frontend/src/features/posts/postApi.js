import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1",
    tagTypes: ["Posts"],
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      providesTags: ["Posts"],
    }),

    createPost: builder.mutation({
      query: (data) => ({
        url: "/post",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/post/${id}`,
        method: "DELETE",
      }),
    }),
    likeAndUnlikePost: builder.mutation({
      query: (id) => ({
        url: `/post/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Posts"],
    }),
    addComment: builder.mutation({
      query: ({ postId, comment }) => ({
        url: `/comments/${postId}`,
        method: "POST",
        body: { text: comment },
      }),
    }),
    deleteComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
    }),
    getComments: builder.query({
      query: (postId) => `/comments/${postId}`,
    }),
    likeAndUnlikeComment: builder.mutation({
      query: (commentId) => ({
        url: `/comments/like/${commentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useLikeAndUnlikePostMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useLikeAndUnlikeCommentMutation,
} = postApi;
