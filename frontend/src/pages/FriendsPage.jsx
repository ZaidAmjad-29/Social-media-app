import { useState } from "react";
import {
  useGetAllUsersQuery,
  useGetMeQuery,
  useSendRequestMutation,
} from "../features/friends/friendsApi";
import { Search, UserPlus, Users, Loader2, Check, X } from "lucide-react";

export default function FriendsPage() {
  const { data: allUsersData = { users: [] }, isLoading, refetch } = useGetAllUsersQuery();
  const { data: meData } = useGetMeQuery();
  const [sendRequest] = useSendRequestMutation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [processingRequests, setProcessingRequests] = useState(new Set());
  const [sentRequests, setSentRequests] = useState(new Set());
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleSendRequest = async (userId, userName) => {
    if (processingRequests.has(userId) || sentRequests.has(userId)) return;
    
    setProcessingRequests(prev => new Set(prev).add(userId));
    
    try {
      await sendRequest(userId).unwrap();
      setSentRequests(prev => new Set(prev).add(userId));
      showNotification(`Friend request sent to ${userName}!`, 'success');
      refetch();
    } catch (error) {
      console.error("Failed to send request:", error);
      showNotification("Failed to send request. Please try again.", 'error');
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  if (isLoading || !meData) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  const myId = meData.user._id;
  const myFriends = meData.user.friends || [];
  const myFriendRequests = meData.user.friendRequests || [];
  const mySentRequests = meData.user.sentRequests || [];
  
  const friendIds = new Set(myFriends.map(f => f._id));
  const requestIds = new Set(myFriendRequests.map(r => r._id));
  const sentRequestIds = new Set(mySentRequests.map(r => r._id));

  const filteredUsers = allUsersData.data
    ?.filter((user) => user._id !== myId)
    ?.filter((user) => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const getUserStatus = (user) => {
    if (friendIds.has(user._id)) return 'friend';
    if (requestIds.has(user._id)) return 'pending_incoming';
    if (sentRequestIds.has(user._id) || sentRequests.has(user._id)) return 'pending_sent';
    return 'none';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`px-4 py-3 rounded-lg shadow-lg border-l-4 animate-slide-in ${
                notification.type === 'success' 
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-red-50 border-red-500 text-red-700'
              }`}
            >
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Discover People</h1>
                <p className="text-gray-600">
                  {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} to connect with
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No users found' : 'No users available'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Check back later for new people to connect with'
              }
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const status = getUserStatus(user);
            const isProcessing = processingRequests.has(user._id);
            
            return (
              <div
                key={user._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-105"
              >
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={`http://localhost:3000${user.profileImage}`}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-purple-100 mx-auto"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80/9333ea/white?text=' + (user.name?.charAt(0) || 'U');
                      }}
                    />
                    {status === 'friend' && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {user.name}
                  </h3>
                  
                  {user.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                      {user.bio}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-xs text-gray-500">
                      {user.mutualFriends || 0} mutual friends
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      {user.location || 'Location not set'}
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="w-full">
                    {status === 'friend' ? (
                      <button
                        disabled
                        className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium bg-green-100 text-green-700 cursor-not-allowed"
                      >
                        <Check className="h-4 w-4" />
                        <span>Friends</span>
                      </button>
                    ) : status === 'pending_incoming' ? (
                      <button
                        disabled
                        className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium bg-blue-100 text-blue-700 cursor-not-allowed"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Wants to be Friends</span>
                      </button>
                    ) : status === 'pending_sent' ? (
                      <button
                        disabled
                        className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium bg-yellow-100 text-yellow-700 cursor-not-allowed"
                      >
                        <X className="h-4 w-4" />
                        <span>Request Sent</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(user._id, user.name)}
                        disabled={isProcessing}
                        className={`w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          isProcessing
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md'
                        }`}
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserPlus className="h-4 w-4" />
                        )}
                        <span>
                          {isProcessing ? 'Sending...' : 'Send Request'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Stats */}
      {filteredUsers.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Friends</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Request Sent</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Wants to be Friends</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}