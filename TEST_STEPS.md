# ✅ Guide de Test - Étapes Exactes

## 🚀 Démarrage Rapide

Suivez exactement ces étapes dans l'ordre. Le fix devrait résoudre le problème du widget qui ne s'affichait pas.

---

## **ÉTAPE 1: Préparer les serveurs** (5 min)

### Terminal 1 - Backend Laravel
```bash
cd c:\Users\hp\Atlas-webapp\atlastech-backend

# Assurez-vous que les migrations sont appliquées
php artisan migrate:fresh --seed

# Lancez le serveur
php artisan serve
```

Vous devriez voir:
```
Laravel development server started on [http://127.0.0.1:8000]
```

### Terminal 2 - Frontend React
```bash
cd c:\Users\hp\Atlas-webapp\atlastech-frontend

# Installez les dépendances si nécessaire
npm install

# Lancez le serveur Vite
npm run dev
```

Vous devriez voir:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## **ÉTAPE 2: Tester le Widget reCAPTCHA** (10 min)

### Ouvrir une fenêtre de navigateur

1. **Accédez à la page d'accueil**
   ```
   http://localhost:5173
   ```

2. **Allez à la page de Login**
   ```
   http://localhost:5173/login
   ou
   Cliquez sur "Sign In" dans le menu
   ```

3. **Ouvrez les DevTools**
   ```
   Appuyez sur: F12
   ou: Ctrl + Shift + I
   ou: Menu → More tools → Developer tools
   ```

### Vérifiez la Console (Onglet Console)

Cherchez les logs verts (✅):

```
✅ Google reCAPTCHA script loaded
✅ grecaptcha API ready, rendering widget...
✅ Rendering reCAPTCHA in container #recaptcha-container-login
✅ reCAPTCHA widget rendered successfully
```

**Résultat attendu:**
- ✅ Tous les logs en vert
- ❌ Pas d'erreurs rouges
- Pas de message "Loading security verification..." qui reste affiché

### Vérifiez le Widget

Dans la console, tapez:
```javascript
document.getElementById('recaptcha-container-login').querySelector('iframe')
```

Appuyez sur Entrée.

**Résultat attendu:**
```
<iframe ...
```

Si vous voyez un élément HTML `<iframe>`, le widget est chargé ✅

---

## **ÉTAPE 3: Interagir avec le Widget** (5 min)

### Sur la page Login:
1. **Vous devez voir une case** avec le texte "Je ne suis pas un robot"
2. **Cliquez sur la case** (le checkbox)
3. **Attendez la réaction:**
   - Soit: ✅ Coché directement
   - Soit: 🖼️ Challenge d'images (sélectionner des photos)

### Dans la Console:
Après avoir coché, testez:
```javascript
window.grecaptcha.getResponse()
```

**Résultat attendu:** Un long texte crypté (le token)
```
03AHJ_AuuF4L6...sAYAEGy6-1Q
```

---

## **ÉTAPE 4: Tester les Formulaires** (10 min)

### Test 1: Login sans cocher
1. Entrez vos identifiants (voir liste ci-dessous)
2. **NE COCHEZ PAS** le widget reCAPTCHA
3. Cliquez "Sign In"

**Résultat attendu:**
```
❌ Erreur: "Veuillez valider le reCAPTCHA" ou similaire
```

### Test 2: Login avec cocher
1. **COCHEZ** le widget reCAPTCHA
2. Entrez vos identifiants:
   - Email: `admin@example.com`
   - Password: `password`
3. Cliquez "Sign In"

**Résultat attendu:**
```
✅ Connecté avec succès
Redirection vers le dashboard
```

### Identifiants de Test
```
Email:    admin@example.com
Password: password

ou

Email:    customer@example.com
Password: password
```

(Créés lors du `php artisan migrate:fresh --seed`)

---

## **ÉTAPE 5: Répéter pour Register** (5 min)

La même logique s'applique à la page Register:

1. **Allez à**:
   ```
   http://localhost:5173/register
   ```

2. **Vérifiez les logs**:
   ```
   ✅ Google reCAPTCHA script loaded
   ✅ Rendering reCAPTCHA in container #recaptcha-container-register
   ✅ reCAPTCHA widget rendered successfully
   ```

3. **Testez le widget**:
   - Cochez la case
   - Remplissez le formulaire
   - Soumettez

**Résultat attendu:**
```
✅ Compte créé avec succès
Redirection ou confirmation
```

---

## **ÉTAPE 6: Vérifier la Base de Données** (5 min)

