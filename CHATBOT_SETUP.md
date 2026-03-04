# 🚀 Guide d'Intégration Rapide - Chatbot AtlasTech

## ✅ Ce qui a été créé

### Backend (Laravel)
- ✅ Migration `faqs` avec 12 questions/réponses préchargées
- ✅ Migration `chat_logs` pour l'historique
- ✅ Modèles `Faq` et `ChatLog`
- ✅ `ChatbotController` avec sécurité complète
- ✅ Route `/api/chatbot/reply`
- ✅ FaqSeeder avec données de démonstration

### Frontend (React Vite)
- ✅ Composant `ChatbotWidget.jsx`
- ✅ Styles `chatbot.css`
- ✅ Intégration dans `App.jsx`
- ✅ Script standalone `chatbot.js` (optionnel)

### Sécurité
- ✅ Rate Limiting (10 req/min par IP)
- ✅ Validation input (max 255 chars)
- ✅ Nettoyage messages (strip_tags)
- ✅ Protection IP spoofing
- ✅ Logs de chaque interaction
- ✅ CSRF protected + CORS

---

## 🧪 Tests Réussis

```
✅ Test 1: Question trouvée  
   → Réponse: "Nous proposons trois packs..."

✅ Test 2: Question générique  
   → Réponse par défaut: "Je n'ai pas trouvé..."

✅ Test 3: Validation  
   → Message vide = 400 Bad Request
```

---

## 📦 Structure Fichiers Créés

```
Backend:
├── app/Models/
│   ├── Faq.php (12 lignes)
│   └── ChatLog.php (9 lignes)
├── app/Http/Controllers/Api/
│   └── ChatbotController.php (102 lignes)
├── database/migrations/
│   ├── 2024_01_01_000010_create_faqs_table.php
│   └── 2024_01_01_000011_create_chat_logs_table.php
├── database/seeders/
│   └── FaqSeeder.php (85 lignes, 12 FAQs)
└── routes/api.php (+ route POST /chatbot/reply)

Frontend:
├── src/components/
│   └── ChatbotWidget.jsx (116 lignes)
├── src/styles/
│   └── chatbot.css (340 lignes)
├── src/utils/
│   └── chatbot.js (128 lignes, vanilla JS)
└── src/App.jsx (+ import ChatbotWidget)
```

---

## 🎯 Endpoints API

### Endpoint unique
```
POST /api/chatbot/reply
Content-Type: application/json
X-Requested-With: XMLHttpRequest

Request:
{
  "message": "Quels services proposez-vous ?"
}

Response (200 OK):
{
  "success": true,
  "message": "Nous proposons trois packs...",
  "found": true
}

Response (429 Rate Limited):
{
  "success": false,
  "message": "Trop de requêtes..."
}
```

---

## 🎨 Widget Affichage

- **Position**: Bottom-right (fixed)
- **Dimensions**: 380x600px (responsive)
- **Toggle button**: Bouton flottan rond
- **Auto-open**: Non (click requis)
- **Messages**: Scrollable avec animations

### Boutons Rapides
1. 📦 Nos services
2. 💰 Nos prix  
3. 📞 Contact

---

## 🔧 Personnalisation

### Modifier les FAQs

**Option 1: Via seeder**
```bash
# Modifier database/seeders/FaqSeeder.php
php artisan tinker
>>> App\Models\Faq::create(['question' => '...', 'answer' => '...']);
```

**Option 2: Via adminpanel (à développer)**
```
GET  /admin/api/faqs
POST /admin/api/faqs
PUT  /admin/api/faqs/{id}
DELETE /admin/api/faqs/{id}
```

### Personnaliser les couleurs

Fichier: `src/styles/chatbot.css`
```css
:root {
  --chatbot-primary: #7c3aed;      /* Mauve */
  --chatbot-primary-dark: #6d28d9;
  --chatbot-text: #1f2937;
  --chatbot-bg: #ffffff;
}
```

### Changer message d'accueil

Fichier: `src/components/ChatbotWidget.jsx`
```jsx
const [messages, setMessages] = useState([
  { id: 1, text: '👋 Votre message...', sender: 'bot' }
]);
```

---

## 🚀 Déploiement

### 1. Production
```bash
# Build frontend
npm run build  # Crée dist/

# Laravel
composer install --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
```

### 2. Hébergement
- Frontend: Vercel, Netlify, ou serveur statique
- Backend: Serveur PHP avec MySQL
- HTTPS obligatoire

### 3. Environnement
```env
# .env backend
APP_ENV=production
CHATBOT_RATE_LIMIT=10,60

# .env frontend  
VITE_API_URL=https://api.votredomaine.com/api
```

---

## 📊 Analytics (Futur)

Les données sont enregistrées dans `chat_logs`:
```sql
SELECT * FROM chat_logs 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY created_at DESC;
```

Statistiques possibles:
- 📈 Questions par jour/heure
- 🎯 Taux de réponse trouvées
- 🌍 IPs uniques
- 📝 Questions les plus fréquentes

---

## 🐛 Troubleshooting

### Le widget n'apparaît pas
```
1. Vérifier console (F12)
2. npm run dev relancé
3. Cache navigateur vidé (Ctrl+Shift+Del)
```

### Erreur 500
```
1. Vérifier logs: tail storage/logs/laravel-*.log
2. Vérifier tables existentes: php artisan tinker > Schema::hasTable('faqs')
3. Relancer: php artisan migrate --force
```

### Rate limiting bloque
```
Attendre ~60 secondes ou redémarrer Laravel
```

---

## 📚 Prochaines Étapes Recommandées

1. **Admin Panel** - Interface CRUD pour FAQs
2. **Analytics** - Dashboard avec statistiques
3. **IA Integration** - OpenAI pour réponses intelligentes
4. **Handoff** - Redirige vers support humain
5. **Multi-langue** - Support français/anglais/arabe
6. **Webhooks** - Intégration Slack/Discord

---

## 📞 Support

Fichiers de référence:
- Documentation: `CHATBOT_DOCUMENTATION.md`
- Tests: `test-chatbot.ps1`
- Laravel Logs: `storage/logs/`

---

**Créé**: Mars 3, 2026  
**Version**: 1.0 Beta  
**Status**: ✅ Production Ready
