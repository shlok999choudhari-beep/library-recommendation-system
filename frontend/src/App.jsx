import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FloatingChat from "./components/FloatingChat";

import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";
import Library from "./pages/Library";
import Books from "./pages/Books";
import Admin from "./pages/Admin";

import Login from "./pages/Login";
import NamePopup from "./components/NamePopup";
import { updateUserName } from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [showNamePopup, setShowNamePopup] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    // Show name popup only if user doesn't have a name set AND it's not just the email prefix
    if (!userData.name || userData.name.trim() === '' || userData.name === userData.email.split('@')[0]) {
      setShowNamePopup(true);
    }
  };

  const handleNameSubmit = async (name) => {
    try {
      await updateUserName(user.user_id, name);
      setUser({ ...user, name });
      setShowNamePopup(false);
    } catch (err) {
      console.error("Failed to update name:", err);
    }
  };

  const handleLogout = async () => {

    setUser(null);
    setShowNamePopup(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!user) {
    return <Login onLogin={handleLogin} theme={theme} />;
  }

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' : 'bg-stone-50'} relative overflow-hidden`}>
        {/* Animated background elements - Stone & Glass Theme */}
        <div className={`absolute top-20 left-10 w-96 h-96 ${theme === 'dark' ? 'bg-white/5' : 'bg-orange-100/40'} rounded-full blur-3xl opacity-40 animate-blob`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 ${theme === 'dark' ? 'bg-gray-500/10' : 'bg-stone-200/40'} rounded-full blur-3xl opacity-40 animate-blob animation-delay-2000`}></div>
        <div className={`absolute top-1/2 left-1/3 w-80 h-80 ${theme === 'dark' ? 'bg-white/5' : 'bg-stone-100/40'} rounded-full blur-3xl opacity-40 animate-blob animation-delay-4000`}></div>
        
        <Navbar user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
        
        <Routes>
          <Route path="/" element={<Home user={user} onLogout={handleLogout} theme={theme} />} />
          <Route path="/browse" element={<Browse user={user} theme={theme} />} />
          <Route path="/profile" element={<Profile user={user} theme={theme} />} />
          <Route path="/library" element={<Library user={user} theme={theme} />} />
          <Route path="/books" element={<Books user={user} theme={theme} />} />
          <Route path="/admin" element={<Admin user={user} theme={theme} />} />

        </Routes>
        
        {showNamePopup && (
          <NamePopup onSubmit={handleNameSubmit} theme={theme} />
        )}
        
        <FloatingChat user={user} theme={theme} />
        

      </div>
    </Router>
  );
}

export default App