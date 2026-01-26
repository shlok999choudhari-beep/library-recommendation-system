import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("user");
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
        response = await registerUser({ email, password, role });
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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <div className="bg-gray-900 p-8 rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? "Register" : "Login"} 📚
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded mb-4 text-black"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded mb-4 text-black"
            required
          />

          {isRegister && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded mb-4 text-black"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}

          {error && (
            <p className={`text-sm mb-4 ${error.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Loading..." : (isRegister ? "Register" : "Login")}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-400">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-blue-400 hover:text-blue-300 ml-1"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;