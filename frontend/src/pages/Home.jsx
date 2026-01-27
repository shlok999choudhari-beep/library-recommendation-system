import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import BookSkeleton from "../components/BookSkeleton";
import { getRecommendations, getBooks, addBook, updateActivity, getUserRatings } from "../services/api";

function Home({ user, onLogout, theme }) {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddBook, setShowAddBook] = useState(false);
  const [ratings, setRatings] = useState({});
  const [statuses, setStatuses] = useState({});
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    description: ""
  });

  useEffect(() => {
    loadBooks();
    loadUserRatings();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await getBooks();
      setAllBooks(data);
      // Show only first 20 books initially
      setDisplayedBooks(data.slice(0, 20));
    } catch (err) {
      console.error("Failed to load books:", err);
    }
  };

  const loadUserRatings = async () => {
    try {
      const userRatings = await getUserRatings(user.user_id);
      const ratingsMap = {};
      const statusesMap = {};
      
      Object.keys(userRatings).forEach(bookId => {
        ratingsMap[bookId] = userRatings[bookId].rating;
        statusesMap[bookId] = userRatings[bookId].status;
      });
      
      setRatings(ratingsMap);
      setStatuses(statusesMap);
    } catch (err) {
      console.error("Failed to load user ratings:", err);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      // If search is empty, show first 20 books
      setDisplayedBooks(allBooks.slice(0, 20));
    } else {
      // Filter books by title (case insensitive)
      const filtered = allBooks.filter(book => 
        book.title.toLowerCase().includes(term.toLowerCase())
      );
      setDisplayedBooks(filtered);
    }
  };

  const handleRecommend = async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getRecommendations(user.user_id);
      setBooks(data);
    } catch (err) {
      setError("Failed to fetch recommendations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await addBook(newBook);
      setNewBook({ title: "", author: "", genre: "", description: "" });
      setShowAddBook(false);
      loadBooks();
    } catch (err) {
      setError("Failed to add book");
    }
  };

  const handleRating = async (bookId, rating) => {
    setRatings(prev => ({ ...prev, [bookId]: rating }));
  };

  const handleStatus = async (bookId, status) => {
    setStatuses(prev => ({ ...prev, [bookId]: status }));
  };

  const submitRating = async (bookId) => {
    const rating = ratings[bookId];
    const status = statuses[bookId] || "read";
    
    if (!rating) {
      setError("Please select a rating first");
      return;
    }
    
    try {
      await updateActivity({
        user_id: user.user_id,
        book_id: bookId,
        rating: rating,
        status: status
      });
      setError("Rating submitted successfully!");
      // Don't clear the rating after submission - keep it visible
    } catch (err) {
      setError("Failed to submit rating");
    }
  };

  return (
    <section className={`min-h-screen ${theme === 'dark' ? 'text-white' : 'text-black'} px-6 md:px-12 py-8 relative`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 relative gap-6">
        <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/80 border-gray-300/50 hover:bg-white/90 shadow-xl'} backdrop-blur-lg p-6 rounded-2xl border transition-all duration-300 group flex-1`}>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'} bg-clip-text text-transparent group-hover:scale-105 transition-transform`}>
            Welcome, {user.name || user.email}
          </h1>
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} flex items-center gap-2 mt-1`}>
            <span className="animate-pulse">👑</span> Role: {user.role}
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/80 border-gray-300/50 hover:bg-white/90 shadow-xl'} backdrop-blur-lg p-4 rounded-2xl border transition-all duration-300 text-center min-w-[120px]`}>
            <div className="text-3xl mb-1">📚</div>
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>3</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>This Month</div>
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/80 border-gray-300/50 hover:bg-white/90 shadow-xl'} backdrop-blur-lg p-4 rounded-2xl border transition-all duration-300 text-center min-w-[120px]`}>
            <div className="text-3xl mb-1">🔥</div>
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>7</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Day Streak</div>
          </div>
        </div>
        
        <div className="flex gap-4">
          {user.role === "admin" && (
            <button
              onClick={() => setShowAddBook(!showAddBook)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg border border-green-400/30 backdrop-blur"
            >
              📚 Add Book
            </button>
          )}
        </div>
      </div>

      {/* Add Book Form */}
      {showAddBook && (
        <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-6 rounded-lg mb-8`}>
          <h3 className="text-xl font-bold mb-4">Add New Book</h3>
          <form onSubmit={handleAddBook} className="grid grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({...newBook, title: e.target.value})}
              className="px-4 py-2 rounded text-black"
              required
            />
            <input
              placeholder="Author"
              value={newBook.author}
              onChange={(e) => setNewBook({...newBook, author: e.target.value})}
              className="px-4 py-2 rounded text-black"
              required
            />
            <input
              placeholder="Genre"
              value={newBook.genre}
              onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
              className="px-4 py-2 rounded text-black"
            />
            <textarea
              placeholder="Description"
              value={newBook.description}
              onChange={(e) => setNewBook({...newBook, description: e.target.value})}
              className="px-4 py-2 rounded text-black col-span-2"
              rows="3"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded col-span-2"
            >
              Add Book
            </button>
          </form>
        </div>
      )}

      {/* Recommendations Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative">
        <div className={`${theme === 'dark' ? 'bg-white/5 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-xl p-8 rounded-3xl border`}>
          <h2 className={`text-4xl font-extrabold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'} bg-clip-text text-transparent`}>
            ✨ Smart Book Recommendations
          </h2>

          <button
            onClick={handleRecommend}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 px-8 py-4 rounded-xl font-bold text-lg transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Loading Magic...
                </>
              ) : (
                <>
                  🔮 Get My Recommendations
                </>
              )}
            </span>
          </button>

          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur animate-fadeIn">
              <div className="flex items-center gap-2">
                <span>❌</span>
                {error}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {[...Array(3)].map((_, i) => (
            <BookSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Recommendations Results */}
      {!loading && books.length > 0 && (
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-3xl font-bold mb-8 text-center">
            Recommended for You
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {books.map((book, index) => (
              <BookCard key={index} {...book} />
            ))}
          </div>
        </div>
      )}

      {/* All Books */}
      {displayedBooks.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-4 text-center">
            All Books ({allBooks.length} total)
          </h3>
          
          {/* Search Bar */}
          <div className="mb-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search books by title..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-black'
              }`}
            />
          </div>
          
          <p className="text-center mb-4 text-sm opacity-75">
            Showing {displayedBooks.length} books
            {searchTerm && ` for "${searchTerm}"`}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedBooks.map((book) => (
              <div key={book.id} className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50 border border-gray-300'} p-4 rounded-lg`}>
                <h4 className="font-bold text-lg mb-2">{book.title}</h4>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>by {book.author}</p>
                <p className="text-blue-600 text-sm mb-2">{book.genre}</p>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm mb-3`}>{book.description}</p>
                
                {/* Rating System */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Rate:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(book.id, star)}
                      className={`text-lg ${
                        (ratings[book.id] || 0) >= star 
                          ? 'text-yellow-400' 
                          : 'text-gray-400'
                      } hover:text-yellow-500`}
                    >
                      ★
                    </button>
                  ))}
                  {ratings[book.id] && (
                    <span className="text-sm font-medium ml-2">
                      {ratings[book.id]} star{ratings[book.id] > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {/* Status Selector */}
                <select
                  value={statuses[book.id] || ""}
                  onChange={(e) => handleStatus(book.id, e.target.value)}
                  className="w-full px-2 py-1 rounded text-black text-sm mb-2"
                >
                  <option value="">Select Status</option>
                  <option value="read">Read</option>
                  <option value="reading">Currently Reading</option>
                  <option value="wishlist">Wishlist</option>
                </select>
                
                {/* Submit Button */}
                <button
                  onClick={() => submitRating(book.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Submit Rating
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Home;