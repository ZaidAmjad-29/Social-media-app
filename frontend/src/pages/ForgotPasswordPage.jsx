import { useState } from "react";
import { useForgotPasswordMutation } from "../features/auth/authApi";
import { useNavigate } from "react-router";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      console.log("Success:", res);
      alert("Check your email for reset link (or see console token)");
    //   navigate(`/reset-password/${res.data.token}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Send Reset Link</button>
    </form>
  );
}
