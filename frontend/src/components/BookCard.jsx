import { Star } from "lucide-react";

function BookCard({ title, author, rating, genre }) {
  return (
    <div className="bg-gray-900 text-white rounded-xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-2">by {author}</p>

      <div className="flex justify-between items-center text-sm">
        <span className="bg-blue-600 px-3 py-1 rounded-full">
          {genre}
        </span>
        <span className="flex items-center gap-1 text-yellow-400 font-semibold">
          <Star size={16} fill="currentColor" /> {rating}
        </span>
      </div>
    </div>
  );
}

export default BookCard;