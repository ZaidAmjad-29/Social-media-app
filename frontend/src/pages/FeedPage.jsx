import { useEffect, useState } from "react";
import {
  useGetPostsQuery,
  useLikeAndUnlikePostMutation,
  useDeletePostMutation,
} from "../features/posts/postApi";
import { useSelector } from "react-redux";
import Modal from "../components/Modal";
import CommentsSection from "../components/CommentsSection";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Trash2 } from "lucide-react";

export default function FeedPage() {
  const { data, isLoading, isError } = useGetPostsQuery();
  const [likeAndUnlikePost] = useLikeAndUnlikePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [localPosts, setLocalPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showOptionsFor, setShowOptionsFor] = useState(null);
  const userId = useSelector((state) => state.auth.user?._id);

  useEffect(() => {
    if (data?.data?.posts) {
      setLocalPosts(data.data.posts);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Failed to load posts</p>
          <p className="text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  const handleDeletePost = async (postId) => {
    setLocalPosts((prev) => prev.filter((post) => post._id !== postId));
    setShowOptionsFor(null);

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

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {localPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts yet</p>
          <p className="text-gray-400">Be the first to share something!</p>
        </div>
      ) : (
        localPosts.map((post) => {
          const isLiked = post.likes.some((like) => like._id === userId);
          const isOwner = post.author?._id === userId;

          return (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={`http://localhost:3000${post.author?.profileImage}`}
                      alt={post.author?.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40x40/9333ea/white?text=' + (post.author?.name?.charAt(0) || 'U');
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {post.author?.name || "Unknown Author"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Options Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowOptionsFor(showOptionsFor === post._id ? null : post._id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreHorizontal className="h-5 w-5 text-gray-600" />
                  </button>
                  
                  {showOptionsFor === post._id && (
                    <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-32">
                      {isOwner && (
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full text-left text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      )}
                      <button
                        onClick={() => setShowOptionsFor(null)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-600 w-full text-left text-sm"
                      >
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              {post.content && (
                <div className="px-4 pb-3">
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {post.content}
                  </p>
                </div>
              )}

              {/* Post Image */}
              {post.imageUrl && (
                <div className="relative">
                  <img
                    src={`http://localhost:3000${post.imageUrl}`}
                    alt="Post content"
                    className="w-full max-h-96 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikes(post._id)}
                      className="flex items-center space-x-2 hover:bg-gray-50 rounded-full p-2 transition-colors group"
                    >
                      <Heart 
                        className={`h-6 w-6 transition-colors ${
                          isLiked 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-700 group-hover:text-red-500'
                        }`}
                      />
                      <span className="text-sm text-gray-700">
                        {post.likes.length}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setSelectedPostId(post._id)}
                      className="flex items-center space-x-2 hover:bg-gray-50 rounded-full p-2 transition-colors group"
                    >
                      <MessageCircle className="h-6 w-6 text-gray-700 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm text-gray-700">
                        {post.comments?.length || 0}
                      </span>
                    </button>
                  </div>

                  <button className="hover:bg-gray-50 rounded-full p-2 transition-colors">
                    <Bookmark className="h-6 w-6 text-gray-700 hover:text-purple-500 transition-colors" />
                  </button>
                </div>

                {/* Likes Summary */}
                {post.likes.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">
                        {post.likes.length === 1 ? '1 like' : `${post.likes.length} likes`}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Comments Modal */}
      {selectedPostId && (
        <Modal onClose={() => setSelectedPostId(null)}>
          <CommentsSection postId={selectedPostId} />
        </Modal>
      )}
    </div>
  );
}