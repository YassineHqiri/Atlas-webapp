# Test Multi-Langue du Chatbot - Guide

## ✅ API Backend - CONFIRMÉ FONCTIONNEL

L'API répond correctement en anglais ET français:
```
✅ POST /api/chatbot/reply { message: "what about services", language: "en" }
   → Found: True, Language: en, Réponse en ANGLAIS

✅ POST /api/chatbot/reply { message: "et les prix", language: "fr" }
   → Found: True, Language: fr, Réponse en FRANÇAIS
```

## 🧪 Frontend Widget - À TESTER

Le widget React doit maintenant avoir:
1. ✅ Sélecteur de langue "FR/EN" visible dans le header
2. ✅ Changement du message d'accueil quand on change de langue
3. ✅ Envoi de la langue au backend (`language` parameter)

### Instructions de Test Manuel

1. **Allez à** `http://localhost:5173` (ou votre URL frontend)
2. **Cherchez le bouton chat** en bas à droite
3. **Cliquez-le** pour ouvrir le widget
4. **Trouvez le sélecteur de langue** dans le header:
   - Doit afficher "FR" par défaut
   - Doit avoir un dropdown avec "FR" et "EN"
   - Doit être visible et fonctionnel

### Scénarios de Test

#### Test 1: Français (Défaut)
```
1. Widget ouvert, langue = FR
2. Message d'accueil: "👋 Bonjour ! Comment puis-je vous aider aujourd'hui ?"
3. Tapez: "et les prix"
4. Cliquez: Envoyer
5. Résultat: DOIT répondre en FRANÇAIS
   ✓ "Le Basic Pack coûte..."
```

#### Test 2: Changement en Anglais
```
1. Cliquez sur le sélecteur "FR"
2. Choisissez "EN"
3. DOIT voir:
   - Message d'accueil change: "👋 Hello! How can I help you today?"
   - Boutons changent: "Our services", "Our pricing", "Contact us"
   - Placeholder input change: "Your message..."
```

#### Test 3: Anglais - Questions
```
1. Language = EN
2. Tapez: "what about services"
3. Réponse DOIT être en ANGLAIS:
   ✓ "We offer three main packages..."
```

#### Test 4: Plus de Questions (EN)
```
1. Tapez: "price"
2. DOIT répondre: "The Basic Pack costs..."

3. Tapez: "contact"
4. DOIT répondre: "You can reach us via..."
```

#### Test 5: Retour au Français
```
1. Changez language select = FR
2. Message d'accueil redevient français
3. Tapez: "contact"
4. DOIT répondre en FRANÇAIS:
   ✓ "Vous pouvez nous joindre via..."
```

## 🔧 Dépannage

### Le sélecteur de langue n'est pas visible
- **Solution**: Rafraîchissez le navigateur (Ctrl+R ou Cmd+R)
- Vérifiez les Dev Tools (F12) → Console pour les erreurs JS
- Vérifie les Dev Tools → Network pour voir l'API request

### Le changement de langue ne fonctionne pas
1. Ouvrez Dev Tools (F12)
2. Allez à l'onglet "Network"
3. Sélectionnez EN et envoyez un message
4. Cherchez la requête POST à `/api/chatbot/reply`
5. Vérifiez le body:
   ```json
   {"message":"...", "language":"en"}
   ```
6. Vérifiez la réponse:
   ```json
   {"language":"en", "found":true, "message":"..."}
   ```

### Les réponses sont toujours en français
- Vérifiez que le backend reçoit bien `language: "en"`
- Vérifiez via l'API directe:
  ```bash
  curl -X POST http://localhost:8000/api/chatbot/reply \
    -H "Content-Type: application/json" \
    -d '{"message":"services","language":"en"}'
  ```

## 📋 Checklist Finale

- [ ] Sélecteur FR/EN visible dans header chat
- [ ] Changement de langue change l'UI (textes, placeholders)
- [ ] Questions en FR retournent réponses EN FR
- [ ] Questions en EN retournent réponses en EN
- [ ] Boutons rapides ("services", "prices", "contact") changent de texte
- [ ] API reçoit correctement le paramètre `language`
- [ ] Pas d'erreurs dans la console du navigateur

## 💡 Notes Techniques

**Changes Apportés:**
- ✅ CSS amélioré pour le sélecteur de langue (plus visible)
- ✅ React state `language` utilisé correctement
- ✅ Traductions complètes pour FR et EN
- ✅ API backend filtre correctement par langue
- ✅ Stopwords différents pour chaque langue

**Si ça ne marche toujours pas:**
1. Vérifiez que `npm run dev` ou `yarn dev` est lancé
2. Relancez le serveur Vite
3. Videz le cache du navigateur
4. Vérifiez les logs backend: `php artisan serve`
