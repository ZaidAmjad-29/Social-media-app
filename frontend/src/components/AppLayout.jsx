import { Link, Outlet } from "react-router";
import { Home, PlusSquare, User, Users, Heart } from "lucide-react";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/feed" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SocialApp
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <Link 
                to="/feed" 
                className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                title="Feed"
              >
                <Home className="h-6 w-6 text-gray-700 group-hover:text-purple-600 transition-colors" />
              </Link>
              
              <Link 
                to="/create-post" 
                className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                title="Create Post"
              >
                <PlusSquare className="h-6 w-6 text-gray-700 group-hover:text-purple-600 transition-colors" />
              </Link>
              
              <Link 
                to="/requests" 
                className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group relative"
                title="Requests"
              >
                <Heart className="h-6 w-6 text-gray-700 group-hover:text-purple-600 transition-colors" />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Link>
              
              <Link 
                to="/friends" 
                className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                title="Friends"
              >
                <Users className="h-6 w-6 text-gray-700 group-hover:text-purple-600 transition-colors" />
              </Link>
              
              <Link 
                to="/profile" 
                className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                title="Profile"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex items-center justify-around py-2">
          <Link 
            to="/feed" 
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <Home className="h-6 w-6 text-gray-700 group-hover:text-purple-600 transition-colors" />
            <span className="text-xs text-gray-600 mt-1">Feed</span>
          </Link>
          
          <Link 
            to="/create-post" 
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <PlusSquare className="h-6 w-6 text-gray-700 group-hover:text-purple-600 transition-colors" />
            <span className="text-xs text-gray-600 mt-1">Create</span>
          </Link>
          
          <Link 
            to="/requests" 
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group relative"
          >
            <Heart className="h-6 w-6 text-gray-700 group-hover:text-purple-600 transition-colors" />
            <span className="text-xs text-gray-600 mt-1">Requests</span>
            <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Link>
          
          <Link 
            to="/friends" 
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <Users className="h-6 w-6 text-gray-700 group-hover:text-purple-600 transition-colors" />
            <span className="text-xs text-gray-600 mt-1">Friends</span>
          </Link>
          
          <Link 
            to="/profile" 
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div className="h-6 w-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs text-gray-600 mt-1">Profile</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 pb-20 md:pb-6">
        <Outlet />
      </main>
    </div>
  );
}