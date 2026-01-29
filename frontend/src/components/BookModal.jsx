import { useState } from "react";

function BookModal({ book, isOpen, onClose, onRate, onIssue, onAddToWishlist, theme, cardPosition }) {
  const [rating, setRating] = useState(0);

  if (!isOpen) return null;

  const handleRate = () => {
    if (rating > 0) {
      onRate(book.id, rating, "read");
      onClose();
    }
  };

  const handleIssue = () => {
    onIssue(book.id);
    onClose();
  };

  const handleWishlist = () => {
    onAddToWishlist(book.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn scrollbar-hide`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-300/20">
          <div className="flex gap-4">
            <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={book.cover_image || 'https://via.placeholder.com/96x128/374151/9CA3AF?text=No+Cover'} 
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/96x128/374151/9CA3AF?text=No+Cover';
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>by {book.author}</p>
                  <p className="text-blue-500 text-sm">{book.genre}</p>
                </div>
                <button
                  onClick={onClose}
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} text-2xl`}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-gray-300/20">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed`}>
            {book.description}
          </p>
        </div>

        {/* Rating Section */}
        <div className="p-6 border-b border-gray-300/20">
          <h3 className="font-semibold mb-3">Rate this book</h3>
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  rating >= star ? 'text-yellow-400' : 'text-gray-400'
                } hover:text-yellow-500`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 space-y-3">
          <button
            onClick={handleRate}
            disabled={rating === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
          >
            ⭐ Rate & Mark as Read
          </button>
          
          <button
            onClick={() => { onRate(book.id, 0, "reading"); onClose(); }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
          >
            📖 Currently Reading
          </button>
          
          <button
            onClick={handleIssue}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold"
          >
            📝 Request Issue
          </button>
          
          <button
            onClick={handleWishlist}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            💖 Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookModal;