import { useState, useRef, useEffect } from 'react';
import { publicApi } from '../services/api';
import '../styles/chatbot.css';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [messages, setMessages] = useState([
    { id: 1, text: '👋 Bonjour ! Comment puis-je vous aider aujourd\'hui ?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const translations = {
    fr: {
      title: 'AtlasTech Chat',
      subtitle: 'Besoin d\'aide ?',
      placeholder: 'Votre message...',
      services: '📦 Nos services',
      prices: '💰 Nos prix',
      contact: '📞 Contact',
      greeting: '👋 Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      connectionError: 'Erreur de connexion. Veuillez réessayer.',
      toggleTitle: 'Ouvrir le chat',
      closeTitle: 'Fermer',
    },
    en: {
      title: 'AtlasTech Chat',
      subtitle: 'Need help?',
      placeholder: 'Your message...',
      services: '📦 Our services',
      prices: '💰 Our pricing',
      contact: '📞 Contact us',
      greeting: '👋 Hello! How can I help you today?',
      connectionError: 'Connection error. Please try again.',
      toggleTitle: 'Open chat',
      closeTitle: 'Close',
    }
  };

  const t = translations[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    const greeting = newLanguage === 'en' 
      ? '👋 Hello! How can I help you today?'
      : '👋 Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
    // Clear previous messages and show greeting in new language
    setMessages([{ 
      id: Date.now(), 
      text: greeting, 
      sender: 'bot' 
    }]);
    setInput('');
  };

  const handleSendMessage = async (message = input) => {
    if (!message.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await publicApi.post('/chatbot/reply', { message, language });
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.message,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: error.response?.data?.message || t.connectionError,
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    const messages = {
      fr: {
        services: 'Quels services proposez-vous ?',
        prices: 'Quel est le prix du Basic Pack ?',
        contact: 'Comment puis-je vous contacter ?',
      },
      en: {
        services: 'What services do you offer?',
        prices: 'What is the price of the Basic Pack?',
        contact: 'How can I contact you?',
      }
    };
    handleSendMessage(messages[language][action]);
  };

  return (
    <>
      {/* Widget Container */}
      <div className={`chatbot-container ${isOpen ? 'active' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-content">
            <h3>{t.title}</h3>
            <p>{t.subtitle}</p>
          </div>
          <div className="chatbot-header-actions">
            <div className="chatbot-language-wrapper">
              <label htmlFor="language-select" style={{fontSize: '11px', marginRight: '4px', opacity: 0.8}}>
                Lang:
              </label>
              <select 
                id="language-select"
                value={language} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="chatbot-language-select"
                title="Change language"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
            </div>
            <button 
              className="chatbot-close-btn" 
              onClick={() => setIsOpen(false)}
              title={t.closeTitle}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M5 5L15 15M5 15L15 5" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
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
            {t.services}
          </button>
          <button 
            className="quick-action-btn" 
            onClick={() => handleQuickAction('prices')}
          >
            {t.prices}
          </button>
          <button 
            className="quick-action-btn" 
            onClick={() => handleQuickAction('contact')}
          >
            {t.contact}
          </button>
        </div>

        <div className="chatbot-input-area">
          <input 
            type="text" 
            className="chatbot-input" 
            placeholder={t.placeholder}
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
        title={t.toggleTitle}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"/>
        </svg>
      </button>
    </>
  );
}

export default ChatbotWidget;
