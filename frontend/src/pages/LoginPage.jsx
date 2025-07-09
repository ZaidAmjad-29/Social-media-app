import { useState } from "react";
import { useLoginMutation } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { Link } from "react-router";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      localStorage.setItem("token", res.data.token); // Store token in localStorage
      console.log("Login successful:", res);
      // You can navigate to home page here if needed
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
<Link to="/forgot-password">Forgot your Password ? No worries click here</Link>
      {error && <p style={{ color: "red" }}>Invalid credentials</p>}
    </form>
  );
}
