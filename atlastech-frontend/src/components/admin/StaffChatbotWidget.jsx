import { useState, useRef, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/chatbot.css'; // Reuse existing styles for consistency

export function StaffChatbotWidget({ inline = false, layout = 'default' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: '👋 Hello Team! I am your AtlasTech Staff Assistant. How can I help you with Sales, HR, or IT today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (showResults || !inline) {
      scrollToBottom();
    }
  }, [messages, showResults]);

  const handleSendMessage = async (message = input) => {
    if (!message.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    if (layout === 'hero') setShowResults(true);

    try {
      const response = await api.post('/admin/staff-chatbot/reply', { message });
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.message,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const botMessage = {
        id: Date.now() + 1,
        text: error.response?.data?.message || 'Error connecting to AI service. Please check your connection.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Hero Layout (Minimalist Dark Search)
  if (layout === 'hero') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] w-full bg-[#181818] rounded-3xl p-8 text-white transition-all duration-500">
        {!showResults ? (
          <div className="w-full max-w-2xl text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <h2 className="text-4xl font-medium tracking-tight text-gray-100">Sur quoi travaillez-vous ?</h2>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <input 
                type="text" 
                className="w-full bg-[#202020] border border-white/5 rounded-2xl py-4 pl-12 pr-24 text-lg focus:outline-none focus:ring-2 focus:ring-white/10 placeholder-gray-500 transition-all shadow-2xl" 
                placeholder="Poser une question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  onClick={() => handleSendMessage()}
                  className={`p-2 rounded-xl transition-all ${input.trim() ? 'bg-white text-black' : 'bg-gray-700 text-gray-400 opacity-50'}`}
                  disabled={!input.trim() || isLoading}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl h-[600px] flex flex-col pt-4">
            <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${msg.sender === 'user' ? 'text-2xl font-medium text-gray-100' : 'text-lg text-gray-300 leading-relaxed'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex space-x-2 p-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="mt-8 border-t border-white/5 pt-6 flex justify-center">
              <div className="relative w-full max-w-2xl">
                <input 
                  type="text" 
                  className="w-full bg-[#202020] border border-white/5 rounded-xl py-3 pl-4 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-white/10" 
                  placeholder="Posez votre prochaine question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={() => handleSendMessage()}
                  className="absolute right-2 top-1.5 p-1.5 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <button 
                onClick={() => setShowResults(false)}
                className="ml-4 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-gray-300 transition-colors"
              >
                Nouveau
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Inline version for Dashboard integration
  if (inline) {
    return (
      <div className="flex flex-col h-[400px] bg-white/50 backdrop-blur-sm rounded-xl border border-purple-100 overflow-hidden shadow-inner">
        <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.sender === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-none' 
                  : 'bg-white border border-purple-100 text-gray-800 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-purple-50/50 border-t border-purple-100 flex items-center space-x-2">
          <input 
            type="text" 
            className="flex-1 bg-white border border-purple-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20" 
            placeholder="Ask about Sales or CRM..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            maxLength={1000}
            disabled={isLoading}
          />
          <button 
            className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 disabled:opacity-50 transition-colors" 
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
               <div className="flex space-x-1 px-1">
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Floating widget version (original)
  return (
    <>
      <div className={`chatbot-container staff-chatbot ${isOpen ? 'active' : ''}`}>
        <div className="chatbot-header staff-header">
          <div className="chatbot-header-content text-white">
            <h3 className="font-bold">Staff Assistant</h3>
            <p className="text-xs opacity-80 text-white/70">Sales • HR • IT Support</p>
          </div>
          <button 
            className="chatbot-close-btn" 
            onClick={() => setIsOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M5 5L15 15M5 15L15 5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chatbot-message ${msg.sender}-message`}>
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-area">
          <input 
            type="text" 
            className="chatbot-input" 
            placeholder="Ask about AtlasTech..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            maxLength={1000}
            disabled={isLoading}
          />
          <button 
            className="chatbot-send-btn bg-purple-600 hover:bg-purple-700" 
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
               <span className="flex space-x-1">
                 <span className="w-1 h-1 bg-white rounded-full animate-bounce"></span>
                 <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                 <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
               </span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M2 10L18 2L10 18L8 10H2Z" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <button 
        className={`chatbot-toggle-btn staff-toggle-btn ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"/>
          </svg>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
        </div>
        <span className="ml-2 font-semibold">Staff Assistant</span>
      </button>
    </>
  );
}

export default StaffChatbotWidget;