Le widget devrait envoyer des données au backend.

Vérifiez les tentatives échouées:
```sql
SELECT COUNT(*) as failed_attempts 
FROM failed_authentication_attempts 
WHERE DATE(created_at) = CURDATE();
```

Après chaque tentative sans cocher le widget:
```
failed_attempts: 1
failed_attempts: 2
...
```

Après 5 tentatives, votre IP/email sera bloqué pendant 15 minutes.

---

## **ÉTAPE 7: Tester le Blocage de Sécurité** (Optionnel)

Pour tester le mécanisme de protection:

1. **Tentez de vous connecter 5 fois** avec un mauvais mot de passe
   - **SANS cocher le widget**
   
2. **À la 6ème tentative:**
   ```
   ❌ Erreur: "Trop de tentatives"
   ou
   ❌ Erreur: "Compte temporairement verrouillé"
   ```

3. **Attendez 15 minutes** ou rechargez la page

4. **Vérifiez la console:**
   - Logs du backend indiquant le blocage
   - Réponse HTTP: 429 (Too Many Requests)

---

## **📋 Checklist de Validation**

### ✅ Avant de conclure que le fix fonctionne:

- [ ] **Script:** ✅ "Google reCAPTCHA script loaded" dans Console
- [ ] **API:** ✅ "grecaptcha API ready" dans Console
- [ ] **Rendu:** ✅ "reCAPTCHA widget rendered successfully" dans Console
- [ ] **Pas d'erreurs:** ✅ Aucun message d'erreur rouge
- [ ] **Widget visible:** ✅ Case à cocher "Je ne suis pas un robot" visible
- [ ] **Interaction:** ✅ Peut cliquer et cocher
- [ ] **Token:** ✅ `window.grecaptcha.getResponse()` retourne un token
- [ ] **Forms Login:** ✅ Erreur sans cocher, succès avec cocher
- [ ] **Forms Register:** ✅ Erreur sans cocher, succès avec cocher
- [ ] **Database:** ✅ Tentatives enregistrées dans failed_auth
- [ ] **Blocage:** ✅ Bloqué après 5 tentatives

---

## 🔴 Si le Widget ne s'affiche TOUJOURS pas

Ne paniquez pas, consultez le **guide de diagnostic** détaillé:

```
📄 RECAPTCHA_WIDGET_DEBUG.md
```

Il contient des solutions pour:
- Script qui ne charge pas
- Container HTML absent
- Clés API invalides
- Erreurs de connectivité
- Et plus...

---

## 📞 Commandes Utiles en Console

Testez ces commandes pour diagnostiquer:

### Vérifier le script
```javascript
console.log('Script ID:', document.getElementById('recaptcha-script'));
```

### Vérifier l'API
```javascript
console.log('grecaptcha:', window.grecaptcha);
console.log('grecaptchaLoaded:', window.grecaptchaLoaded);
```

### Vérifier les containers
```javascript
console.log('Login container:', document.getElementById('recaptcha-container-login'));
console.log('Register container:', document.getElementById('recaptcha-container-register'));
```

### Vérifier le widget rendu
```javascript
document.querySelectorAll('iframe[src*="recaptcha"]')
```

### Obtenir le token
```javascript
window.grecaptcha.getResponse()
```

---

## ⏱️ Temps Total Requis

| Étape | Temps |
|-------|-------|
| 1. Serveurs | 5 min |
| 2. DevTools Console | 5 min |
| 3. Widget interactif | 5 min |
| 4. Formulaires | 10 min |
| 5. Register | 5 min |
| 6. Database | 5 min |
| 7. Blocage (optionnel) | 20 min |
| **TOTAL** | **30-50 min** |

---

## ✅ Résultat Attendu

Après ce test:
- ✅ Widget reCAPTCHA s'affiche correctement
- ✅ Pas de "Loading security verification..." perpétuel
- ✅ Case à cocher fonctionnelle
- ✅ Formulaires valident correctement
- ✅ Protection de sécurité active (blocage après 5 tentatives)

---

## 📝 Notes

- Les serveurs doivent **rester lancés** pendant vos tests
- Utilisez **Ctrl+Shift+R** pour rafraîchir le cache du navigateur
- Consultez **F12 Console** en cas d'erreur
- Le fix a été appliqué à `useRecaptcha.js`, `Login.jsx` et `Register.jsx`
- Backend et Database sont **inchangés et fonctionnels**

---

**Status:** Prêt à tester
**Date:** 4 Mars 2026
**Durée:** 30-50 minutes pour validation complète
