# Chatbot Multi-Langue - Documentation

## Améliorations Appliquées

Le chatbot supporte maintenant le **français (FR)** et l'**anglais (EN)** avec détection et réponses appropriées pour chaque langue.

## Résultats des Tests

### ✅ Tests Réussis
| Test | Langue | Question | Résultat |
|------|--------|----------|----------|
| 1 | FR | "Quels services proposez-vous ?" | ✅ Trouvé |
| 2 | EN | "What services do you offer?" | ✅ Trouvé |
| 3 | FR | "parlons de vos services" | ✅ Trouvé (variante) |
| 4 | EN | "Can I customize my project?" | ✅ Trouvé |

## Architecture Multi-Langue

### Backend (Laravel/PHP)

#### 1. **Migration** - Ajout colonne `language`
```sql
ALTER TABLE faqs ADD language ENUM('fr', 'en') DEFAULT 'fr'
```

#### 2. **Model Faq** - Nouveau scope
```php
public function scopeLanguage($query, $language = 'fr')
{
    return $query->where('language', $language);
}
```

#### 3. **ChatbotController** - Paramètre langue
- Accepte `language` en request: `POST /api/chatbot/reply`
- Payload: `{ "message": "...", "language": "fr" | "en" }`
- Filter FAQs: `Faq::active()->language($language)->get()`
- Stopwords: Différents pour chaque langue

#### 4. **Stopwords Multilingues**
- **Français**: et, ou, le, la, les, un, une, de, du, à, au, etc.
- **Anglais**: the, a, an, and, or, but, in, on, at, to, for, etc.

### Frontend (React/Vite)

#### 1. **Sélecteur de Langue**
```jsx
<select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
  <option value="fr">FR</option>
  <option value="en">EN</option>
</select>
```

#### 2. **Traductions Intégrées**
```javascript
translations = {
  fr: { title: '...', greeting: '...', error: '...' },
  en: { title: '...', greeting: '...', error: '...' }
}
```

#### 3. **Envoi Multi-Langue**
```javascript
publicApi.post('/chatbot/reply', { 
  message: userInput, 
  language: currentLanguage  // 'fr' ou 'en'
})
```

## Base de Données

### FAQs Seeded
- **12 questions en français** (French)
- **12 questions en anglais** (English)
- Traductions complètes et culturellement appropriées

### Exemples
| FR | EN |
|----|----|
| "Quels services proposez-vous ?" | "What services do you offer?" |
| "Quel est le prix du Basic Pack ?" | "What is the price of the Basic Pack?" |
| "Offrez-vous du support après lancement ?" | "Do you offer support after launch?" |

## Fonctionnalités

✅ **Détection Automatique**
- À chaque requête, le backend reçoit la langue
- Filter des FAQs par langue
- Stopwords appropriés appliqués

✅ **Réponses Localisées**
- Tous les messages d'erreur en deux langues
- Messages d'accueil changent avec la langue
- Boutons d'action traduits

✅ **Algorithme de Matching**
- Même tokenization + similarité pour les deux langues
- Stopwords spécifiques à chaque langue
- Levenshtein distance pour variations

✅ **Pas de Confusion Interlingue**
- Une requête en FR ne cherche que dans FAQs FR
- Une requête en EN ne cherche que dans FAQs EN
- Cross-language matching désactivé

## Utilisation

### Via API
```bash
curl -X POST http://localhost:8000/api/chatbot/reply \
  -H "Content-Type: application/json" \
  -d '{"message":"What are your services?","language":"en"}'
```

### Via Frontend React
```jsx
const [language, setLanguage] = useState('fr');
// Sélectionnez FR ou EN dans le widget
// Les messages seront dans la langue sélectionnée
```

## Configuration

### Ajouter Une Nouvelle Langue

1. **Migration**: Ajouter langue à ENUM `('fr', 'en', 'ar')`
2. **Model**: Déjà supporté via `scopeLanguage()`
3. **Controller**: Ajouter stopwords dans `getStopwords($language)`
4. **Seeder**: Créer `FaqArabicSeeder.php` avec 12 FAQs AR
5. **Frontend**: Ajouter traductions dans `translations` object
6. **CSS**: Aucun changement (UI-agnostique)

## Fichiers Modifiés

- ✅ `atlastech-backend/app/Http/Controllers/Api/ChatbotController.php`
- ✅ `atlastech-backend/app/Models/Faq.php`
- ✅ `atlastech-backend/database/migrations/2026_03_04_add_language_to_faqs.php`
- ✅ `atlastech-backend/database/seeders/FaqSeeder.php` (FR)
- ✅ `atlastech-backend/database/seeders/FaqEnglishSeeder.php` (EN)
- ✅ `atlastech-backend/database/seeders/DatabaseSeeder.php`
- ✅ `atlastech-frontend/src/components/ChatbotWidget.jsx`
- ✅ `atlastech-frontend/src/styles/chatbot.css`

## Prochaines Étapes

1. **AR/Arabe**: Ajouter support pour l'arabe (FR/EN/AR)
2. **Analytics**: Tracker les questions par langue
3. **Admin Panel**: CRUD FAQs d'administration multi-langue
4. **Auto-Langue**: Détecter langue navigateur automatiquement
5. **RTL Support**: Ajouter support RTL pour langues arabes
