# 🔍 Diagnostic - reCAPTCHA Verification Failed

**Problème:** "reCAPTCHA verification failed. Please try again"  
**Clés:** ✅ Correctes dans .env  
**Widget:** ✅ S'affiche correctement  
**Cause:** Token rejeté par Google

---

## 🔧 Diagnostic Étape par Étape

### Étape 1: Vérifier que le Token est Envoyé (2 min)

**Dans le navigateur (F12):**

1. Ouvrir: **DevTools → Network**
2. Cochez la case reCAPTCHA
3. Cliquez sur "Sign In"
4. Cherchez: **POST /api/auth/login**
5. Ouvrez la requête
6. Onglet **"Request Payload"** ou **"Form Data"**

Vous devez voir:
```json
{
  "email": "admin@example.com",
  "password": "password",
  "g_recaptcha_response": "03AHJ_AuuF4L6L..." ← Long token!
}
```

**Résultat attendu:**
- ✅ `g_recaptcha_response` est un long texte (~400+ caractères)
- ✅ N'est pas vide

**Si le token est vide:**
→ Allez à [Solution 1: Token Vide](#solution-1-token-vide)

---

### Étape 2: Vérifier les Logs du Backend (3 min)

**Où chercher les logs:**

Ouvrez le terminal où vous avez lancé: `php artisan serve`

```
Vous devriez voir:
[2026-03-04 14:30:15] local.WARNING: reCAPTCHA verification failed ...
ou
[2026-03-04 14:30:15] local.ERROR: reCAPTCHA API error ...
```

**Logs attendus - Si ça marche:**
```
[2026-03-04 14:30:15] local.INFO: reCAPTCHA verification successful ...
```

**Logs problématiques - Ce qu'il faut chercher:**

```
1. "Token is missing or empty" 
   → Token n'est pas envoyé par le frontend

2. "reCAPTCHA secret key not configured"
   → Les clés .env ne sont pas chargées

3. "Invalid response from Google"
   → Google retourne un format invalide

4. "reCAPTCHA verification failed"
   → Google rejette le token
   → Cherchez: "error-codes": [...]
```

---

## ⚡ Solutions Rapides

### Solution 1: Token Vide

**Si le token est vide (pas d'envoi):**

1. **Vérifier la fonction `getResponse()`**
   
   Dans la console du navigateur (F12 → Console):
   ```javascript
   console.log('grecaptcha exists:', !!window.grecaptcha);
   console.log('token:', window.grecaptcha.getResponse());
   ```
   
   Résultats:
   - ✅ `grecaptcha exists: true`
   - ✅ `token` = long texte (~400 chars)
   - ❌ `token` = "vide" ou undefined → **Widget pas complètement chargé**

2. **Solution:**
   - Attendez 2 secondes après avoir coché la case
   - Le widget doit afficher une coche ou un bouton "Verify"
   - Puis soumettez le formulaire

### Solution 2: Google Rejette le Token

**Logs affichent: "error-codes"**

Exemples d'erreurs:

| Erreur | Signification | Solution |
|--------|---|---|
| `invalid-input-response` | Token invalide ou expiré | Actualisez la page et recommencez |
| `invalid-input-secret` | Clé secrète incorrecte | Vérifiez RECAPTCHA_SECRET_KEY dans .env |
| `missing-input-response` | Pas de token envoyé | Vérifiez que le token est envoyé |
| `missing-input-secret` | Clé secrète manquante | Vérifiez .env |

**Diagnostic:**
```
1. Vérifier RECAPTCHA_SECRET_KEY = 6LeAd38sAAAAAE4Y_GRl8YZ1CZkyqHEAYQb9jrsm
2. Vérifier RECAPTCHA_SITE_KEY = 6LeAd38sAAAAAFtP24L1PuL4uWaHV2k0tLve6-qI
3. Les domaines localhost et 127.0.0.1 doivent être enregistrés dans Google Admin
```

### Solution 3: Token Expiré

**Tokens reCAPTCHA v2 valables 2 minutes**

- Cochez la box
- Soumettez **immédiatement** (pas d'attente)
- Si vous attendez > 2 min → Token expiré

**Solution:**
- Rechargez la page
- Revérifiez la box rapidement

---

## 🧪 Test Complet de Diagnostic

### Exécuter dans la Console (F12)

```javascript
// 1. Vérifier le widget
console.log('=== Widget ===');
console.log('Container exists:', !!document.getElementById('recaptcha-container-login'));
console.log('Widget rendered:', !!document.querySelector('iframe[src*="recaptcha"]'));

// 2. Vérifier l'API
console.log('\n=== API ===');
console.log('grecaptcha exists:', !!window.grecaptcha);
console.log('grecaptcha.getResponse exists:', typeof window.grecaptcha?.getResponse);

// 3. Récupérer le token
console.log('\n=== Token ===');
const token = window.grecaptcha?.getResponse();
console.log('Token length:', token?.length || 'EMPTY');
console.log('Token:', token?.substring(0, 50) + '...');

// 4. Vérifier HTTP Origin
console.log('\n=== Origin ===');
console.log('Origin:', window.location.origin);
console.log('URL:', window.location.href);
```

**Résultat attendu - ✅ OK:**
```
=== Widget ===
Container exists: true
Widget rendered: true

=== API ===
grecaptcha exists: true
grecaptcha.getResponse exists: function

=== Token ===
Token length: 500
Token: 03AHJ_AuuF4L6rD2aX0QZqX...

=== Origin ===
Origin: http://localhost:5173
URL: http://localhost:5173/login
```

---

## 🔧 Vérifications Avancées

### 1. Vérifier que le Token est Envoyé Correctement

Modifiez temporairement le Login pour log le token:

```javascript
// Dans Login.jsx, dans handleSubmit(), avant le POST:
const recaptchaToken = window.grecaptcha.getResponse();
console.log('DEBUG - Token to send:', recaptchaToken);
console.log('DEBUG - Token length:', recaptchaToken?.length);
```

Puis contrôlez la console lors de la soumission.

### 2. Vérifier la Réponse Google

Dans le RecaptchaService, les logs devraient affichées:

```php
[2026-03-04 14:30:15] local.INFO: reCAPTCHA verification successful
  OR
[2026-03-04 14:30:15] local.WARNING: reCAPTCHA verification failed ["invalid-input-response"]
```

Regardez les **error-codes** pour comprendre le problème.

### 3. Ajouter des Logs Version Courte

Je vais ajouter des logs plus clairs au RecaptchaService pour identifier exactement où ça échoue.

---

## 📋 Checklist de Debugging

- [ ] **Widget visible**: Checkbox "Je ne suis pas un robot" visible ✅
- [ ] **Token visible**: Console F12 montre un long token ✅
- [ ] **Token envoyé**: Network tab montre `g_recaptcha_response` rempli ✅
- [ ] **Logs backend**: Terminal du serveur montre les logs ✅
- [ ] **Clés correctes**: RECAPTCHA_SITE_KEY et SECRET_KEY dans .env ✅
- [ ] **Domaines enregistrés**: localhost et 127.0.0.1 chez Google ✅

---

## 🚨 Problèmes Courants

### Problème: "Clé secrète incorrecte"
```
Vérifiez dans .env:
RECAPTCHA_SECRET_KEY=6LeAd38sAAAAAE4Y_GRl8YZ1CZkyqHEAYQb9jrsm
```
Copie-colle depuis la page Google Admin pour être sûr.

### Problème: "Pas d'erreur mais ça ne marche pas"
```
Ajoutez un console.log dans le formulaire:
const recaptchaToken = window.grecaptcha.getResponse();
if (!recaptchaToken) {
  console.error('Token est VIDE!');
  return;
}
console.log('Token envoyé:', recaptchaToken.substring(0, 50));
```

### Problème: "Token expiré"
```
Le token dure 2 minutes. Si vous attendez:
1. Rechargez la page
2. Revérifiez immédiatement
3. Soumettez tout de suite
```

---

## 📞 Prochaines Étapes

1. **Exécutez** le test de diagnostic ci-dessus
2. **Vérifiez** les logs du backend
3. **Choisissez** la solution correspondant à l'erreur
4. **Testez** à nouveau

---

## 💾 Solution Immédiate (Essayez D'abord!)

Parfois c'est un simple problème de timing. **Essayez ceci:**

1. **Hard refresh** la page: `Ctrl+Shift+R`
2. **Attendez** que le widget se charge complètement
3. **Cliquez** sur la box
4. **Attendez** 2-3 secondes (le widget effectue un challenge/vérification)
5. **Soumettez** immédiatement

Si ça marche → C'était un problème de timing!  
Si ça ne marche pas → Suivez les étapes de diagnostic.

---

**Status:** Prêt pour diagnostic  
**Temps:** 5-10 minutes pour résoudre
