import { useState, useEffect, useRef } from "react";
import { sendChatMessage, getChatHistory } from "../services/api";
import { MessageSquare, X, Send, Bot, User, Trash2 } from "lucide-react";

function FloatingChat({ user, theme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && user) {
      loadChatHistory();
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

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
      console.error("Failed to load chat history", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = { type: "user", content: inputMessage, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(user.user_id, userMsg.content);
      const botMsg = { type: "bot", content: response.response, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = { type: "bot", content: "I'm having trouble connecting to the library network. Please try again.", timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format text with bolding
  const formatMessage = (content) => {
    if (!content) return null;
    return content.split(/(\*\*.*?\*\*)/).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 z-50 group ${
          theme === 'dark' 
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40' 
            : 'bg-stone-800 hover:bg-stone-700 text-stone-50 shadow-stone-500/40'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:animate-pulse" />}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl transition-all duration-300 transform origin-bottom-right z-50 flex flex-col overflow-hidden border ${
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        } ${
          theme === 'dark' 
            ? 'bg-gray-900/95 border-gray-700 backdrop-blur-xl' 
            : 'bg-white/90 border-stone-200 backdrop-blur-xl'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'border-stone-100 bg-stone-50/80'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600/20' : 'bg-stone-200'}`}>
              <Bot size={20} className={theme === 'dark' ? 'text-blue-400' : 'text-stone-700'} />
            </div>
            <div>
              <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-stone-800'}`}>
                Library Assistant
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-stone-500'}`}>
                Powered by Gemini AI
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className={`text-center py-8 px-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-stone-50'}`}>
              <Bot size={32} className={`mx-auto mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-stone-400'}`} />
              <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-stone-600'}`}>
                Hello <b>{user.name.split(' ')[0]}</b>! 👋
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-stone-500'}`}>
                I can help you find books, give recommendations, or answer questions about the library.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.type === 'user'
                  ? (theme === 'dark' ? 'bg-purple-600' : 'bg-stone-600')
                  : (theme === 'dark' ? 'bg-blue-600' : 'bg-[#D7CCC8]')
              }`}>
                {msg.type === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className={theme === 'dark' ? 'text-white' : 'text-[#4E342E]'} />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                msg.type === 'user'
                  ? (theme === 'dark' ? 'bg-purple-600/20 text-purple-100 rounded-tr-none' : 'bg-stone-100 text-stone-800 rounded-tr-none')
                  : (theme === 'dark' ? 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10' : 'bg-white text-stone-700 rounded-tl-none border border-stone-100')
              }`}>
                {formatMessage(msg.content)}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                 theme === 'dark' ? 'bg-blue-600' : 'bg-[#D7CCC8]'
              }`}>
                <Bot size={14} className={theme === 'dark' ? 'text-white' : 'text-[#4E342E]'} />
              </div>
              <div className={`px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center ${
                theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-stone-100'
              }`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce opacity-60"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce opacity-60 delay-100"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce opacity-60 delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'border-stone-100 bg-white'}`}>
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 border transition-all focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-offset-transparent ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700 focus-within:border-blue-500 focus-within:ring-blue-500/20' 
              : 'bg-stone-50 border-stone-200 focus-within:border-stone-400 focus-within:ring-stone-400/20'
          }`}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about books..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm min-w-0"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!inputMessage.trim() || isLoading}
              className={`p-2 rounded-lg transition-all ${
                inputMessage.trim() && !isLoading
                  ? (theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-stone-800 text-white hover:bg-stone-700')
                  : 'bg-transparent text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default FloatingChat;
