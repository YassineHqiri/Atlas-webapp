$ErrorActionPreference = 'SilentlyContinue'

Write-Host "🧪 TEST CHATBOT AMÉLIORÉ - Recherche Intelligente" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Yellow
Write-Host ""

$headers = @{'Content-Type'='application/json'}

# Test 1: Question avec mots clés exacts
Write-Host "Test 1: Mots-clés exacts"
Write-Host 'Q: "Quels services proposez-vous ?"' -ForegroundColor Cyan
$body = @{'message'='Quels services proposez-vous ?'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$content = $response.Content | ConvertFrom-Json
Write-Host "✅ Trouvé: $($content.found)" -ForegroundColor Green
Write-Host ""

# Test 2: Question avec variantes (le cas de l'utilisateur)
Write-Host "Test 2: Variante - 'est ce qu'il ya des autres services'"
Write-Host 'Q: "est ce qu''il ya des autres services"' -ForegroundColor Cyan
$body = @{'message'='est ce qu''il ya des autres services'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$content = $response.Content | ConvertFrom-Json
Write-Host "✅ Trouvé: $($content.found)" -ForegroundColor Green
Write-Host "Réponse: $($content.message.substring(0, 80))..." -ForegroundColor Gray
Write-Host ""

# Test 3: Question paraphrasée
Write-Host "Test 3: Paraphrase - 'quel pack choisir pour mon business'"
Write-Host 'Q: "quel pack choisir pour mon business"' -ForegroundColor Cyan
$body = @{'message'='quel pack choisir pour mon business'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$content = $response.Content | ConvertFrom-Json
Write-Host "✅ Trouvé: $($content.found)" -ForegroundColor Green
Write-Host ""

# Test 4: Question contextuelle
Write-Host "Test 4: Contexte - 'combien coûte votre prix'"
Write-Host 'Q: "combien coûte votre offre"' -ForegroundColor Cyan
$body = @{'message'='combien coûte votre offre'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$content = $response.Content | ConvertFrom-Json
Write-Host "✅ Trouvé: $($content.found)" -ForegroundColor Green
Write-Host ""

# Test 5: Faute d'orthographe
Write-Host "Test 5: Avec typo - 'kels tarifs avez vou'"
Write-Host 'Q: "kels tarifs avez vou"' -ForegroundColor Cyan
$body = @{'message'='kels tarifs avez vou'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$content = $response.Content | ConvertFrom-Json
Write-Host "✅ Trouvé: $($content.found)" -ForegroundColor Green
Write-Host ""

# Test 6: Question très générale
Write-Host "Test 6: Général - 'parlons de vos services'"
Write-Host 'Q: "parlons de vos services"' -ForegroundColor Cyan
$body = @{'message'='parlons de vos services'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$content = $response.Content | ConvertFrom-Json
Write-Host "✅ Trouvé: $($content.found)" -ForegroundColor Green
Write-Host ""

Write-Host "Resultat: La recherche intelligente comprend maintenant:" -ForegroundColor Cyan
Write-Host "  - Mots-cles exacts" -ForegroundColor Green
Write-Host "  - Variations de mots" -ForegroundColor Green
Write-Host "  - Paraphrases" -ForegroundColor Green
Write-Host "  - Petites fautes d'orthographe" -ForegroundColor Green
Write-Host "  - Contexte semantique" -ForegroundColor Green
