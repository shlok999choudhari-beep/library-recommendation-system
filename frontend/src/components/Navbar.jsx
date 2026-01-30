import { BookOpen, Sparkles, LogOut, User, Sun, Moon, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../services/api";

function Navbar({ user, onLogout, theme, toggleTheme }) {
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications(user.user_id);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead(user.user_id);
      loadNotifications();
      setShowNotifications(false);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className={`w-full ${theme === 'dark' ? 'bg-black/40 border-gray-700/50' : 'bg-white/70 border-stone-200/50 shadow-sm'} backdrop-blur-xl border-b px-8 py-4 relative overflow-visible z-50 transition-all duration-300`}>
      {/* Animated background gradient - Subtle for Glass effect */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-800/20 via-black/20 to-gray-700/20' : 'bg-gradient-to-r from-white/40 via-stone-50/40 to-white/40'} pointer-events-none`}></div>
      
      <div className="relative flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="text-3xl animate-bounce">📚</div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent' : 'text-gray-900'} group-hover:opacity-80 transition-opacity`}>
              My Library
            </h1>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex gap-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg transition-all font-medium ${location.pathname === '/' ? 'bg-stone-900 text-white shadow-md' : `${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-stone-600 hover:text-stone-900'} hover:bg-stone-200/50`}`}
            >
              🏠 Home
            </Link>
            <Link 
              to="/browse" 
              className={`px-3 py-2 rounded-lg transition-all font-medium ${location.pathname === '/browse' ? 'bg-stone-900 text-white shadow-md' : `${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-stone-600 hover:text-stone-900'} hover:bg-stone-200/50`}`}
            >
              🔍 Browse
            </Link>
            {user.role !== 'admin' && (
              <Link 
                to="/library" 
                className={`px-3 py-2 rounded-lg transition-all font-medium ${location.pathname === '/library' ? 'bg-stone-900 text-white shadow-md' : `${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-stone-600 hover:text-stone-900'} hover:bg-stone-200/50`}`}
              >
                📚 Library
              </Link>
            )}
            {user.role !== 'admin' && (
              <Link 
                to="/books" 
                className={`px-3 py-2 rounded-lg transition-all font-medium ${location.pathname === '/books' ? 'bg-stone-900 text-white shadow-md' : `${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-stone-600 hover:text-stone-900'} hover:bg-stone-200/50`}`}
              >
                📚 Request Books
              </Link>
            )}
            {user.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded-lg transition-all font-medium ${location.pathname === '/admin' ? 'bg-stone-900 text-white shadow-md' : `${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-stone-600 hover:text-stone-900'} hover:bg-stone-200/50`}`}
              >
                🛠️ Admin
              </Link>
            )}
          </div>
        </div>

        <ul className="flex gap-6 text-sm items-center">
          <li>
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white hover:text-blue-400 bg-white/10 border-white/20 hover:bg-white/20' : 'text-stone-700 hover:text-stone-900 bg-white/50 border-stone-200 hover:bg-white hover:border-stone-300 shadow-sm'} cursor-pointer hover:scale-105 transition-all duration-200 p-2 rounded-lg border`}
            >
              {theme === 'dark' ? <Sun size={16} className="animate-pulse" /> : <Moon size={16} className="animate-pulse" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </li>
          <li>
            <Link
              to="/profile"
              className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white hover:text-blue-400 bg-white/10 border-white/20 hover:bg-white/20' : 'text-stone-700 hover:text-stone-900 bg-white/50 border-stone-200 hover:bg-white hover:border-stone-300 shadow-sm'} cursor-pointer hover:scale-105 transition-all duration-200 p-2 rounded-lg border`}
            >
              <User size={16} className="text-green-500 animate-pulse" />
              <span>Profile</span>
            </Link>
          </li>
          <li className="relative z-[100]">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white hover:text-blue-400 bg-white/10 border-white/20 hover:bg-white/20' : 'text-stone-700 hover:text-stone-900 bg-white/50 border-stone-200 hover:bg-white hover:border-stone-300 shadow-sm'} cursor-pointer hover:scale-105 transition-all duration-200 p-2 rounded-lg border relative`}
            >
              <Bell size={16} className="animate-pulse" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white/90 backdrop-blur-xl border-stone-200'} border rounded-lg shadow-2xl z-[9999] max-h-96 overflow-y-auto`}>
                <div className={`p-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-stone-200'} flex justify-between items-center`}>
                  <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-stone-800'}`}>Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                {notifications.length > 0 ? (
                  <div>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`p-3 border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : 'border-stone-100 hover:bg-stone-50'} cursor-pointer transition-colors`}
                      >
                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-stone-800'}`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-stone-500'} mt-1`}>
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-stone-500'}`}>
                      No new notifications
                    </p>
                  </div>
                )}
              </div>
            )}
          </li>
          <li>
            <button
              onClick={handleLogoutClick}
              className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white hover:text-red-400 bg-white/10 border-white/20 hover:bg-red-500/20 hover:border-red-500/50' : 'text-red-600 hover:text-red-700 bg-red-50 border-red-200 hover:bg-red-100 shadow-sm'} cursor-pointer hover:scale-105 transition-all duration-200 p-2 rounded-lg border`}
            >
              <LogOut size={16} />
            </button>
          </li>
        </ul>
      </div>
    </nav>

    {/* Logout Confirmation Popup */}
    {showLogoutConfirm && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} border rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 animate-scale-in`}>
          <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Confirm Logout
          </h3>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Are you sure you want to logout?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={cancelLogout}
              className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default Navbar;