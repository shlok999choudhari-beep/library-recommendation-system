import { useState, useEffect } from "react";
import { getPendingRequests, approveBookIssue, getBookRequests } from "../services/api";

function Admin({ user, theme }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [bookRequests, setBookRequests] = useState([]);
  const [notification, setNotification] = useState(null);

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
                  <div className="text-green-500 text-2xl">
                    📖
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

      {/* Pending Requests */}
      <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-8 rounded-3xl border`}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
          📋 Pending Book Requests ({pendingRequests.length})
        </h2>

        {pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.issue_id} className={`${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} p-4 rounded-lg transition-colors border-l-4 border-yellow-500`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {request.book_title}
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      by {request.book_author}
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
                      onClick={() => handleApprove(request.issue_id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
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
              No pending book requests
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Admin;