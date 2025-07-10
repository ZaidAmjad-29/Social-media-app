import { useEffect, useState } from "react";
import {
  useGetPostsQuery,
  useLikeAndUnlikePostMutation,
  useDeletePostMutation,
} from "../features/posts/postApi";
import { useSelector } from "react-redux";

export default function FeedPage() {
  const { data, isLoading, isError } = useGetPostsQuery();
  const [likeAndUnlikePost] = useLikeAndUnlikePostMutation();
  const [deletePost] = useDeletePostMutation();
  const userId = useSelector((state) => state.auth.user?._id);

  const [localPosts, setLocalPosts] = useState([]);

  useEffect(() => {
    if (data?.data?.posts) {
      setLocalPosts(data.data.posts);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load posts.</p>;

  const handleDeletePost = async (postId) => {
    
    setLocalPosts((prev) => prev.filter((post) => post._id !== postId));

    try {
      await deletePost(postId).unwrap();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleLikes = async (postId) => {
    setLocalPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          const alreadyLiked = post.likes.some((like) => like._id === userId);
          let updatedLikes;
          if (alreadyLiked) {
            updatedLikes = post.likes.filter((like) => like._id !== userId);
          } else {
            updatedLikes = [...post.likes, { _id: userId }];
          }
          return { ...post, likes: updatedLikes };
        }
        return post;
      })
    );

    try {
      await likeAndUnlikePost(postId).unwrap();
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
    }
  };

  return (
    <div>
      <h2>Feed</h2>
      {localPosts.map((post) => (
        <div
          key={post._id}
          style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "10px",
          }}
        >
          <div>
            <strong>{post.author?.name || "Unknown Author"}</strong>
            <img
              src={`http://localhost:3000${post.author?.profileImage}`}
              alt="author"
              width="50"
            />
          </div>
          <p>{post.content}</p>
          {post.imageUrl && (
            <img
              src={`http://localhost:3000${post.imageUrl}`}
              alt="post"
              width="200"
            />
          )}
          <button onClick={() => handleLikes(post._id)}>
            ({post.likes.length}) Like
          </button>
          <button onClick={() => handleDeletePost(post._id)}>
            Delete Post
          </button>
        </div>
      ))}
    </div>
  );
}
