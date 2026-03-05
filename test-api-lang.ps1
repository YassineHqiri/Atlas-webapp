Write-Host "Testing API Language Support" -ForegroundColor Cyan
Write-Host "============================`n"

$headers = @{'Content-Type' = 'application/json'}

# Test EN: "what about services"
Write-Host "TEST 1: EN - 'what about services'" -ForegroundColor Green
$body = @{'message' = 'what about services'; 'language' = 'en'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
Write-Host "Language received: $($json.language)" -ForegroundColor Yellow
Write-Host "Found: $($json.found)" -ForegroundColor Yellow
Write-Host "Message: $($json.message.Substring(0, 100))..." -ForegroundColor Gray
Write-Host ""

# Test EN: "price"
Write-Host "TEST 2: EN - 'price'" -ForegroundColor Green
$body = @{'message' = 'price'; 'language' = 'en'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
Write-Host "Language: $($json.language) | Found: $($json.found)" -ForegroundColor Yellow
Write-Host ""

# Test EN: "contact"
Write-Host "TEST 3: EN - 'contact'" -ForegroundColor Green
$body = @{'message' = 'contact'; 'language' = 'en'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
Write-Host "Language: $($json.language) | Found: $($json.found) | Msg: $($json.message.Substring(0, 50))..." -ForegroundColor Yellow
Write-Host ""

# Test FR
Write-Host "TEST 4: FR - 'et les prix'" -ForegroundColor Green
$body = @{'message' = 'et les prix'; 'language' = 'fr'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
Write-Host "Language: $($json.language) | Found: $($json.found)" -ForegroundColor Yellow
Write-Host ""

Write-Host "============================`n" -ForegroundColor Cyan
Write-Host "If all EN tests show Found: True, then API works!" -ForegroundColor Green
