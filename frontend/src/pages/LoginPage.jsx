import { useState } from "react";
import { useLoginMutation } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      console.log("Login successful:", res);
      navigate("/feed");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Log in to your account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Login"}
        </button>
        {error && (
          <p className="text-red-500 text-sm text-center">
            Invalid credentials
          </p>
        )}
      </form>
      <div className="mt-4 text-center text-sm flex flex-col">
        <Link to="/forgot-password" className="text-purple-600 hover:underline">
          Forgot your password? Click here!
        </Link>

        <Link to="/" className="text-purple-600 hover:underline">
          Back to Sign up
        </Link>
      </div>
    </div>
  );
}
