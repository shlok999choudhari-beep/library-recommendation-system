import { Star } from "lucide-react";

function BookCard({ title, author, rating, genre, cover_image, theme = 'dark' }) {
  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-[#EFEBE9] text-[#4E342E]'} rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border ${theme === 'dark' ? 'border-gray-800' : 'border-[#D7CCC8]/50'}`}>
      <div className="aspect-[3/4] bg-gray-200 relative">
        <img 
          src={cover_image || `https://loremflickr.com/300/400/book,artwork/all?lock=${Math.abs(title.length + author.length)}`} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://loremflickr.com/300/400/book,artwork/all?lock=${Math.abs(title.length + author.length)}`;
          }}
        />
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-black/0'} pointer-events-none`}></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 line-clamp-2 leading-tight">{title}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#8D6E63]'} mb-3 line-clamp-1`}>by {author}</p>

        <div className="flex justify-between items-center text-sm">
          <span className={`${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-[#D7CCC8] text-[#5D4037]'} px-3 py-1 rounded-full text-xs font-medium`}>
            {genre}
          </span>
          <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-[#8D6E63]'} font-semibold`}>
            <Star size={16} fill="currentColor" /> {rating}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BookCard;