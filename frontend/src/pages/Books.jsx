import { useState } from "react";
import { requestNewBook } from "../services/api";

function Books({ user, theme }) {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookTitle.trim() || !author.trim()) return;

    try {
      await requestNewBook(user.user_id, bookTitle, author);
      setNotification("Book request submitted successfully!");
      setTimeout(() => setNotification(null), 3000);
      setBookTitle("");
      setAuthor("");
    } catch (err) {
      setNotification("Failed to submit book request");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <section className={`min-h-screen ${theme === 'dark' ? 'text-white' : 'text-black'} px-6 md:px-12 py-8`}>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          ✅ {notification}
        </div>
      )}

      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-8 rounded-3xl border mb-8`}>
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
          📚 Request New Books
        </h1>
        <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mt-2`}>
          Can't find a book you want? Request it here and we'll consider adding it to our library!
        </p>
      </div>

      {/* Request Form */}
      <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-8 rounded-3xl border max-w-2xl mx-auto`}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
          📝 Book Request Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
              Book Title *
            </label>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="Enter the book title"
              className={`w-full px-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-black placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
              Author *
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter the author's name"
              className={`w-full px-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-black placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!bookTitle.trim() || !author.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            📤 Submit Request
          </button>
        </form>

        <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-300'} border`}>
          <h3 className="font-semibold mb-2 text-blue-500">📋 Request Guidelines</h3>
          <ul className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} space-y-1`}>
            <li>• Please provide accurate book title and author name</li>
            <li>• Requests are reviewed by library administrators</li>
            <li>• Popular and educational books are prioritized</li>
            <li>• You'll be notified once your request is processed</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Books;