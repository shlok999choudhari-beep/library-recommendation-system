import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import BookSkeleton from "../components/BookSkeleton";
import BookModal from "../components/BookModal";
import BookRow from "../components/BookRow";
import GenreOnboarding from "../components/GenreOnboarding";
import { getRecommendations, getBooks, getWeeklyTopBooks, addBook, updateActivity, getUserRatings, getUserStats, getUserPreferences, updateUserPreferences, getWishlistBooks, issueBook, getIssuedBooks, returnBook, deleteBook } from "../services/api";

function Home({ user, onLogout, theme }) {
  const [books, setBooks] = useState([]);
  const [weeklyTopBooks, setWeeklyTopBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [booksPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadBooks(),
          loadUserRatings(),
          loadUserStats(),
          loadRecommendations(),
          loadWeeklyTopBooks()
        ]);
        // Load these after books are loaded
        await loadWishlistBooks();
        await checkOnboardingStatus();
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, []);

  useEffect(() => {
    if (allBooks.length > 0) {
      loadCurrentlyReadingBooks();
      loadIssuedBooks();
    }
  }, [allBooks]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await loadAllBooks();
      console.log('Loaded books:', data.length);
      setAllBooks(data);
      setCurrentPage(1);
      setDisplayedBooks(data.slice(0, booksPerPage));
      
      // Optimize: Use only first 500 books for genre analysis to improve performance
      const sampleBooks = data.slice(0, 500);
      
      // Group books by genre for Netflix-style rows
      const genreCounts = {};
      sampleBooks.forEach(book => {
        if (book.genre) {
          const cleanGenre = book.genre.replace(/[\[\]'"]/g, '').split(',')[0].trim();
          if (cleanGenre) {
            genreCounts[cleanGenre] = (genreCounts[cleanGenre] || 0) + 1;
          }
        }
      });
      
      const topGenres = Object.entries(genreCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 12)
        .map(([genre]) => genre);
      
      setAvailableGenres(topGenres);
      
      // Reduce to 3 genre rows instead of 5 for faster loading
      const booksByGenre = {};
      topGenres.slice(0, 3).forEach(genre => {
        booksByGenre[genre] = data.filter(book => {
          const cleanGenre = book.genre ? book.genre.replace(/[\[\]'"]/g, '').split(',')[0].trim() : '';
          return cleanGenre === genre;
        }).slice(0, 10);
      });
      console.log('Genre books:', Object.keys(booksByGenre).length, 'genres');
      setGenreBooks(booksByGenre);
      
    } catch (err) {
      console.error("Failed to load books:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const loadAllBooks = async () => {
    const data = await getBooks();
    return data;
  };

  const checkOnboardingStatus = async () => {
    try {
      const prefs = await getUserPreferences(user.user_id);
      setShowOnboarding(!prefs.onboarding_completed);
    } catch (err) {
      console.error("Failed to check onboarding status:", err);
      // Show onboarding by default if API fails
      setShowOnboarding(true);
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

  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook(bookId);
      setNotification("Book deleted successfully!");
      setTimeout(() => setNotification(null), 3000);
      loadBooks(); // Refresh book list
    } catch (err) {
      setNotification("Failed to delete book");
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
        book.title.toLowerCase().includes(term.toLowerCase()) ||
        book.author.toLowerCase().includes(term.toLowerCase())
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

    // Reset to first page when filters change
    setCurrentPage(1);
    
    // Show first page of filtered results
    const hasFilters = term.trim() || genre || rating > 1;
    if (hasFilters) {
      setDisplayedBooks(filtered);
    } else {
      setDisplayedBooks(filtered.slice(0, booksPerPage));
    }
    
    // Restore scroll position after state update
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  };
  
  const loadMoreBooks = () => {
    const nextPage = currentPage + 1;
    const startIndex = 0;
    const endIndex = nextPage * booksPerPage;
    
    let filtered = allBooks;
    
    // Apply current filters
    if (searchTerm.trim()) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (genreFilter) {
      filtered = filtered.filter(book => book.genre === genreFilter);
    }
    if (ratingFilter > 1) {
      filtered = filtered.filter(book => book.rating >= ratingFilter);
    }
    
    setDisplayedBooks(filtered.slice(startIndex, endIndex));
    setCurrentPage(nextPage);
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
        <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-[#EFEBE9]/80 border-[#D7CCC8]/50 hover:bg-[#EFEBE9] shadow-md'} backdrop-blur-lg p-6 rounded-2xl border transition-all duration-300 group flex-1`}>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' : 'text-[#4E342E]'} group-hover:scale-105 transition-transform`}>
            Welcome, {user.name || user.email}
          </h1>
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-[#5D4037]'} flex items-center gap-2 mt-1`}>
            <span className="animate-pulse">👑</span> Role: {user.role}
          </p>
        </div>
        
        {/* Quick Stats - Only for non-admin users */}
        {user.role !== 'admin' && (
          <div className="flex gap-4">
            <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-[#EFEBE9]/80 border-[#D7CCC8]/50 hover:bg-[#EFEBE9] shadow-md'} backdrop-blur-lg p-4 rounded-2xl border transition-all duration-300 text-center min-w-[120px]`}>
              <div className="text-3xl mb-1">📚</div>
              <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#4E342E]'}`}>{userStats.books_this_month}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-[#8D6E63]'}`}>This Month</div>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-[#EFEBE9]/80 border-[#D7CCC8]/50 hover:bg-[#EFEBE9] shadow-md'} backdrop-blur-lg p-4 rounded-2xl border transition-all duration-300 text-center min-w-[120px]`}>
              <div className="text-3xl mb-1">📖</div>
              <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#4E342E]'}`}>{userStats.currently_reading}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-[#8D6E63]'}`}>Reading</div>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-[#EFEBE9]/80 border-[#D7CCC8]/50 hover:bg-[#EFEBE9] shadow-md'} backdrop-blur-lg p-4 rounded-2xl border transition-all duration-300 text-center min-w-[120px] relative`}>
              <div className="text-3xl mb-1">⭐</div>
              <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#4E342E]'}`}>{userStats.wishlist_count}</div>
              <button 
                onClick={toggleWishlistDropdown}
                className={`text-xs ${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-[#8D6E63] hover:text-[#5D4037]'} cursor-pointer`}
              >
                Wishlist ▼
              </button>
              
              {/* Wishlist Dropdown */}
              {showWishlistDropdown && (
                <div className={`absolute top-full mt-2 left-0 w-64 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-[#FDFBF7] border-[#D7CCC8]'} border rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto`}>
                  {wishlistBooks.length > 0 ? (
                    wishlistBooks.map(book => (
                      <div key={book.id} className={`p-3 border-b last:border-b-0 ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-[#EFEBE9] hover:bg-[#EFEBE9]'} cursor-pointer`}>
                        <div className="font-semibold text-sm">{book.title}</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-[#8D6E63]'}`}>{book.author}</div>
                      </div>
                    ))
                  ) : (
                    <div className={`p-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#8D6E63]'}`}>
                      No books in wishlist
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
      </div>

      {/* Netflix-Style Content */}
      <div className="max-w-7xl mx-auto">
        {/* Recommended for You - Only for non-admin */}
        {user.role !== 'admin' && !loading && books.length > 0 && (
          <BookRow
            title="Recommended for You"
            books={books}
            onBookClick={handleBookClick}
            theme={theme}
            reason="Based on your reading preferences and similar users"
          />
        )}
        
        {/* Continue Reading - Only for non-admin */}
        {user.role !== 'admin' && currentlyReadingBooks.length > 0 && (
          <BookRow
            title="Continue Reading"
            books={currentlyReadingBooks}
            onBookClick={handleBookClick}
            theme={theme}
            reason="Pick up where you left off"
          />
        )}
        
        {/* Most Popular Books / Trending Now - Show for all users */}
        {weeklyTopBooks.length > 0 && (
          <BookRow
            title="Trending Now"
            books={weeklyTopBooks}
            onBookClick={handleBookClick}
            theme={theme}
            reason="Most read books by our community"
          />
        )}
        
        {/* Fallback: Popular Books by Rating - Only for non-admin */}
        {user.role !== 'admin' && weeklyTopBooks.length === 0 && allBooks.length > 0 && (
          <BookRow
            title="Popular Books"
            books={allBooks.filter(book => book.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, 10)}
            onBookClick={handleBookClick}
            theme={theme}
            reason="Highly rated books in our collection"
          />
        )}
        
        {/* Your Wishlist - Only for non-admin */}
        {user.role !== 'admin' && wishlistBooks.length > 0 && (
          <BookRow
            title="Your Wishlist"
            books={wishlistBooks}
            onBookClick={handleBookClick}
            theme={theme}
            reason="Books you want to read"
          />
        )}
        
        {/* Genre-based rows - Only for non-admin */}
        {user.role !== 'admin' && Object.entries(genreBooks).map(([genre, genreBookList]) => (
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
        
        {/* Fallback: Recent Additions - Only for non-admin */}
        {user.role !== 'admin' && Object.keys(genreBooks).length === 0 && allBooks.length > 0 && (
          <BookRow
            title="Recently Added"
            books={allBooks.slice(0, 10)}
            onBookClick={handleBookClick}
            theme={theme}
            reason="Latest additions to our library"
          />
        )}
        
        {/* All Books Section with Search/Filter - Only for non-admin */}
        {user.role !== 'admin' && !loading && allBooks.length > 0 && (searchTerm || genreFilter || ratingFilter > 1) && (
          <div className="mt-12">
            <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-[#FDFBF7]/80 border-[#D7CCC8]/50 shadow-xl'} backdrop-blur-lg p-6 rounded-3xl border mb-6`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-[#4E342E] to-[#8D6E63]'} bg-clip-text text-transparent`}>
                  📚 Search Results
                </h2>
                <div className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-[#5D4037]'}`}>
                  Showing {displayedBooks.length} of {
                    (() => {
                      let filtered = allBooks;
                      if (searchTerm.trim()) {
                        filtered = filtered.filter(book => 
                          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                      }
                      if (genreFilter) {
                        filtered = filtered.filter(book => book.genre === genreFilter);
                      }
                      if (ratingFilter > 1) {
                        filtered = filtered.filter(book => book.rating >= ratingFilter);
                      }
                      return filtered.length;
                    })()
                  } books
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {displayedBooks.map(book => (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book)}
                    className={`${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-[#EFEBE9] hover:bg-[#D7CCC8] border-[#D7CCC8]'} border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                  >
                      <div className="relative">
                        <img
                          src={book.cover_image || `https://loremflickr.com/300/400/book,artwork/all?lock=${book.id}`}
                          alt={book.title}
                          className="w-full h-40 object-cover rounded mb-2"
                          onError={(e) => {
                            e.target.src = `https://loremflickr.com/300/400/book,artwork/all?lock=${book.id}`;
                          }}
                        />
                        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-black/0'} pointer-events-none rounded`}></div>
                      </div>
                    <h3 className={`font-semibold text-sm line-clamp-2 leading-tight ${theme === 'dark' ? 'text-white' : 'text-[#4E342E]'}`}>
                      {book.title}
                    </h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-[#8D6E63]'} line-clamp-1`}>
                      {book.author}
                    </p>
                    {book.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-[#6D4C41]'}`}>
                          {book.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {(() => {
                let filtered = allBooks;
                if (searchTerm.trim()) {
                  filtered = filtered.filter(book => 
                    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.author.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                }
                if (genreFilter) {
                  filtered = filtered.filter(book => book.genre === genreFilter);
                }
                if (ratingFilter > 1) {
                  filtered = filtered.filter(book => book.rating >= ratingFilter);
                }
                return displayedBooks.length < filtered.length;
              })() && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMoreBooks}
                    className={`${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#6D4C41] hover:bg-[#5D4037]'} text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg`}
                  >
                    Load More Books
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-blue-500' : 'border-[#6D4C41]'}`}></div>
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
          <div className={`text-center p-8 rounded-lg ${theme === 'dark' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-[#8D6E63]/20 text-[#5D4037] border-[#8D6E63]/30'} border backdrop-blur`}>
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
        onDelete={handleDeleteBook}
        user={user}
        theme={theme}
      />
    </section>
  );
}

export default Home;