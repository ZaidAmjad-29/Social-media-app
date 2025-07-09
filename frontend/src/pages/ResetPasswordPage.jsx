import { useState } from "react";
import { useParams } from "react-router";
import { useResetPasswordMutation } from "../features/auth/authApi";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const [resetPassword] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({ token, newPassword: password }).unwrap();
      console.log("Password reset success:", res);
      alert("Password reset successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}
