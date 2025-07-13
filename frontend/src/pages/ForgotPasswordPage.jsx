import { useState } from "react";
import { useForgotPasswordMutation } from "../features/auth/authApi";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      console.log("Success:", res);
      setSuccessMessage("Check your email for a reset link!");
      // Optionally: navigate(`/reset-password/${res.data.token}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Reset Link"}
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
