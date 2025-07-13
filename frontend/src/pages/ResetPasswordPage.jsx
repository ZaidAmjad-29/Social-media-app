import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useResetPasswordMutation } from "../features/auth/authApi";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({ token, newPassword: password }).unwrap();
      console.log("Password reset success:", res);
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !password}
          className="w-full bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Reset Password"}
        </button>
        {error && (
          <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
        )}
        {successMessage && (
          <p className="text-green-600 text-sm text-center">{successMessage}</p>
        )}
      </form>
    </div>
  );
}
