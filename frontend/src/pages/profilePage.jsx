import { useGetMeQuery, useUpdateUserMutation } from "../features/auth/authApi";
import { useGetPostsQuery } from "../features/posts/postApi";
import { useRemoveFriendMutation } from "../features/friends/friendsApi";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import UserModal from "../components/UserModal";

export default function ProfilePage() {
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
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
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Error updating profile");
    }
  };

  const handleRemoveFriend = async (friendId) => {
    setFriends((prevFriends) => prevFriends.filter((friend) => friend._id !== friendId));

    try {
      await removeFriend(friendId).unwrap();
      alert("Friend removed successfully!");
    } catch (error) {
      console.error("Error removing friend:", error);
      alert("Something went wrong while removing the friend.");
      // Optionally: rollback by re-adding friend to friends state
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      {userLoading || postsLoading ? (
        <p>Loading...</p>
      ) : userError || postsError ? (
        <p>Failed to load profile or posts</p>
      ) : (
        <>
          <h2 style={{ textAlign: "center" }}>My Profile</h2>

          <div
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <img
              src={`http://localhost:3000${userInfo?.profileImage}`}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <button onClick={() => setIsModalOpen(true)}>Edit Profile</button>

            <UserModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              userData={user}
              onSave={handleSave}
            />

            <h3 style={{ marginTop: "10px" }}>{userInfo?.name}</h3>
            <p>{userInfo?.email}</p>
            {userInfo?.bio && <p>{userInfo.bio}</p>}

            <div style={{ marginTop: "20px", textAlign: "left" }}>
              <h3>Friends</h3>
              {friends.length === 0 ? (
                <p>No friends yet.</p>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "8px",
                    }}
                  >
                    <img
                      src={`http://localhost:3000${friend.profileImage}`}
                      alt={friend.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                    <span style={{ flex: 1 }}>{friend.name}</span>
                    <button
                      style={{
                        padding: "5px 10px",
                        background: "#ff4d4d",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleRemoveFriend(friend._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <h3 style={{ marginBottom: "10px" }}>My Posts</h3>
          {userPosts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            userPosts.map((post) => (
              <div
                key={post._id}
                style={{
                  border: "1px solid #eee",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "6px",
                }}
              >
                <p style={{ margin: 0 }}>{post.content}</p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
