import { useState, useEffect } from "react";
import BookModal from "../components/BookModal";
import { getBooks, updateActivity, issueBook, deleteBook } from "../services/api";

function Browse({ user, theme }) {
  const [allBooks, setAllBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [booksPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      console.log('Loaded books:', data.length);
      setAllBooks(data);
      setCurrentPage(1);
      setDisplayedBooks(data.slice(0, booksPerPage));
    } catch (err) {
      console.error("Failed to load books:", err);
      // Set empty array if API fails
      setAllBooks([]);
      setDisplayedBooks([]);
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
    const scrollY = window.scrollY;
    let filtered = allBooks;

    // Search by title AND author
    if (term.trim()) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(term.toLowerCase()) ||
        book.author.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (genre) {
      filtered = filtered.filter(book => book.genre === genre);
    }

    if (rating > 1) {
      filtered = filtered.filter(book => book.rating >= rating);
    }

    // Reset to first page when filters change
    setCurrentPage(1);
    
    // Show first page of filtered results or all if filters applied
    const hasFilters = term.trim() || genre || rating > 1;
    if (hasFilters) {
      setDisplayedBooks(filtered);
    } else {
      setDisplayedBooks(filtered.slice(0, booksPerPage));
    }
    
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  };
  
  const loadMoreBooks = () => {
    const nextPage = currentPage + 1;
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
    
    setDisplayedBooks(filtered.slice(0, endIndex));
    setCurrentPage(nextPage);
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
    } catch (err) {
      setNotification("Failed to rate book");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleIssueBook = async (bookId) => {
    try {
      await issueBook(user.user_id, bookId);
      setNotification("Book issue request submitted!");
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification("Failed to issue book");
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

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'text-white' : 'text-black'} px-6 md:px-12 py-8`}>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <section className={`min-h-screen ${theme === 'dark' ? 'text-white' : 'text-black'} px-6 md:px-12 py-8`}>
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          ✅ {notification}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Browse All Books ({allBooks.length} total)
        </h1>
        
        {/* Search Bar and Filter Toggle */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-black'
              }`}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-white border-gray-300 text-black hover:bg-gray-50'
              } transition-colors`}
            >
              🔍
            </button>
          </div>
          
          {/* Collapsible Filters */}
          {showFilters && (
            <div className={`mt-4 p-4 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-gray-50 border-gray-300'
            }`}>
              <div className="space-y-4">
                {/* Genre Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                    Genre
                  </label>
                  <select
                    value={genreFilter}
                    onChange={(e) => handleGenreFilter(e.target.value)}
                    className={`w-full px-3 py-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-black'
                    }`}
                  >
                    <option value="">All Genres</option>
                    {[...new Set(allBooks.map(book => book.genre))].sort().map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
                
                {/* Rating Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                      Minimum Rating: {ratingFilter.toFixed(1)}+ ⭐
                    </label>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setGenreFilter("");
                        handleRatingFilter(1);
                      }}
                      className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors`}
                    >
                      Reset
                    </button>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={ratingFilter}
                    onChange={(e) => handleRatingFilter(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs mt-1 opacity-60">
                    <span>1⭐</span>
                    <span>2⭐</span>
                    <span>3⭐</span>
                    <span>4⭐</span>
                    <span>5⭐</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <p className="text-center mb-4 text-sm opacity-75">
          Showing {displayedBooks.length} of {(() => {
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
          })()} books
          {searchTerm && ` for "${searchTerm}"`}
          {genreFilter && ` in ${genreFilter}`}
          {ratingFilter > 1 && ` with ${ratingFilter}+ stars`}
        </p>
        
        {displayedBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedBooks.map((book) => (
                <div 
                  key={book.id} 
                  onClick={() => handleBookClick(book)}
                  className={`${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-[#EFEBE9] border border-[#D7CCC8] hover:bg-[#D7CCC8] hover:shadow-xl'} rounded-lg transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group overflow-hidden`}
                >
                  <div className="aspect-[3/4] bg-gray-200">
                    <img 
                      src={book.cover_image || `https://loremflickr.com/300/400/book,artwork/all?lock=${book.id}`} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://loremflickr.com/300/400/book,artwork/all?lock=${book.id}`;
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">{book.title}</h4>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-[#8D6E63]'} mb-1 line-clamp-1`}>by {book.author}</p>
                    <p className={`${theme === 'dark' ? 'text-blue-600' : 'text-[#5D4037]'} text-sm mb-2`}>{book.genre}</p>
                    {book.rating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                    )}
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm line-clamp-3`}>{book.description}</p>
                  </div>
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
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMoreBooks}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-[#6D4C41] hover:bg-[#5D4037]'
                  } text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg`}
                >
                  Load More Books
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#4E342E]'}`}>
              No books found
            </h3>
            <p className={`${theme === 'dark' ? 'text-white/70' : 'text-[#8D6E63]'}`}>
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
      
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

export default Browse;