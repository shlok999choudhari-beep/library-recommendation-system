import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import BookSkeleton from "../components/BookSkeleton";
import BookModal from "../components/BookModal";
import BookRow from "../components/BookRow";
import GenreOnboarding from "../components/GenreOnboarding";
import { getRecommendations, getBooks, getWeeklyTopBooks, addBook, updateActivity, getUserRatings, getUserStats, getUserPreferences, updateUserPreferences, getWishlistBooks, issueBook, getIssuedBooks, returnBook } from "../services/api";

function Home({ user, onLogout, theme }) {
  const [books, setBooks] = useState([]);
  const [weeklyTopBooks, setWeeklyTopBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddBook, setShowAddBook] = useState(false);
  const [notification, setNotification] = useState(null);
  const [ratings, setRatings] = useState({});
  const [statuses, setStatuses] = useState({});
  const [userStats, setUserStats] = useState({
    books_this_month: 0,
    total_books_read: 0,
    currently_reading: 0,
    wishlist_count: 0
  });
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardPosition, setCardPosition] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [genreBooks, setGenreBooks] = useState({});
  const [currentlyReadingBooks, setCurrentlyReadingBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    description: ""
  });

  useEffect(() => {
    loadBooks();
    loadUserRatings();
    loadRecommendations();
    loadUserStats();
    loadIssuedBooks();
    loadWeeklyTopBooks();
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (allBooks.length > 0) {
      loadCurrentlyReadingBooks();
    }
  }, [allBooks]);

  const loadBooks = async () => {
    try {
      const data = await getBooks();
      setAllBooks(data);
      setDisplayedBooks(data.slice(0, 20));
      
      // Get top 12 genres by book count
      const genreCounts = {};
      data.forEach(book => {
        if (book.genre) {
          genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
        }
      });
      
      const topGenres = Object.entries(genreCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 12)
        .map(([genre]) => genre);
      
      setAvailableGenres(topGenres);
      
      // Group books by genre for Netflix-style rows
      const booksByGenre = {};
      topGenres.slice(0, 5).forEach(genre => {
        booksByGenre[genre] = data.filter(book => book.genre === genre).slice(0, 10);
      });
      setGenreBooks(booksByGenre);
      
    } catch (err) {
      console.error("Failed to load books:", err);
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const prefs = await getUserPreferences(user.user_id);
      setShowOnboarding(!prefs.onboarding_completed);
    } catch (err) {
      console.error("Failed to check onboarding status:", err);
    }
  };

  const handleOnboardingComplete = async (selectedGenres) => {
    try {
      await updateUserPreferences(user.user_id, selectedGenres);
      setShowOnboarding(false);
      loadRecommendations(); // Reload recommendations with preferences
    } catch (err) {
      console.error("Failed to save preferences:", err);
    }
  };

  const loadWishlistBooks = async () => {
    try {
      const wishlist = await getWishlistBooks(user.user_id);
      setWishlistBooks(wishlist);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    }
  };

  const loadCurrentlyReadingBooks = async () => {
    try {
      const userRatings = await getUserRatings(user.user_id);
      const readingBookIds = Object.keys(userRatings).filter(
        bookId => userRatings[bookId].status === 'reading'
      );
      
      const readingBooks = allBooks.filter(book => 
        readingBookIds.includes(book.id.toString())
      );
      
      setCurrentlyReadingBooks(readingBooks);
    } catch (err) {
      console.error("Failed to load currently reading books:", err);
    }
  };

  const toggleWishlistDropdown = () => {
    if (!showWishlistDropdown) {
      loadWishlistBooks();
    }
    setShowWishlistDropdown(!showWishlistDropdown);
  };

  const loadIssuedBooks = async () => {
    try {
      const issued = await getIssuedBooks(user.user_id);
      setIssuedBooks(issued);
    } catch (err) {
      console.error("Failed to load issued books:", err);
    }
  };

  const loadWeeklyTopBooks = async () => {
    try {
      const weeklyTop = await getWeeklyTopBooks();
      setWeeklyTopBooks(weeklyTop);
    } catch (err) {
      console.error("Failed to load weekly top books:", err);
    }
  };

  const handleIssueBook = async (bookId) => {
    try {
      await issueBook(user.user_id, bookId);
      setNotification("Book issue request submitted!");
      setTimeout(() => setNotification(null), 3000);
      loadIssuedBooks();
    } catch (err) {
      setNotification("Failed to issue book");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleReturnBook = async (issueId) => {
    try {
      await returnBook(issueId);
      setNotification("Book returned successfully!");
      setTimeout(() => setNotification(null), 3000);
      loadIssuedBooks();
    } catch (err) {
      setNotification("Failed to return book");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleModalRate = async (bookId, rating, status) => {
    try {
      await updateActivity({
        user_id: user.user_id,
        book_id: bookId,
        rating: rating,
        status: status
      });
      setNotification("Book rated successfully!");
      setTimeout(() => setNotification(null), 3000);
      loadUserStats();
    } catch (err) {
      setNotification("Failed to rate book");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleModalWishlist = async (bookId) => {
    try {
      await updateActivity({
        user_id: user.user_id,
        book_id: bookId,
        rating: 0,
        status: "wishlist"
      });
      setNotification("Added to wishlist!");
      setTimeout(() => setNotification(null), 3000);
      loadUserStats();
    } catch (err) {
      setNotification("Failed to add to wishlist");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await getUserStats(user.user_id);
      setUserStats(stats);
    } catch (err) {
      console.error("Failed to load user stats:", err);
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

  const loadRecommendations = async () => {
    try {
      setError("");
      const data = await getRecommendations(user.user_id);
      setBooks(data);
    } catch (err) {
      setError("Failed to fetch recommendations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFilters(term, genreFilter, ratingFilter);
  };

  const handleGenreFilter = (genre) => {
    setGenreFilter(genre);
    applyFilters(searchTerm, genre, ratingFilter);
  };

  const handleRatingFilter = (rating) => {
    setRatingFilter(rating);
    applyFilters(searchTerm, genreFilter, rating);
  };

  const applyFilters = (term, genre, rating) => {
    // Save current scroll position
    const scrollY = window.scrollY;
    
    let filtered = allBooks;

    // Filter by search term
    if (term.trim()) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filter by genre
    if (genre) {
      filtered = filtered.filter(book => book.genre === genre);
    }

    // Filter by rating (use actual book rating)
    if (rating > 1) {
      filtered = filtered.filter(book => {
        return book.rating >= rating;
      });
    }

    // If no filters applied, show only first 20 books
    if (!term.trim() && !genre && rating <= 1) {
      filtered = filtered.slice(0, 20);
    }

    setDisplayedBooks(filtered);
    
    // Restore scroll position after state update
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
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
      setNotification("Rating submitted successfully!");
      setTimeout(() => setNotification(null), 3000);
      loadUserStats(); // Reload stats after submitting rating
    } catch (err) {
      setError("Failed to submit rating");
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
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userStats.books_this_month}</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>This Month</div>
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/80 border-gray-300/50 hover:bg-white/90 shadow-xl'} backdrop-blur-lg p-4 rounded-2xl border transition-all duration-300 text-center min-w-[120px]`}>
            <div className="text-3xl mb-1">📖</div>
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userStats.currently_reading}</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Reading</div>
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/80 border-gray-300/50 hover:bg-white/90 shadow-xl'} backdrop-blur-lg p-4 rounded-2xl border transition-all duration-300 text-center min-w-[120px] relative`}>
            <div className="text-3xl mb-1">⭐</div>
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userStats.wishlist_count}</div>
            <button 
              onClick={toggleWishlistDropdown}
              className={`text-xs ${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-800'} cursor-pointer`}
            >
              Wishlist ▼
            </button>
            
            {showWishlistDropdown && (
              <div className={`absolute top-full left-0 right-0 mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto`}>
                {wishlistBooks.length > 0 ? (
                  wishlistBooks.map(book => (
                    <div key={book.id} className={`p-3 border-b last:border-b-0 ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} cursor-pointer`}>
                      <div className="font-semibold text-sm">{book.title}</div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{book.author}</div>
                    </div>
                  ))
                ) : (
                  <div className={`p-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    No books in wishlist
                  </div>
                )}
              </div>
            )}
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

      {/* Netflix-Style Content */}
      <div className="max-w-7xl mx-auto">
        {/* Recommended for You */}
        {!loading && books.length > 0 && (
          <BookRow
            title="Recommended for You"
            books={books}
            onBookClick={handleBookClick}
            theme={theme}
            reason="Based on your reading preferences and similar users"
          />
        )}
        
        {/* Continue Reading */}
        {currentlyReadingBooks.length > 0 && (
          <BookRow
            title="Continue Reading"
            books={currentlyReadingBooks}
            onBookClick={handleBookClick}
            theme={theme}
            reason="Pick up where you left off"
          />
        )}
        
        {/* Most Popular Books */}
        {weeklyTopBooks.length > 0 && (
          <BookRow
            title="Trending Now"
            books={weeklyTopBooks}
            onBookClick={handleBookClick}
            theme={theme}
            reason="Most read books by our community"
          />
        )}
        
        {/* Your Wishlist */}
        {wishlistBooks.length > 0 && (
          <BookRow
            title="Your Wishlist"
            books={wishlistBooks}
            onBookClick={handleBookClick}
            theme={theme}
            reason="Books you want to read"
          />
        )}
        
        {/* Genre-based rows */}
        {Object.entries(genreBooks).map(([genre, genreBookList]) => (
          genreBookList.length > 0 && (
            <BookRow
              key={genre}
              title={`${genre} Books`}
              books={genreBookList}
              onBookClick={handleBookClick}
              theme={theme}
              reason={`Explore the best in ${genre}`}
            />
          )
        ))}
        
        {/* All Books Section */}
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error State */}
        {!loading && error && (
          <div className="text-center p-8 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur">
            <div className="flex items-center justify-center gap-2">
              <span>❌</span>
              {error}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && books.length === 0 && !error && (
          <div className="text-center p-8 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur">
            <div className="text-6xl mb-4">📚</div>
            <p>No recommendations yet. Rate some books to get personalized suggestions!</p>
          </div>
        )}
      </div>
      
      {/* Genre Onboarding Modal */}
      {showOnboarding && (
        <GenreOnboarding
          onComplete={handleOnboardingComplete}
          theme={theme}
          availableGenres={availableGenres}
        />
      )}
      
      {/* Book Modal */}
      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRate={handleModalRate}
        onIssue={handleIssueBook}
        onAddToWishlist={handleModalWishlist}
        theme={theme}
      />
    </section>
  );
}

export default Home;