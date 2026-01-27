import { useState } from "react";

function NamePopup({ onSubmit, theme }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} p-8 rounded-2xl border shadow-2xl max-w-md w-full mx-4 relative z-50`}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">👋</div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>
            Welcome to My Library!
          </h2>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            What should we call you?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4`}
            required
            autoFocus
          />
          
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Continue 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

export default NamePopup;