import { BookOpen, Sparkles, LogOut, User } from "lucide-react";

function Navbar({ user, onLogout }) {
  return (
    <nav className="w-full bg-gray-900 text-white px-8 py-4 flex justify-between items-center border-b border-gray-800">
      <div className="flex items-center gap-2">
        <BookOpen className="text-blue-500" />
        <h1 className="text-xl font-bold">LibraryAI</h1>
      </div>

      <ul className="flex gap-6 text-sm items-center">
        <li className="flex items-center gap-1">
          <Sparkles size={16} className="text-blue-400" /> 
          <span>Recommendations</span>
        </li>
        <li className="flex items-center gap-2">
          <User size={16} className="text-green-400" />
          <span>{user?.email}</span>
          <span className="text-xs bg-blue-600 px-2 py-1 rounded">
            {user?.role}
          </span>
        </li>
        <li>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 hover:text-red-400 cursor-pointer"
          >
            <LogOut size={16} /> Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;