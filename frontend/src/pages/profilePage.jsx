import { useGetMeQuery, useUpdateUserMutation } from "../features/auth/authApi";
import { useGetPostsQuery } from "../features/posts/postApi";
import { useSelector } from "react-redux";
import { useState } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (userLoading || postsLoading) return <p>Loading...</p>;
  if (userError || postsError) return <p>Failed to load profile or posts</p>;

  const userInfo = userData?.data?.user;
  const posts = postsData?.data?.posts || [];
  //   console.log("User Info:", userInfo);

  const userPosts = posts.filter((post) => post.author?._id === user?._id);
  //   console.log("Posts:", userPosts);

  const handleSave = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("bio", data.bio);
    if (data.profileImage) {
      formData.append("profileImage", data.profileImage);
    }

    try {
      const res = await updateUser(formData).unwrap();
      console.log(res.data);
      alert("Profile updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Error updating profile");
    }
  };
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
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
    </div>
  );
}
