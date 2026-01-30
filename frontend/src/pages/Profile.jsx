import { useState, useEffect } from "react";
import { getUserRatings, updateUserName, getUserStats } from "../services/api";

function Profile({ user, theme }) {
  const [userStats, setUserStats] = useState({
    total_books_read: 0,
    avgRating: 0,
    favoriteGenre: "Unknown",
    books_this_month: 0,
    currently_reading: 0,
    wishlist_count: 0
  });
  const [userRatings, setUserRatings] = useState({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name || "");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadUserStats();
    loadUserRatings();
  }, []);

  const handleNameUpdate = async () => {
    try {
      await updateUserName(user.user_id, newName);
      user.name = newName; // Update user object
      setIsEditingName(false);
      setNotification("Name updated successfully!");
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error("Failed to update name:", err);
    }
  };

  const loadUserRatings = async () => {
    try {
      const ratings = await getUserRatings(user.user_id);
      console.log("Ratings data:", ratings); // Debug log
      setUserRatings(ratings);
      
      // Only calculate average rating from read books
      const readBooks = Object.values(ratings).filter(book => book.status === 'read');
      const totalRatings = readBooks.map(book => book.rating).filter(r => r);
      const avgRating = totalRatings.length > 0 
        ? (totalRatings.reduce((a, b) => a + b, 0) / totalRatings.length).toFixed(1)
        : 0;

      setUserStats(prev => ({
        ...prev,
        avgRating: avgRating
      }));
    } catch (err) {
      console.error("Failed to load user ratings:", err);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await getUserStats(user.user_id);
      setUserStats(prev => ({
        ...prev,
        favorite_genre: stats.favorite_genre || "Unknown",
        ...stats
      }));
    } catch (err) {
      console.error("Failed to load user stats:", err);
    }
  };

  return (
    <section className={`min-h-screen ${theme === 'dark' ? 'text-white' : 'text-black'} px-6 md:px-12 py-8 relative`}>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          ✅ {notification}
        </div>
      )}
      {/* Profile Header */}
      <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-8 rounded-3xl border mb-8`}>
        <div className="flex items-center gap-6">
          <div className="text-6xl">👤</div>
          <div>
            {isEditingName ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-2xl font-bold bg-transparent border-b-2 border-blue-400 outline-none"
                />
                <button onClick={handleNameUpdate} className="text-green-400 hover:text-green-300">✅</button>
                <button onClick={() => setIsEditingName(false)} className="text-red-400 hover:text-red-300">❌</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
                  {user.name || user.email}
                </h1>
                <button onClick={() => setIsEditingName(true)} className="text-blue-400 hover:text-blue-300">✏️</button>
              </div>
            )}
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
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userStats.total_books_read}</h3>
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Books Read</p>
        </div>

        <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-6 rounded-2xl border text-center hover:scale-105 transition-transform`}>
          <div className="text-4xl mb-2">🏆</div>
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>#{userStats.user_rank || 'N/A'}</h3>
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Rank</p>
        </div>

        <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-6 rounded-2xl border text-center hover:scale-105 transition-transform`}>
          <div className="text-4xl mb-2">🎭</div>
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userStats.favorite_genre}</h3>
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
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{data.title || `Book ID: ${bookId}`}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Status: {data.status}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{data.avg_rating || data.rating}</span>
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