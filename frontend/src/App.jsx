import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NamePopup from "./components/NamePopup";
import { updateUserName } from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [showNamePopup, setShowNamePopup] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    // Show name popup if user doesn't have a name set
    if (!userData.name || userData.name === userData.email.split('@')[0]) {
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

  const handleLogout = () => {
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
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100'} relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className={`absolute top-20 left-10 w-32 h-32 ${theme === 'dark' ? 'bg-white/5' : 'bg-blue-300/40'} rounded-full blur-xl animate-pulse`}></div>
        <div className={`absolute bottom-20 right-10 w-40 h-40 ${theme === 'dark' ? 'bg-gray-500/10' : 'bg-purple-300/40'} rounded-full blur-xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/3 w-24 h-24 ${theme === 'dark' ? 'bg-white/5' : 'bg-pink-300/40'} rounded-full blur-xl animate-pulse delay-500`}></div>
        <div className={`absolute top-1/3 right-1/4 w-28 h-28 ${theme === 'dark' ? 'bg-gray-400/5' : 'bg-indigo-300/30'} rounded-full blur-xl animate-pulse delay-700`}></div>
        <div className={`absolute bottom-1/3 left-1/4 w-36 h-36 ${theme === 'dark' ? 'bg-white/3' : 'bg-cyan-300/30'} rounded-full blur-xl animate-pulse delay-300`}></div>
        
        <Navbar user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
        
        <Routes>
          <Route path="/" element={<Home user={user} onLogout={handleLogout} theme={theme} />} />
          <Route path="/profile" element={<Profile user={user} theme={theme} />} />
        </Routes>
        
        {showNamePopup && (
          <NamePopup onSubmit={handleNameSubmit} theme={theme} />
        )}
      </div>
    </Router>
  );
}

export default App