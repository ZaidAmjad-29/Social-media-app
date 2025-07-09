import { useState } from "react";
import { useRegisterMutation } from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";


export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });

  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);
//   console.log(user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form).unwrap();
    //   console.log(res.data);
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      navigate("/login")
    //   console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
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
      <textarea
        name="bio"
        placeholder="Bio"
        value={form.bio}
        onChange={handleChange}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </button>
      {error && <p style={{ color: "red" }}>Something went wrong!</p>}
    </form>
  );
}
