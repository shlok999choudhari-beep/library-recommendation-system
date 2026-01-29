import { useState, useEffect, useRef } from "react";
import { sendChatMessage, getChatHistory } from "../services/api";

function Chatbot({ user, theme }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory(user.user_id);
      const formattedHistory = history.reverse().flatMap(h => [
        { type: "user", content: h.message, timestamp: h.timestamp },
        { type: "bot", content: h.response, timestamp: h.timestamp }
      ]);
      setMessages(formattedHistory);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { type: "user", content: inputMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(user.user_id, inputMessage);
      const botMessage = { type: "bot", content: response.response, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { type: "bot", content: "Sorry, I'm having trouble right now. Please try again later.", timestamp: new Date() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`min-h-screen ${theme === 'dark' ? 'text-white' : 'text-black'} px-6 md:px-12 py-8`}>
      <div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300/50 shadow-xl'} backdrop-blur-lg rounded-3xl border h-[80vh] flex flex-col`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-300/20">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
            📚 AI Book Assistant
          </h1>
          <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mt-2`}>
            Ask me anything about books, get recommendations, or discuss literature!
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🤖</div>
              <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                Hi! I'm your AI book assistant. Ask me about book recommendations, authors, genres, or anything book-related!
              </p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : theme === 'dark' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-200 text-black'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-300/20">
          <div className="flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about books..."
              className={`flex-1 px-4 py-3 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-black'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Chatbot;