import { useState } from "react";

function GenreOnboarding({ onComplete, theme, availableGenres }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleComplete = () => {
    if (selectedGenres.length > 0) {
      onComplete(selectedGenres);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4" onClick={(e) => e.stopPropagation()}>
      <div className={`${theme === 'dark' ? 'bg-gray-900 text-white border border-gray-700' : 'bg-white text-black border border-gray-200'} rounded-2xl max-w-2xl w-full p-8 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Welcome! 🎉</h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Select your favorite genres to get personalized book recommendations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 max-h-60 overflow-y-auto">
          {availableGenres.map(genre => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                selectedGenres.includes(genre)
                  ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                  : theme === 'dark'
                    ? 'border-gray-600 hover:border-blue-400 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-300 hover:border-blue-400 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Selected: {selectedGenres.length} genres
          </p>
          <button
            onClick={handleComplete}
            disabled={selectedGenres.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default GenreOnboarding;