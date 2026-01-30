import { useState, useRef } from "react";

function BookRow({ title, books, onBookClick, theme, reason = "" }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
    
    // Update arrow visibility
    setTimeout(() => {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }, 100);
  };

  if (!books || books.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h2>
        {reason && (
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {reason}
          </p>
        )}
      </div>
      
      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 ${
              theme === 'dark' ? 'bg-black/70 hover:bg-black/90' : 'bg-white/70 hover:bg-white/90'
            } rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 ${
              theme === 'dark' ? 'bg-black/70 hover:bg-black/90' : 'bg-white/70 hover:bg-white/90'
            } rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
        {/* Books Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollBehavior: 'smooth' }}
          onScroll={(e) => {
            const container = e.target;
            setShowLeftArrow(container.scrollLeft > 0);
            setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth);
          }}
        >
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => onBookClick(book)}
              className={`flex-shrink-0 w-48 ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-[#EFEBE9] hover:bg-[#D7CCC8]'
              } rounded-lg p-4 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-xl`}
            >
              <div className="h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden relative">
                <img 
                  src={book.cover_image || `https://loremflickr.com/200/300/book,artwork/all?lock=${book.id}`} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://loremflickr.com/200/300/book,artwork/all?lock=${book.id}`;
                  }}
                />
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-black/0'} pointer-events-none`}></div>
              </div>
              
              <h3 className={`font-semibold text-sm mb-1 line-clamp-2 leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-[#4E342E]'
              }`}>
                {book.title}
              </h3>
              
              <p className={`text-xs mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-[#8D6E63]'
              }`}>
                by {book.author}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-[#D7CCC8] text-[#5D4037]'
                }`}>
                  {book.genre}
                </span>
                
                {book.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {book.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookRow;