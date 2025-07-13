import { useGetMeQuery, useUpdateUserMutation } from "../features/auth/authApi";
import { useGetPostsQuery } from "../features/posts/postApi";
import { useRemoveFriendMutation } from "../features/friends/friendsApi";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import UserModal from "../components/UserModal";
import { Loader2, User, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useGetMeQuery();
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = useGetPostsQuery();
  const user = useSelector((state) => state.auth.user);
  const [updateUser] = useUpdateUserMutation();
  const [removeFriend] = useRemoveFriendMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friends, setFriends] = useState([]);

  const userInfo = userData?.data?.user;
  const posts = postsData?.data?.posts || [];
  const userPosts = posts.filter((post) => post.author?._id === user?._id);

  useEffect(() => {
    if (userInfo?.friends) {
      setFriends(userInfo.friends);
    }
  }, [userInfo]);

  const handleSave = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("bio", data.bio);
    if (data.profileImage) {
      formData.append("profileImage", data.profileImage);
    }

    try {
      await updateUser(formData).unwrap();
      alert("Profile updated successfully!");
      setIsModalOpen(false);
      refetchUser();
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Error updating profile");
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(friendId).unwrap();
      alert("Friend removed successfully!");
      setFriends((prevFriends) => prevFriends.filter((f) => f._id !== friendId));
      refetchUser();
    } catch (error) {
      console.error("Error removing friend:", error);
      alert("Something went wrong while removing the friend.");
    }
  };

  if (userLoading || postsLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (userError || postsError) {
    return (
      <div className="text-center text-red-600 mt-10">
        Failed to load profile or posts.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col items-center p-6">
          <div className="relative">
            <img
              src={`http://localhost:3000${userInfo?.profileImage}`}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover ring-2 ring-purple-200"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/120x120/9333ea/ffffff?text=${userInfo?.name?.charAt(0) || "U"}`;
              }}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-2 shadow-md hover:bg-purple-700 transition"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

          <UserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            userData={user}
            onSave={handleSave}
          />

          <h3 className="mt-4 text-xl font-bold text-gray-900">{userInfo?.name}</h3>
          <p className="text-gray-500">{userInfo?.email}</p>
          {userInfo?.bio && <p className="text-gray-600 text-center mt-2">{userInfo.bio}</p>}
        </div>

        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Friends</h3>
          {friends.length === 0 ? (
            <p className="text-gray-500">No friends yet.</p>
          ) : (
            <div className="space-y-4">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center bg-gray-50 rounded-lg p-3 shadow-sm border hover:shadow-md transition"
                >
                  <img
                    src={`http://localhost:3000${friend.profileImage}`}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/80x80/9333ea/ffffff?text=${friend.name?.charAt(0) || "U"}`;
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{friend.name}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFriend(friend._id)}
                    className="flex items-center space-x-1 px-3 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Posts</h3>
        {userPosts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-50 rounded-lg p-4 shadow-sm border hover:shadow-md transition"
              >
                <p className="text-gray-800">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
