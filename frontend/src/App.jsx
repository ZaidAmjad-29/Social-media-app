import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import FeedPage from "./pages/FeedPage";
import Protected from "./components/Protected";
import AppLayout from "./components/AppLayout";
import CreatePost from "./pages/CreatePost";
import ProfilePage from "./pages/profilePage";
import FriendsPage from "./pages/FriendsPage";
import RequestsPage from "./pages/RequestsPage";
import { BrowserRouter, Routes, Route } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route element={<AppLayout />}>
          <Route
            path="/feed"
            element={
              <Protected>
                <FeedPage />
              </Protected>
            }
          />
          <Route
            path="/create-post"
            element={
              <Protected>
                <CreatePost />
              </Protected>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected>
                <ProfilePage />
              </Protected>
            }
          />
          <Route
            path="/friends"
            element={
              <Protected>
                <FriendsPage />
              </Protected>
            }
          />
          <Route
            path="/requests"
            element={
              <Protected>
                <RequestsPage />
              </Protected>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
