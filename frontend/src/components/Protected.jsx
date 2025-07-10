import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Protected({ children }) {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return children;
}
