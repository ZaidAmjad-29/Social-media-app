import {
    useGetCommentsQuery,
    useAddCommentMutation,
    useDeleteCommentMutation,
    useLikeAndUnlikeCommentMutation,
  } from "../features/posts/postApi";
  import { useSelector } from "react-redux";
  import { useState } from "react";
  
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
  
    if (isLoading) return <p>Loading comments...</p>;
  
    const comments = data?.data?.comments || [];
    // console.log("Comments:", comments);
    // console.log("User:", user);
  
    return (
      <div style={{ marginTop: "15px" }}>
        <h3>Comments</h3>
        <div>
          {comments.length === 0 && <p>No comments yet. Be the first!</p>}
          {comments.map((c) => (
            <div
              key={c._id}
              style={{
                marginBottom: "10px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "5px",
              }}
            >
              <strong>{c.author?.name || "Unknown"}</strong>: {c.text}
              <div style={{ marginTop: "5px" }}>
                <button
                  onClick={() => handleLikeComment(c._id)}
                  disabled={isLiking}
                >
                  ({c.likes?.length || 0}) Like
                </button>
                {user?._id === c.author?._id && (
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    disabled={isDeleting}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ width: "80%", padding: "5px" }}
          />
          <button
            onClick={handleAddComment}
            disabled={isAdding || !commentText.trim()}
            style={{ marginLeft: "5px" }}
          >
            {isAdding ? "Adding..." : "Add Comment"}
          </button>
        </div>
      </div>
    );
  }
  