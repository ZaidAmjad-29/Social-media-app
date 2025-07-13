import { useState } from "react";
import {
  useGetMeQuery,
  useAcceptRequestMutation,
  useRejectRequestMutation,
} from "../features/friends/friendsApi";
import { Check, X, Users, Heart, Loader2, UserPlus } from "lucide-react";

export default function RequestsPage() {
  const { data: meData, isLoading, refetch } = useGetMeQuery();
  const [acceptRequest] = useAcceptRequestMutation();
  const [rejectRequest] = useRejectRequestMutation();
  
  const [processingRequests, setProcessingRequests] = useState(new Set());
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleAcceptRequest = async (userId, userName) => {
    if (processingRequests.has(userId)) return;
    
    setProcessingRequests(prev => new Set(prev).add(userId));
    
    try {
      await acceptRequest(userId).unwrap();
      showNotification(`${userName} is now your friend!`, 'success');
      refetch();
    } catch (error) {
      console.error("Failed to accept request:", error);
      showNotification("Failed to accept request. Please try again.", 'error');
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (userId, userName) => {
    if (processingRequests.has(userId)) return;
    
    setProcessingRequests(prev => new Set(prev).add(userId));
    
    try {
      await rejectRequest(userId).unwrap();
      showNotification(`Request from ${userName} declined`, 'info');
      refetch();
    } catch (error) {
      console.error("Failed to reject request:", error);
      showNotification("Failed to reject request. Please try again.", 'error');
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
          <p className="text-gray-600">Loading friend requests...</p>
        </div>
      </div>
    );
  }

  const requests = meData.user.friendRequests || [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`px-4 py-3 rounded-lg shadow-lg border-l-4 animate-slide-in ${
                notification.type === 'success' 
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : notification.type === 'error'
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : 'bg-blue-50 border-blue-500 text-blue-700'
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
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Friend Requests</h1>
              <p className="text-gray-600">
                {requests.length === 0 
                  ? "No pending requests" 
                  : `${requests.length} pending ${requests.length === 1 ? 'request' : 'requests'}`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Request List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Friend Requests</h3>
            <p className="text-gray-600 mb-6">
              You don't have any pending friend requests right now.
            </p>
            <div className="text-sm text-gray-500">
              <p>When someone sends you a friend request, it will appear here.</p>
            </div>
          </div>
        ) : (
          requests.map((user) => {
            const isProcessing = processingRequests.has(user._id);
            
            return (
              <div
                key={user._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={`http://localhost:3000${user.profileImage}`}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-100"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64x64/9333ea/white?text=' + (user.name?.charAt(0) || 'U');
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <UserPlus className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {user.name}
                      </h3>
                      {user.bio && (
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {user.mutualFriends ? `${user.mutualFriends} mutual friends` : 'New connection'}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                          2 days ago
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleAcceptRequest(user._id, user.name)}
                      disabled={isProcessing}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        isProcessing
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span>Accept</span>
                    </button>
                    
                    <button
                      onClick={() => handleRejectRequest(user._id, user.name)}
                      disabled={isProcessing}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        isProcessing
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-600 text-white hover:bg-gray-700 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      {requests.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            <span className="font-medium">Tip:</span> You can always change your mind later by visiting their profile.
          </p>
        </div>
      )}
    </div>
  );
}