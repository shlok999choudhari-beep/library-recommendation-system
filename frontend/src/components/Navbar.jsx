import { BookOpen, Sparkles, LogOut, User, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ user, onLogout, theme, toggleTheme }) {
  const location = useLocation();

  return (
    <nav className={`w-full ${theme === 'dark' ? 'bg-black/40 border-gray-700/50' : 'bg-white/60 border-blue-200/50 shadow-lg'} backdrop-blur-xl border-b px-8 py-4 relative overflow-hidden`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-800/20 via-black/20 to-gray-700/20' : 'bg-gradient-to-r from-blue-100/30 via-indigo-100/30 to-purple-100/30'} animate-pulse`}></div>
      
      <div className="relative flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="text-3xl animate-bounce">📚</div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-white via-gray-300 to-gray-400' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'} bg-clip-text text-transparent`}>
              My Library
            </h1>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex gap-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg transition-all ${location.pathname === '/' ? 'bg-blue-500/20 text-blue-400' : `${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-800'} hover:bg-white/10`}`}
            >
              🏠 Home
            </Link>
            <Link 
              to="/browse" 
              className={`px-3 py-2 rounded-lg transition-all ${location.pathname === '/browse' ? 'bg-blue-500/20 text-blue-400' : `${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-800'} hover:bg-white/10`}`}
            >
              🔍 Browse
            </Link>
            <Link 
              to="/library" 
              className={`px-3 py-2 rounded-lg transition-all ${location.pathname === '/library' ? 'bg-blue-500/20 text-blue-400' : `${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-800'} hover:bg-white/10`}`}
            >
              📚 Library
            </Link>
            {user.role !== 'admin' && (
              <Link 
                to="/books" 
                className={`px-3 py-2 rounded-lg transition-all ${location.pathname === '/books' ? 'bg-blue-500/20 text-blue-400' : `${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-800'} hover:bg-white/10`}`}
              >
                📚 Request Books
              </Link>
            )}
            {user.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded-lg transition-all ${location.pathname === '/admin' ? 'bg-blue-500/20 text-blue-400' : `${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-800'} hover:bg-white/10`}`}
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
              className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white hover:text-blue-400 bg-white/10 border-white/20 hover:bg-white/20' : 'text-blue-700 hover:text-purple-600 bg-blue-100/50 border-blue-300/50 hover:bg-blue-200/50 shadow-md'} cursor-pointer hover:scale-105 transition-all duration-200 p-2 rounded-lg border`}
            >
              {theme === 'dark' ? <Sun size={16} className="animate-pulse" /> : <Moon size={16} className="animate-pulse" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </li>
          <li>
            <Link
              to="/profile"
              className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white hover:text-blue-400 bg-white/10 border-white/20 hover:bg-white/20' : 'text-blue-700 hover:text-purple-600 bg-blue-100/50 border-blue-300/50 hover:bg-blue-200/50 shadow-md'} cursor-pointer hover:scale-105 transition-all duration-200 p-2 rounded-lg border`}
            >
              <User size={16} className="text-green-500 animate-pulse" />
              <span>Profile</span>
              <span className={`text-xs ${theme === 'dark' ? 'bg-gradient-to-r from-gray-600 to-gray-700' : 'bg-gradient-to-r from-blue-500 to-purple-500'} px-2 py-1 rounded-full text-white font-medium`}>
                {user?.role}
              </span>
            </Link>
          </li>
          <li>
            <button
              onClick={onLogout}
              className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white hover:text-red-400 bg-white/10 border-white/20 hover:bg-red-500/20 hover:border-red-500/50' : 'text-red-600 hover:text-red-700 bg-red-100/50 border-red-300/50 hover:bg-red-200/50 hover:border-red-400/50 shadow-md'} cursor-pointer hover:scale-105 transition-all duration-200 p-2 rounded-lg border`}
            >
              <LogOut size={16} /> 
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;