import { Star } from "lucide-react";

function BookCard({ title, author, rating, genre, cover_image }) {
  return (
    <div className="bg-gray-900 text-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="aspect-[3/4] bg-gray-800">
        <img 
          src={cover_image || 'https://via.placeholder.com/300x400/374151/9CA3AF?text=No+Cover'} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400/374151/9CA3AF?text=No+Cover';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-2 line-clamp-1">by {author}</p>

        <div className="flex justify-between items-center text-sm">
          <span className="bg-blue-600 px-3 py-1 rounded-full text-xs">
            {genre}
          </span>
          <span className="flex items-center gap-1 text-yellow-400 font-semibold">
            <Star size={16} fill="currentColor" /> {rating}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BookCard;