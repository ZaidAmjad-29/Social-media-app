import {
  useGetAllUsersQuery,
  useGetMeQuery,
  useSendRequestMutation,
} from "../features/friends/friendsApi";

export default function FriendsPage() {
  const { data: users = [], isLoading: loadingUsers } = useGetAllUsersQuery();
  const { data: me, isLoading: loadingMe } = useGetMeQuery();
  const [sendRequest] = useSendRequestMutation();

  if (loadingUsers || loadingMe || !me) return <p>Loading...</p>;
  console.log("Users:", users);
  console.log("Me:", me);

  const handleSendRequest = async (userId) => {
    try {
      await sendRequest(userId).unwrap();
      alert("Friend request sent!");
    } catch (error) {
      console.error("Failed to send request:", error);
      alert("Error sending friend request");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Users</h2>
      {users.data
        .filter((user) => user._id !== me.data.user._id)
        .map((user) => (
          <div
            key={user._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h4>{user.name}</h4>
            <p>{user.bio}</p>
            <button onClick={() => handleSendRequest(user._id)}>
              Send Friend Request
            </button>
          </div>
        ))}
    </div>
  );
}
