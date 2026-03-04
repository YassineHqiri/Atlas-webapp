/**
 * CHATBOT WIDGET - JavaScript
 * Gère les interactions utilisateur et l'API
 */

class ChatbotWidget {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    this.isOpen = false;
    this.isLoading = false;
    this.initElements();
    this.attachEventListeners();
  }

  initElements() {
    this.container = document.getElementById('chatbot-widget');
    this.messagesContainer = document.getElementById('chatbot-messages');
    this.input = document.getElementById('chatbot-input');
    this.sendBtn = document.getElementById('chatbot-send');
    this.toggleBtn = document.getElementById('chatbot-toggle');
    this.closeBtn = document.getElementById('chatbot-close');
  }

  attachEventListeners() {
    if (this.toggleBtn) this.toggleBtn.addEventListener('click', () => this.toggle());
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.sendBtn) this.sendBtn.addEventListener('click', () => this.sendMessage());
    if (this.input) {
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    // Quick actions
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleQuickAction(e.target.dataset.action));
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    if (this.container) this.container.classList.add('active');
    if (this.toggleBtn) this.toggleBtn.classList.add('hidden');
    if (this.input) this.input.focus();
  }

  close() {
    this.isOpen = false;
    if (this.container) this.container.classList.remove('active');
    if (this.toggleBtn) this.toggleBtn.classList.remove('hidden');
  }

  sendMessage() {
    const message = this.input.value.trim();
    if (!message || this.isLoading) return;

    this.addMessage(message, 'user');
    this.input.value = '';
    this.isLoading = true;
    this.sendBtn.disabled = true;

    this.fetchBotResponse(message);
  }

  async fetchBotResponse(message) {
    try {
      const response = await fetch(`${this.apiUrl}/chatbot/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const error = await response.json();
        this.addMessage(error.message || 'Une erreur est survenue. Veuillez réessayer.', 'bot');
        return;
      }

      const data = await response.json();
      this.addMessage(data.message, 'bot');
    } catch (error) {
      console.error('Erreur chatbot:', error);
      this.addMessage('Erreur de connexion au serveur. Veuillez réessayer.', 'bot');
    } finally {
      this.isLoading = false;
      this.sendBtn.disabled = false;
      if (this.input) this.input.focus();
    }
  }

  handleQuickAction(action) {
    const messages = {
      services: 'Quels services proposez-vous ?',
      prices: 'Quels sont vos tarifs ?',
      contact: 'Comment puis-je vous contacter ?',
    };

    const message = messages[action];
    if (message) {
      this.input.value = message;
      this.sendMessage();
    }
  }

  addMessage(text, sender = 'bot') {
    if (!this.messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender === 'bot' ? 'bot-message' : 'user-message'}`;

    const p = document.createElement('p');
    p.textContent = text;

    messageDiv.appendChild(p);
    this.messagesContainer.appendChild(messageDiv);

    // Scroll au dernier message
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 0);
  }
}

// Initialiser le widget au chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ChatbotWidget();
  });
} else {
  new ChatbotWidget();
}
