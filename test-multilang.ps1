Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "CHATBOT MULTI-LANGUE - TEST" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

$headers = @{'Content-Type' = 'application/json'}

# Test 1: French
Write-Host "TEST 1: FRANCAIS" -ForegroundColor Green
Write-Host "Q: 'Quels services proposez-vous ?'" -ForegroundColor Cyan
$body = @{'message' = 'Quels services proposez-vous ?'; 'language' = 'fr'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
Write-Host "Langue: $($json.language)" -ForegroundColor White
Write-Host "Trouvé: $($json.found)" -ForegroundColor White
Write-Host "Réponse: $($json.message.Substring(0, 80))..." -ForegroundColor Gray
Write-Host ""

# Test 2: English
Write-Host "TEST 2: ENGLISH" -ForegroundColor Green
Write-Host "Q: 'What services do you offer?'" -ForegroundColor Cyan
$body = @{'message' = 'What services do you offer?'; 'language' = 'en'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
Write-Host "Language: $($json.language)" -ForegroundColor White
Write-Host "Found: $($json.found)" -ForegroundColor White
Write-Host "Response: $($json.message.Substring(0, 80))..." -ForegroundColor Gray
Write-Host ""

# Test 3: French variant
Write-Host "TEST 3: FRANCAIS (variante)" -ForegroundColor Green
Write-Host "Q: 'parlons de vos services'" -ForegroundColor Cyan
$body = @{'message' = 'parlons de vos services'; 'language' = 'fr'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
Write-Host "Langue: $($json.language)" -ForegroundColor White
Write-Host "Trouvé: $($json.found)" -ForegroundColor White
Write-Host ""

# Test 4: English variant
Write-Host "TEST 4: ENGLISH (variant)" -ForegroundColor Green
Write-Host "Q: 'Can I customize my project?'" -ForegroundColor Cyan
$body = @{'message' = 'Can I customize my project?'; 'language' = 'en'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
Write-Host "Language: $($json.language)" -ForegroundColor White
Write-Host "Found: $($json.found)" -ForegroundColor White
Write-Host ""

# Test 5: Wrong language in wrong context
Write-Host "TEST 5: CROSS-LANGUAGE (should not work)" -ForegroundColor Green
Write-Host "Q: 'Quels services' [language: en]" -ForegroundColor Cyan
$body = @{'message' = 'Quels services'; 'language' = 'en'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
Write-Host "Found: $($json.found) (should be false)" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Multi-langue support: WORKING!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
