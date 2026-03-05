# 🔧 Guide de Diagnostic - reCAPTCHA Widget ne s'affiche pas

## Problème
Le widget reCAPTCHA affiche "Loading security verification..." mais ne s'affiche pas

## ✅ Fix Appliqué
- ✅ Hook personnalisé `useRecaptcha` créé
- ✅ Utilise `grecaptcha.ready()` (méthode officielle Google)
- ✅ Timeout augmenté à 200ms en DEV pour connexions lentes
- ✅ Logs de debugging améliorés
- ✅ Vérifications du DOM plus robustes

## 🧪 Comment Tester

### Étape 1: Vider le cache
```bash
# Frontend cache
Ctrl+Shift+Delete  # Dans le navigateur

# Vite cache
rm -r node_modules/.vite
```

### Étape 2: Redémarrer les serveurs
```bash
# Terminal 1 - Backend
cd atlastech-backend
php artisan serve

# Terminal 2 - Frontend
cd atlastech-frontend
npm run dev
```

### Étape 3: Ouvrir DevTools
```
Appuyez sur F12 dans le navigateur
→ Onglet "Console"
→ Cherchez les logs verts (✅) et rouges (❌)
```

## 📋 Logs Attendus

### ✅ Si ça marche:
```
✅ Google reCAPTCHA script loaded
✅ grecaptcha API ready, rendering widget...
✅ Rendering reCAPTCHA in container #recaptcha-container-login
✅ reCAPTCHA widget rendered successfully
```

### ❌ Si ça ne marche pas:
Vous verrez un des messages d'erreur ci-dessous avec une solution

## 🐛 Dépannage par Symptôme

### Symptôme 1: "Loading security verification..." reste affiché

**Cause possible 1: Script Google ne charge pas**
```javascript
// Dans la Console, tapez:
console.log('Script loaded:', !!document.getElementById('recaptcha-script'));
console.log('grecaptcha exists:', !!window.grecaptcha);
```
- Si les deux sont `false`: Problème de connexion à Google
- Solution: Vérifiez votre connexion internet ou proxy

**Cause possible 2: Container HTML n'existe pas**
```javascript
// Dans la Console, tapez:
console.log('Container exists:', !!document.getElementById('recaptcha-container-login'));
```
- Si `false`: Le container n'est pas dans le DOM
- Solution: Assurez-vous que vous êtes sur la page Login correcte

**Cause possible 3: grecaptcha.ready() ne se déclenche pas**
```javascript
// Dans la Console, tapez:
window.grecaptcha.ready(() => console.log('Ready callback fired!'));
```
- Si rien n'apparaît: L'API Google n'est pas prête
- Solution: Attendez quelques secondes ou rechargez

### Symptôme 2: Erreur "Container #... not found"

**Cause**: Le component s'est rendu avant que le hook le cherche
**Solution**: (Déjà corrigée dans le nouveau code)

### Symptôme 3: Widget affiche mais pas de case à cocher

**Cause**: Les clés API ne correspondent pas à votre domaine
**Vérification**:
1. Allez sur: https://www.google.com/recaptcha/admin/sites
2. Login avec votre compte Google
3. Vérifiez que le domaine `localhost` est dans la liste
4. Vérifiez les SITE KEY et SECRET KEY

### Symptôme 4: Widget s'affiche puis disparaît

**Cause**: Le component React se remonte
**Solution**: Déjà corrigée avec `window.grecaptchaLoaded` et vérification du script

## 🔑 Vérifier Vos Clés API

Les clés actuelles:
```
SITE KEY:   6LeAd38sAAAAAFtP24L1PuL4uWaHV2k0tLve6-qI
SECRET KEY: 6LeAd38sAAAAAE4Y_GRl8YZ1CZkyqHEAYQb9jrsm
```

Ces clés sont configurées pour `localhost` et fonctionnent localement.

### ⚠️ Pour Production:
Vous DEVEZ générer de nouvelles clés:
1. Allez sur: https://www.google.com/recaptcha/admin
2. Créez un nouveau site
3. Domaines: Votre domaine de production
4. Remplacez les clés dans:
   - `src/hooks/useRecaptcha.js` (ligne siteKey)
   - `.env` (ne pas oublier!)

## 🌐 Test de Connectivité

Vérifiez que vous pouvez atteindre Google:
```javascript
// Dans la Console du navigateur:
fetch('https://www.google.com/recaptcha/api.js')
  .then(r => r.status)
  .then(status => console.log('Google reachable:', status === 200))
  .catch(e => console.log('Cannot reach Google:', e.message));
```

## 📊 État du Widget

Vérifiez l'état en temps réel:
```javascript
// Dans la Console du navigateur:
setInterval(() => {
  const container = document.getElementById('recaptcha-container-login');
  console.log('Widget rendered:', !!container.querySelector('iframe'));
  console.log('Token available:', !!window.grecaptcha.getResponse());
}, 1000);
```

## 🔄 Solution Rapide

Si rien ne marche, essayez ceci:
```bash
# 1. Arrêtez les serveurs (Ctrl+C)

# 2. Nettoyez tout
cd atlastech-frontend
rm -rf node_modules/.vite
npm run build  

# 3. Relancez
npm run dev
```

## ✅ Checklist de Vérification

- [ ] F12 → Console → Aucune erreur en rouge
- [ ] Logs verts (✅) pour script et widget
- [ ] Container HTML visible dans Elements (Ctrl+Shift+C)
- [ ] iframe Google reCAPTCHA présente
- [ ] Case "Je ne suis pas un robot" visible et cliquable
- [ ] Après clic → widget change d'apparence
- [ ] Token disponible → Formulaire activé

## 📞 Si ça ne marche toujours pas

Signalez dans la console ces informations:
```javascript
copy({
  script: !!document.getElementById('recaptcha-script'),
  grecaptcha: !!window.grecaptcha,
  container: !!document.getElementById('recaptcha-container-login'),
  containerContent: document.getElementById('recaptcha-container-login')?.innerHTML.substring(0, 100),
  url: window.location.href,
  navigatorOnline: navigator.onLine,
  origin: window.location.origin
})
```

---

**Mise à jour:** 4 Mars 2026
**Status:** Diagnostics complets implémentés
