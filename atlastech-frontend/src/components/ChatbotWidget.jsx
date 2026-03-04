import { useState, useRef, useEffect } from 'react';
import { publicApi } from '../services/api';
import '../styles/chatbot.css';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: '👋 Bonjour ! Comment puis-je vous aider aujourd\'hui ?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message = input) => {
    if (!message.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await publicApi.post('/chatbot/reply', { message });
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.message,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: error.response?.data?.message || 'Erreur de connexion. Veuillez réessayer.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    const messages = {
      services: 'Quels services proposez-vous ?',
      prices: 'Quel est le prix du Basic Pack ?',
      contact: 'Comment puis-je vous contacter ?',
    };
    handleSendMessage(messages[action]);
  };

  return (
    <>
      {/* Widget Container */}
      <div className={`chatbot-container ${isOpen ? 'active' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-content">
            <h3>AtlasTech Chat</h3>
            <p>Besoin d'aide ?</p>
          </div>
          <button 
            className="chatbot-close-btn" 
            onClick={() => setIsOpen(false)}
            title="Fermer"
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

        <div className="chatbot-quick-actions">
          <button 
            className="quick-action-btn" 
            onClick={() => handleQuickAction('services')}
          >
            📦 Nos services
          </button>
          <button 
            className="quick-action-btn" 
            onClick={() => handleQuickAction('prices')}
          >
            💰 Nos prix
          </button>
          <button 
            className="quick-action-btn" 
            onClick={() => handleQuickAction('contact')}
          >
            📞 Contact
          </button>
        </div>

        <div className="chatbot-input-area">
          <input 
            type="text" 
            className="chatbot-input" 
            placeholder="Votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            maxLength={255}
            disabled={isLoading}
          />
          <button 
            className="chatbot-send-btn" 
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M2 10L18 2L10 18L8 10H2Z" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        className={`chatbot-toggle-btn ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        title="Ouvrir le chat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"/>
        </svg>
      </button>
    </>
  );
}

export default ChatbotWidget;
