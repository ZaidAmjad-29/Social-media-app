import { useState } from "react";
import { useSelector } from "react-redux";
import { useCreatePostMutation } from "../features/posts/postApi";
import { useNavigate } from "react-router";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() || !image) {
      alert("content is required");
      return;
    }

    const formData = new FormData();

    formData.append("content", content);
    if (image) {
      formData.append("imageUrl", image);
    }

    try {
      await createPost(formData).unwrap();
      navigate("/feed");
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post");
    }
  };

  if (!user) return <p>Please log in to create a post.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}></div>
        <div style={{ marginBottom: "10px" }}>
          <textarea
            placeholder="Post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            style={{ width: "100%", padding: "8px" }}
          ></textarea>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input type="file" onChange={handleImageChange} />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Posting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
