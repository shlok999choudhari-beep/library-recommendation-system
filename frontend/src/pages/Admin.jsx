import { useState, useEffect } from "react";
import { getPendingRequests, approveBookIssue, getBookRequests, fulfillBookRequest, rejectBookRequest, addBook } from "../services/api";

function Admin({ user, theme }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [bookRequests, setBookRequests] = useState([]);
  const [notification, setNotification] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    description: ""
  });

  useEffect(() => {
    if (user.role === "admin") {
      loadPendingRequests();
      loadBookRequests();
    }
  }, []);

  const loadBookRequests = async () => {
    try {
      const requests = await getBookRequests();
      setBookRequests(requests);
    } catch (err) {
      console.error("Failed to load book requests:", err);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const requests = await getPendingRequests();
      setPendingRequests(requests);
    } catch (err) {
      console.error("Failed to load pending requests:", err);
    }
  };

  const handleApprove = async (issueId) => {
    try {
      await approveBookIssue(issueId);
      setNotification("Book issue approved successfully!");
      setTimeout(() => setNotification(null), 3000);
      loadPendingRequests();
    } catch (err) {
      setNotification("Failed to approve book issue");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleFulfill = async (requestId) => {
    try {
      await fulfillBookRequest(requestId);
      setNotification("Book request marked as fulfilled!");
      setTimeout(() => setNotification(null), 3000);
      loadBookRequests();
    } catch (err) {
      setNotification("Failed to fulfill book request");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectBookRequest(requestId);
      setNotification("Book request rejected");
      setTimeout(() => setNotification(null), 3000);
      loadBookRequests();
    } catch (err) {
      setNotification("Failed to reject book request");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await addBook(newBook);
      setNewBook({ title: "", author: "", genre: "", description: "" });
      setNotification("Book added successfully!");
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification("Failed to add book");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (user.role !== "admin") {
    return (
      <section className={`min-h-screen ${theme === 'dark' ? 'text-white' : 'text-black'} px-6 md:px-12 py-8 flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-gray-500">Admin access required</p>
        </div>
      </section>
    );
  }

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
          🛠️ Admin Panel
        </h1>
        <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mt-2`}>
          Manage book issue requests and approvals
        </p>
      </div>

      {/* Book Requests */}
      <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-8 rounded-3xl border mb-8`}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-blue-400' : 'bg-gradient-to-r from-green-600 to-blue-600'} bg-clip-text text-transparent`}>
          📚 New Book Requests ({bookRequests.length})
        </h2>

        {bookRequests.length > 0 ? (
          <div className="space-y-4">
            {bookRequests.map((request) => (
              <div key={request.request_id} className={`${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} p-4 rounded-lg transition-colors border-l-4 border-green-500`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {request.book_title}
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      by {request.author}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                      Requested by: <span className="font-medium">{request.user_name}</span>
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
                      {new Date(request.requested_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFulfill(request.request_id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                      ✅ Request Fulfilled
                    </button>
                    <button
                      onClick={() => handleReject(request.request_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                      ❌ Cannot Fulfill
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📚</div>
            <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
              No new book requests
            </p>
          </div>
        )}
      </div>

      {/* Add Book Form and Book Issue Requests - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Add Book Form */}
        <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-8 rounded-3xl border`}>
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gradient-to-r from-purple-600 to-pink-600'} bg-clip-text text-transparent`}>
            ➕ Add New Book
          </h2>
          
          <form onSubmit={handleAddBook} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Book Title
              </label>
              <input
                type="text"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Author
              </label>
              <input
                type="text"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Genre
              </label>
              <input
                type="text"
                value={newBook.genre}
                onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                rows="4"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              ➕ Add Book
            </button>
          </form>
        </div>

        {/* Book Issue Requests */}
        <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-8 rounded-3xl border`}>
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
            📋 Book Issue Requests ({pendingRequests.length})
          </h2>

          {pendingRequests.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {pendingRequests.map((request) => (
                <div key={request.issue_id} className={`${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} p-4 rounded-lg transition-colors border-l-4 border-yellow-500`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {request.book_title}
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs mb-1`}>
                        by {request.book_author}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                        <span className="font-medium">{request.user_name}</span>
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
                        {new Date(request.requested_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApprove(request.issue_id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        ✅ Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📭</div>
              <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                No pending book issue requests
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Admin;