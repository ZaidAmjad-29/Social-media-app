import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikeAndUnlikeCommentMutation,
} from "../features/posts/postApi";
import { useSelector } from "react-redux";
import { useState } from "react";
import { ThumbsUp, Trash2, Loader2 } from "lucide-react";

export default function CommentsSection({ postId }) {
  const { data, isLoading, refetch } = useGetCommentsQuery(postId);
  const [addComment, { isLoading: isAdding }] = useAddCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const [likeComment, { isLoading: isLiking }] = useLikeAndUnlikeCommentMutation();
  const [commentText, setCommentText] = useState("");

  const user = useSelector((state) => state.auth.user);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment({ postId, comment: commentText }).unwrap();
      setCommentText("");
      refetch();
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ postId, commentId }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(commentId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to like comment", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading comments...</span>
      </div>
    );
  }

  const comments = data?.data?.comments || [];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-500">No comments yet. Be the first!</p>
        )}
        {comments.map((c) => (
          <div
            key={c._id}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <strong className="text-gray-800">{c.author?.name || "Unknown"}</strong>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleLikeComment(c._id)}
                  disabled={isLiking}
                  className="flex items-center text-sm text-purple-600 hover:text-purple-700 transition"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {c.likes?.length || 0}
                </button>
                {user?._id === c.author?._id && (
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    disabled={isDeleting}
                    className="flex items-center text-sm text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 text-gray-700">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <button
          onClick={handleAddComment}
          disabled={isAdding || !commentText.trim()}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {isAdding ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
