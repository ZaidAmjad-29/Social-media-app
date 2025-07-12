import { useState, useEffect } from "react";

export default function UserModal({ isOpen, onClose, userData, onSave }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(userData?.name || "");
      setBio(userData?.bio || "");
      setProfileImageFile(null);
      setPreviewUrl(userData?.profileImage || "");
    }
  }, [isOpen, userData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, bio, profileImage: profileImageFile });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
          maxWidth: "90%",
        }}
      >
        <h3>Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Bio:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ width: "100%", padding: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Profile Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: "100%", padding: "5px" }}
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ marginTop: "10px", width: "100px", borderRadius: "8px" }}
              />
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{ marginRight: "10px" }}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
