#!/usr/bin/env node

/**
 * Test Script pour vérifier l'intégration reCAPTCHA v2
 * À exécuter depuis le navigateur (Console DevTools)
 * 
 * Copier-coller dans F12 → Console → Appuyer sur Entrée
 */

console.log('🧪 Démarrage du test reCAPTCHA...\n');

// Test 1: Vérifier le script
console.log('Test 1️⃣: Script Google reCAPTCHA');
const scriptTag = document.getElementById('recaptcha-script');
console.log(`  ✓ Script tag exists: ${!!scriptTag ? '✅' : '❌'}`);
if (scriptTag) {
  console.log(`  ✓ Script src: ${scriptTag.src}`);
  console.log(`  ✓ Script async: ${scriptTag.async}`);
  console.log(`  ✓ Script defer: ${scriptTag.defer}`);
}

// Test 2: Vérifier grecaptcha
console.log('\nTest 2️⃣: API grecaptcha');
console.log(`  ✓ window.grecaptcha exists: ${!!window.grecaptcha ? '✅' : '❌'}`);
console.log(`  ✓ window.grecaptchaLoaded: ${!!window.grecaptchaLoaded ? '✅' : '❌'}`);

if (window.grecaptcha) {
  console.log(`  ✓ grecaptcha.render: ${typeof window.grecaptcha.render}`);
  console.log(`  ✓ grecaptcha.getResponse: ${typeof window.grecaptcha.getResponse}`);
  console.log(`  ✓ grecaptcha.ready: ${typeof window.grecaptcha.ready}`);
}

// Test 3: Vérifier les containers (Login)
console.log('\nTest 3️⃣: Container Login');
const loginContainer = document.getElementById('recaptcha-container-login');
console.log(`  ✓ Container exists: ${!!loginContainer ? '✅' : '❌'}`);
if (loginContainer) {
  console.log(`  ✓ Container parent: ${loginContainer.parentElement?.tagName}`);
  console.log(`  ✓ Container has iframe: ${!!loginContainer.querySelector('iframe') ? '✅' : '❌'}`);
  const iframe = loginContainer.querySelector('iframe');
  if (iframe) {
    console.log(`  ✓ Iframe src: ${iframe.src.substring(0, 50)}...`);
    console.log(`  ✓ Iframe size: ${iframe.width}x${iframe.height}px`);
  }
}

// Test 4: Vérifier les containers (Register)
console.log('\nTest 4️⃣: Container Register');
const registerContainer = document.getElementById('recaptcha-container-register');
console.log(`  ✓ Container exists: ${!!registerContainer ? '✅' : '❌'}`);
if (registerContainer) {
  console.log(`  ✓ Container parent: ${registerContainer.parentElement?.tagName}`);
  console.log(`  ✓ Container has iframe: ${!!registerContainer.querySelector('iframe') ? '✅' : '❌'}`);
}

// Test 5: Vérifier l'état du widget
console.log('\nTest 5️⃣: État du widget');
if (window.grecaptcha) {
  window.grecaptcha.ready(() => {
    const response = window.grecaptcha.getResponse();
    console.log(`  ✓ Widget ready: ✅`);
    console.log(`  ✓ Current response: ${response ? response.substring(0, 20) + '...' : '(vide - cochez la box)'}`);
    console.log(`  ✓ Response length: ${response?.length || 0} chars`);
  });
} else {
  console.log(`  ✓ grecaptcha not ready yet`);
}

// Test 6: Vérifier la connectivité
console.log('\nTest 6️⃣: Connectivité');
console.log(`  ✓ navigator.onLine: ${navigator.onLine ? '✅' : '❌'}`);
console.log(`  ✓ Origin: ${window.location.origin}`);
console.log(`  ✓ URL: ${window.location.href}`);

// Test 7: Vérifier les clés API
console.log('\nTest 7️⃣: Configuration API');
const forms = document.querySelectorAll('form');
console.log(`  ✓ Forms on page: ${forms.length}`);
forms.forEach((form, i) => {
  console.log(`    Form ${i}: ${form.id || form.className || '(unnamed)'}`);
});

// Test 8: Vérifier les logs du hook
console.log('\nTest 8️⃣: Logs du hook');
console.log('  (Vérifiez la console pour les logs avec ✅ et ❌)');
console.log('  Vous devriez voir:');
console.log('    ✅ Google reCAPTCHA script loaded');
console.log('    ✅ grecaptcha API ready, rendering widget...');
console.log('    ✅ Rendering reCAPTCHA in container...');
console.log('    ✅ reCAPTCHA widget rendered successfully');

// Test 9: Simulation de récupération du token
console.log('\nTest 9️⃣: Simulation du token');
if (window.grecaptcha) {
  console.log('  Attendez quelques secondes, puis:');
  console.log('  1️⃣ Cliquez sur le widget reCAPTCHA');
  console.log('  2️⃣ Cochez "Je ne suis pas un robot"');
  console.log('  3️⃣ Tapez dans la console:');
  console.log('     window.grecaptcha.getResponse()');
  console.log('  4️⃣ Vous verrez un long token - c\'est normal!');
}

// Test 10: Résumé
console.log('\n' + '='.repeat(50));
console.log('📊 RÉSUMÉ');
console.log('='.repeat(50));

const tests = {
  scriptTag: !!document.getElementById('recaptcha-script'),
  grecaptchaAPI: !!window.grecaptcha,
  grecaptchaFlag: !!window.grecaptchaLoaded,
  loginContainer: !!document.getElementById('recaptcha-container-login'),
  registerContainer: !!document.getElementById('recaptcha-container-register'),
  online: navigator.onLine
};

const passed = Object.values(tests).filter(Boolean).length;
const total = Object.keys(tests).length;

console.log(`Tests réussis: ${passed}/${total}`);
console.log('');

if (passed === total) {
  console.log('✅ Tous les tests sont passés! Le widget devrait fonctionner.');
} else {
  console.log('⚠️  Certains tests ont échoué. Consultez le guide de diagnostic.');
}

console.log('\n💡 Prochaines étapes:');
console.log('  1. Actualisez la page (F5 ou Ctrl+R)');
console.log('  2. Vérifiez que le widget reCAPTCHA s\'affiche');
console.log('  3. Cliquez sur le widget et cochez "Je ne suis pas un robot"');
console.log('  4. Soumettez le formulaire');
console.log('  5. Vérifiez les erreurs dans la console (F12)');

console.log('\n🔗 Liens utiles:');
console.log('  - Admin reCAPTCHA: https://www.google.com/recaptcha/admin');
console.log('  - Documentation: docs/RECAPTCHA_IMPLEMENTATION.md');
console.log('  - Guide de diagnostic: docs/RECAPTCHA_WIDGET_DEBUG.md');

console.log('\n✅ Test terminé!\n');
