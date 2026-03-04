# 💬 Chatbot Widget - Documentation Complète

## 📋 Vue d'ensemble

Un chatbot dynamique basé sur base de données pour votre application Laravel/React. Le chatbot se déclenche automatiquement sur toutes les pages de votre site (sauf page login admin) et permet aux utilisateurs de poser des questions via une interface intégrée.

## 🏗️ Architecture

### Backend (Laravel)
```
app/
├── Models/
│   ├── Faq.php                    # Modèle FAQ avec scopes
│   └── ChatLog.php                # Modèle pour logs de chat
├── Http/Controllers/Api/
│   └── ChatbotController.php       # Logique du chatbot
database/
├── migrations/
│   ├── create_faqs_table.php      # Table FAQs
│   └── create_chat_logs_table.php # Table historique chat
└── seeders/
    └── FaqSeeder.php              # Données FAQ initiales
routes/
└── api.php                        # Route POST /api/chatbot/reply
```

### Frontend (React Vite)
```
src/
├── components/
│   └── ChatbotWidget.jsx          # Composant React du chatbot
├── styles/
│   └── chatbot.css                # Styles du widget
├── utils/
│   └── chatbot.js                 # Version vanilla JS (optionnelle)
└── App.jsx                        # Import du widget
```

## 🔌 Routes API

### Endpoint unique
```
POST /api/chatbot/reply
Content-Type: application/json

{
  "message": "Quels sont vos tarifs ?"
}

Réponse:
{
  "success": true,
  "message": "Le Basic Pack coûte 499 DH...",
  "found": true
}
```

## 🛡️ Sécurité Implémentée

✅ **Protection CSRF** - Laravel Sanctum  
✅ **Validation Input** - Max 255 caractères  
✅ **Nettoyage** - `strip_tags()` des messages  
✅ **Rate Limiting** - 10 requêtes/minute par IP  
✅ **Validation IP** - `filter_var()` avec FILTER_VALIDATE_IP  
✅ **Logs IP** - Enregistrement dans chat_logs  
✅ **Injection SQL** - Protection via ORM Eloquent  

## 📊 Modèles de Données

### Table: faqs
```sql
CREATE TABLE faqs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  question VARCHAR(255) NOT NULL,
  answer LONGTEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FULLTEXT INDEX (question, answer),
  INDEX (is_active)
);
```

### Table: chat_logs
```sql
CREATE TABLE chat_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_message LONGTEXT NOT NULL,
  bot_response LONGTEXT NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX (ip_address),
  INDEX (created_at)
);
```

## 🎯 Fonctionnalités

### Pour l'utilisateur
- 💬 Chat en temps réel
- 🎯 Boutons rapides (Services, Prix, Contact)
- 📱 Responsive design
- ⌨️ Entrée au clavier (Entrée = envoyer)
- 🔄 Scroll automatique aux nouveaux messages

### Algorithme de recherche
```php
// Recherche LIKE dans question OU answer
Faq::search('terme')
   ->active()
   ->first()

// Si pas trouvé → message par défaut
```

### Rate Limiting
```php
// 10 requêtes/minute par IP
RateLimiter::tooManyAttempts('chatbot:IP', 10)
```

## 📝 Ajouter/Modifier des FAQs

### Via seeder
```php
// database/seeders/FaqSeeder.php
['question' => 'Ma question', 'answer' => 'Ma réponse', 'is_active' => true]
```

### Via artisan tinker
```bash
php artisan tinker
>>> App\Models\Faq::create(['question' => '...', 'answer' => '...']);
```

### Panneau Admin (à développer)
```
GET  /admin/api/faqs
POST /admin/api/faqs
PUT  /admin/api/faqs/{id}
DELETE /admin/api/faqs/{id}
```

## 🎨 Personnalisation

### Couleurs (CSS)
```css
:root {
  --chatbot-primary: #7c3aed;        /* Mauve */
  --chatbot-primary-dark: #6d28d9;   /* Plus foncé */
  --chatbot-text: #1f2937;           /* Texte */
  --chatbot-bg: #ffffff;             /* Fond */
}
```

### Messages
```javascript
// ChatbotWidget.jsx
"Bonjour ! Comment puis-je vous aider aujourd'hui ?"
// Modifier dans le useState initial
```

### Position
```css
.chatbot-toggle-btn {
  bottom: 20px;  /* Distance du bas */
  right: 20px;   /* Distance de la droite */
}
```

## 🧪 Tests

### Test API classique
```bash
curl -X POST http://localhost:8000/api/chatbot/reply \
  -H "Content-Type: application/json" \
  -d '{"message": "Quels services proposez-vous ?"}'
```

### Test rate limiting
```bash
# Envoyer 11 requêtes = 429 Too Many Requests
for i in {1..11}; do
  curl -X POST http://localhost:8000/api/chatbot/reply ...
done
```

### Vérifier les logs
```bash
# Voir les dernières interactions
SELECT * FROM chat_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

## 📈 Évolutions Futures

- [ ] Admin panel pour gérer FAQs
- [ ] Analytics (questions posées, réponses trouvées)
- [ ] Support de plusieurs langues
- [ ] Intégration avec CRM leads
- [ ] Chatbot IA (OpenAI/Claude API)
- [ ] Handoff vers agent humain
- [ ] Suggestion de questions liées
- [ ] Export conversations pour support

## ⚙️ Configuration Laravel

### Rate Limiting personnalisé
```php
// config/rate.php
'chatbot' => env('CHATBOT_RATE_LIMIT', '10,60')
```

### Session & Cookies
```php
// config/session.php
'driver' => env('SESSION_DRIVER', 'file'),
```

### CORS
```php
// config/cors.php
'allowed_origins' => [
    'http://localhost:5173',
    'http://localhost:3000'
]
```

## 🐛 Dépannage

### Le widget ne s'affiche pas
1. Vérifier l'import dans App.jsx
2. Vérifier le CSS est chargé (F12 > Network)
3. Vérifier la console pour erreurs JS

### L'API ne répond pas
1. Vérifier Laravel tourne: `php artisan serve`
2. Vérifier VITE_API_URL dans .env
3. Vérifier les logs: `tail -f storage/logs/laravel-*.log`

### Rate limiting bloque tout
1. Attendre 1 minute (TTL de la clé)
2. Ou modifier le nombre dans ChatbotController::RATE_LIMIT_PER_MINUTE

## 📞 Support

Pour des questions ou améliorations, consultez:
- Laravel Sanctum: https://laravel.com/docs/sanctum
- React Hooks: https://react.dev/reference/react
- Eloquent ORM: https://laravel.com/docs/eloquent
