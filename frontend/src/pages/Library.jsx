import { useState, useEffect } from "react";
import { getIssuedBooks, returnBook, getNotifications, markNotificationRead } from "../services/api";

function Library({ user, theme }) {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadIssuedBooks();
    loadNotifications();
  }, []);

  const loadIssuedBooks = async () => {
    try {
      const issued = await getIssuedBooks(user.user_id);
      setIssuedBooks(issued);
    } catch (err) {
      console.error("Failed to load issued books:", err);
    }
  };

  const loadNotifications = async () => {
    try {
      const notifs = await getNotifications(user.user_id);
      setNotifications(notifs);
    } catch (err) {
      console.error("Failed to load notifications:", err);
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

  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
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
          📚 My Library
        </h1>
        <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mt-2`}>
          Manage your issued books and notifications
        </p>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className={`${theme === 'dark' ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-300'} border rounded-lg p-4 mb-8`}>
          <h2 className="text-xl font-bold mb-4 text-red-500">🔔 Notifications</h2>
          {notifications.map((notif) => (
            <div key={notif.id} className="flex justify-between items-center p-2 border-b border-red-300/30 last:border-b-0">
              <span>{notif.message}</span>
              <button
                onClick={() => handleMarkRead(notif.id)}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                Mark Read
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Issued Books */}
      <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg p-8 rounded-3xl border`}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
          📖 Issued Books
        </h2>

        {issuedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {issuedBooks.map((issue) => (
              <div key={issue.issue_id} className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} p-4 rounded-lg ${issue.is_overdue ? 'border-2 border-red-500' : ''}`}>
                <h3 className={`font-bold text-lg ${issue.is_overdue ? 'text-red-500' : theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {issue.book_title}
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>by {issue.book_author}</p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Due:</span> {new Date(issue.due_date).toLocaleDateString()}
                </p>
                {issue.is_overdue && (
                  <p className="text-red-500 text-sm font-bold mb-2">
                    ⚠️ Overdue by {issue.days_overdue} days
                  </p>
                )}
                <button
                  onClick={() => handleReturnBook(issue.issue_id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-center py-8`}>
            No books currently issued. Visit the home page to issue books!
          </p>
        )}
      </div>
    </section>
  );
}

export default Library;