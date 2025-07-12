import {
  useGetAllUsersQuery,
  useGetMeQuery,
  useAcceptRequestMutation,
  useCancelRequestMutation,
} from "../features/friends/friendsApi";

export default function RequestsPage() {
  const { data: users = {}, isLoading: loadingUsers } = useGetAllUsersQuery();
  const { data: me, isLoading: loadingMe } = useGetMeQuery();
  const [acceptRequest] = useAcceptRequestMutation();
  const [rejectRequest] = useCancelRequestMutation();

  if (loadingUsers || loadingMe || !me) return <p>Loading...</p>;

  const incomingRequestUsers = me.data?.user?.friendRequests;
  console.log(me)

  const handleAccept = async (userId) => {
    try {
      await acceptRequest(userId).unwrap();
      alert("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Something went wrong while accepting the request.");
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectRequest(userId).unwrap();
      alert("Friend request rejected!");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Something went wrong while rejecting the request.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Friend Requests</h2>
      {incomingRequestUsers.length === 0 ? (
        <p>No incoming requests</p>
      ) : (
        incomingRequestUsers.map((user) => (
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
            <button
              onClick={() => handleAccept(user._id)}
              style={{ marginRight: "10px" }}
            >
              Accept
            </button>
            <button onClick={() => handleReject(user._id)}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
}
