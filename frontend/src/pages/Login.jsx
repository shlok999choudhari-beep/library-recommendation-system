import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("user");
  const [adminPin, setAdminPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);

      let response;
      if (isRegister) {
        const userData = { email, password, role };
        if (role === "admin") {
          userData.admin_pin = adminPin;
        }
        response = await registerUser(userData);
        setError("Registration successful! Please login.");
        setIsRegister(false);
      } else {
        response = await loginUser({ email, password });
        onLogin(response);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Navbar */}
      <nav className="w-full bg-black/40 backdrop-blur-lg border-b border-gray-700/50 px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">📚</div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
            My Library
          </h1>
        </div>
      </nav>

      {/* Login Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-white px-4">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
          
          <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl w-96 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-bounce">🔐</div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {isRegister ? "Join Library" : "Welcome Back"}
              </h2>
              <p className="text-white/70 mt-2">
                {isRegister ? "Create your reading account" : "Continue your reading journey"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <input
                  type="email"
                  placeholder="📧 Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative w-full px-4 py-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <input
                  type="password"
                  placeholder="🔒 Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative w-full px-4 py-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
                  required
                />
              </div>

              {isRegister && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="relative w-full px-4 py-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                  >
                    <option value="user" className="bg-gray-800 text-white">👤 Regular User</option>
                    <option value="admin" className="bg-gray-800 text-white">👑 Administrator</option>
                  </select>
                </div>
              )}

              {isRegister && role === "admin" && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-lg blur opacity-75 animate-pulse"></div>
                  <input
                    type="password"
                    placeholder="🔐 Admin PIN (Secret Code)"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="relative w-full px-4 py-4 rounded-lg bg-yellow-500/10 backdrop-blur border border-yellow-400/40 text-white placeholder-yellow-200/80 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                    required
                  />
                </div>
              )}

              {error && (
                <div className={`p-4 rounded-lg text-sm backdrop-blur border ${error.includes('successful') ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'} animate-fadeIn`}>
                  <div className="flex items-center gap-2">
                    <span>{error.includes('successful') ? '✅' : '❌'}</span>
                    {error}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 py-4 rounded-lg font-bold text-lg disabled:opacity-50 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {loading ? (
                  <div className="flex items-center justify-center relative z-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Processing...
                  </div>
                ) : (
                  <span className="relative z-10">
                    {isRegister ? "🚀 Create Account" : "✨ Sign In"}
                  </span>
                )}
              </button>
            </form>

            <div className="text-center mt-8">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>
              <p className="text-white/60 text-sm mb-3">
                {isRegister ? "Already part of our community?" : "New to My Library?"}
              </p>
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                  setAdminPin("");
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-all duration-200 text-lg"
              >
                {isRegister ? "Sign In Instead" : "Join Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;