# 🔐 Guide de Sécurisation des Tokens Frontend
## Migration de localStorage vers Cookies HttpOnly

### 📋 Résumé du Problème

**Risque Actuel:** Les tokens JWT sont stockés dans `localStorage`, ce qui les expose aux attaques XSS (Cross-Site Scripting).

**Exemple de vulnérabilité:**
```javascript
// Une page malveillante peut accéder au token avec XSS:
const token = localStorage.getItem('admin_token');
// L'attaquant peut voler le token et l'utiliser ailleurs
```

### ✅ Solution: Utiliser des Cookies HttpOnly Secure

#### Avantages des Cookies HttpOnly
1. **Non accessible via JavaScript** - Les scripts ne peuvent pas accéder `HttpOnly` cookies
2. **Automatiquement envoyés** - Le navigateur envoie les cookies automatiquement
3. **Protection CSRF** - Utilisable avec CSRF tokens
4. **Secure flag** - Transmission HTTPS seulement

#### Inconvénients
1. **Plus complexe à implémenter** - Nécessite une configuration serveur
2. **SameSite restrictions** - Limitations pour les requêtes cross-domain

---

## 🔧 Implémentation Recommandée

### Option 1: Cookies HttpOnly + Refresh Tokens (RECOMMANDÉE)

**Architecture:**
```
Frontend                           Backend
  |                                  |
  |--[POST /login]---->              |
  |                              Vérifier credentials
  |<----[Response avec headers]------|
  |    Set-Cookie: authToken (HttpOnly)
  |                                  |
  |--[GET /api/user]---->            |
  |    (enviois authToken auto)      |
  |                              Vérifier token
  |<----[Data]-----                  |
```

### Étapes d'Implémentation

#### 1. Backend - Middleware pour les Cookies

Créer un middleware qui définit les cookies avec les bonnes options:

```php
// app/Http/Middleware/SetTokenInHttpOnlyCookie.php
namespace App\Http\Middleware;

use Closure;

class SetTokenInHttpOnlyCookie
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        
        // Si c'est une réponse de type JSON avec un token
        if ($response instanceof JsonResponse && 
            $this->hasTokenInResponse($response)) {
            
            $token = $this->extractToken($response);
            
            // Définir le cookie HttpOnly
            $response->cookie(
                name: 'auth_token',
                value: $token,
                minutes: 525600, // 1 an
                path: '/',
                domain: null,
                secure: true, // HTTPS seulement
                httpOnly: true, // No JS access
                sameSite: 'Lax' // CSRF protection
            );
            
            // Optionnel: Retirer le token de la réponse JSON
            // pour ne pas le dupliquer
        }
        
        return $response;
    }
    
    private function hasTokenInResponse($response)
    {
        // Vérifier si le token est dans la réponse
    }
    
    private function extractToken($response)
    {
        // Extraire le token de la réponse
    }
}
```

#### 2. Backend - Sanctum Configuration

Modifier la configuration Sanctum pour utiliser les cookies:

```php
// config/sanctum.php
return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost')),
    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],
];
```

#### 3. Frontend - Supprimer localStorage, Utiliser Cookies

```javascript
// AVANT (Insecurisé)
localStorage.setItem('admin_token', token);

// APRÈS (Sécurisé)
// Le serveur définit automatiquement le cookie HttpOnly
// Pas besoin de le gérer côté client!
```

#### 4. Frontend - Axios Configuration

```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? `${window.location.origin}/api` : 'http://localhost:8000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // SÉCURITÉ: Envoyer les cookies avec les requêtes
  withCredentials: true,
});

// Pas besoin d'ajouter Authorization header manuellement
// Le navigateur envoie le cookie HttpOnly automatiquement

// Gestion des erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré, rediriger vers login
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🛡️ Sécurité Supplémentaire

### 1. Content Security Policy (CSP)

Ajouter une CSP stricte pour prévenir l'injection XSS:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/; style-src 'self' 'unsafe-inline';
```

### 2. CSRF Protection

Laravel Sanctum fournit une protection CSRF automatique avec les cookies.

### 3. X-Content-Type-Options

```
X-Content-Type-Options: nosniff
```

Prévient les navigateurs de "deviner" le type de contenu.

### 4. X-Frame-Options

```
X-Frame-Options: DENY
```

Prévient le clickjacking.

---

## 🔄 Migration de localStorage vers Cookies

### Étapes de Transition

1. **Phase 1: Support Double (Fallback)**
   - Accepter les tokens en localStorage ET cookies
   - Laisser le temps aux utilisateurs de se reconnecter

2. **Phase 2: Déprecation localStorage**
   - Afficher un avertissement si localStorage est utilisé
   - Encourager les utilisateurs à se reconnecter

3. **Phase 3: Suppression localStorage**
   - Ne plus supporter localStorage
   - Forcer logout et re-login pour les anciens clients

### Code de Transition

```javascript
// Vérifier si le token doit migrer
if (localStorage.getItem('admin_token') && !document.cookie.includes('auth_token')) {
  console.warn('Veuillez vous déconnecter et vous reconnecter avec le nouveau système sécurisé.');
  
  // Optionnel: Logout automatique après 7 jours
  const lastWarning = localStorage.getItem('migration_warning_date');
  if (!lastWarning) {
    localStorage.setItem('migration_warning_date', new Date().toISOString());
  }
}
```

---

## ✅ Checklist de Implémentation

- [ ] Créer le middleware SetTokenInHttpOnlyCookie
- [ ] Configurer Sanctum avec cookies
- [ ] Mettre à jour le contrôleur AuthController (retourner le token dans le cookie)
- [ ] Modifier api.js pour utiliser credenticals: true
- [ ] Ajouter la CSP au nginx.conf
- [ ] Tester en development
- [ ] Deployer en production
- [ ] Monitorer les connexions et erreurs 401
- [ ] Planifier la migration des utilisateurs actuels

---

## 🧪 Testing

### Test 1: Vérifier que localStorage n'est pas utilisé
```javascript
// Dans la console du navigateur
localStorage.getItem('admin_token'); // Should return null après la migration
```

### Test 2: Vérifier le cookie HttpOnly
```javascript
// Dans la console du navigateur
document.cookie.includes('auth_token'); // Should be true
// Mais le JavaScript ne peut pas lire la valeur!
```

### Test 3: Vérifier que le token n'est pas accessible via JS
```javascript
// Ceci NE doit pas fonctionner:
console.log(document.cookie); // auth_token n'apparaîtra pas ici (HttpOnly)
```

---

## 📚 Ressources

- [OWASP: localStorage vs Cookies](https://owasp.org/www-community/vulnerabilities/Sensitive_Data_Exposure)
- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [MDN: HttpOnly Cookies](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS#credentials)

