import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import BookSkeleton from "../components/BookSkeleton";
import { getRecommendations, getBooks, addBook } from "../services/api";

function Home({ user, onLogout }) {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    description: ""
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await getBooks();
      setAllBooks(data);
    } catch (err) {
      console.error("Failed to load books:", err);
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

  return (
    <section className="min-h-screen bg-gray-950 text-white px-6 md:px-12 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
          <p className="text-gray-400">Role: {user.role}</p>
        </div>
        <div className="flex gap-4">
          {user.role === "admin" && (
            <button
              onClick={() => setShowAddBook(!showAddBook)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Add Book
            </button>
          )}
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add Book Form */}
      {showAddBook && (
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
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
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-4xl font-extrabold mb-6">
          Smart Book Recommendations
        </h2>

        <button
          onClick={handleRecommend}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 px-6 py-3 rounded-lg font-semibold shadow-lg"
        >
          {loading ? "Loading..." : "Get My Recommendations"}
        </button>

        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
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
      {allBooks.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center">
            All Books ({allBooks.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allBooks.map((book) => (
              <div key={book.id} className="bg-gray-900 p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-2">{book.title}</h4>
                <p className="text-gray-400 mb-1">by {book.author}</p>
                <p className="text-blue-400 text-sm mb-2">{book.genre}</p>
                <p className="text-gray-300 text-sm">{book.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Home;