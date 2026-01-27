import { useState, useEffect } from "react";
import { getUserRatings } from "../services/api";

function Profile({ user, theme }) {
  const [userStats, setUserStats] = useState({
    totalBooks: 0,
    avgRating: 0,
    favoriteGenre: "Unknown"
  });
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const ratings = await getUserRatings(user.user_id);
      setUserRatings(ratings);
      
      const books = Object.keys(ratings);
      const totalRatings = books.map(id => ratings[id].rating).filter(r => r);
      const avgRating = totalRatings.length > 0 
        ? (totalRatings.reduce((a, b) => a + b, 0) / totalRatings.length).toFixed(1)
        : 0;

      setUserStats({
        totalBooks: books.length,
        avgRating: avgRating,
        favoriteGenre: "Fiction" // Placeholder
      });
    } catch (err) {
      console.error("Failed to load user stats:", err);
    }
  };

  return (
    <section className={`min-h-screen ${theme === 'dark' ? 'text-white' : 'text-black'} px-6 md:px-12 py-8 relative`}>
      {/* Profile Header */}
      <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-8 rounded-3xl border mb-8`}>
        <div className="flex items-center gap-6">
          <div className="text-6xl">👤</div>
          <div>
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
              {user.name || user.email}
            </h1>
            <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} flex items-center gap-2 mt-2`}>
              <span className="animate-pulse">👑</span> {user.role}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-6 rounded-2xl border text-center hover:scale-105 transition-transform`}>
          <div className="text-4xl mb-2">📚</div>
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userStats.totalBooks}</h3>
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Books Read</p>
        </div>

        <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-6 rounded-2xl border text-center hover:scale-105 transition-transform`}>
          <div className="text-4xl mb-2">⭐</div>
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userStats.avgRating}</h3>
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Avg Rating</p>
        </div>

        <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-6 rounded-2xl border text-center hover:scale-105 transition-transform`}>
          <div className="text-4xl mb-2">🎭</div>
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userStats.favoriteGenre}</h3>
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Favorite Genre</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-8 rounded-3xl border`}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
          📖 Reading Activity
        </h2>
        
        {Object.keys(userRatings).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(userRatings).slice(0, 5).map(([bookId, data]) => (
              <div key={bookId} className={`${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} p-4 rounded-lg transition-colors`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Book ID: {bookId}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Status: {data.status}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{data.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-center py-8`}>
            No reading activity yet. Start rating some books!
          </p>
        )}
      </div>
    </section>
  );
}

export default Profile;