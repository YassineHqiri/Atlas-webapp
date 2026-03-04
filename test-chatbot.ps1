$ErrorActionPreference = 'SilentlyContinue'

Write-Host "🧪 TEST CHATBOT API" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow
Write-Host ""

# Test 1 : Question avec réponse
Write-Host "Test 1: Question trouvée"
$headers = @{'Content-Type'='application/json'}
$body = @{
    message='Quels services proposez-vous ?'
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing
    
    $content = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode)"
    Write-Host "Message trouvé: $($content.found)"
    Write-Host "Réponse: $($content.message.substring(0, 60))..."
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)"
}

Write-Host ""

# Test 2 : Question sans réponse directe
Write-Host "Test 2: Question générique"
$body = @{
    message='Parlez-moi de votre équipe'
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing
    
    $content = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode)"
    Write-Host "Message trouvé: $($content.found)"
    Write-Host "Réponse par défaut: $($content.message.substring(0, 50))..."
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)"
}

Write-Host ""

# Test 3 : Validation (message vide)
Write-Host "Test 3: Validation - Message vide"
$body = @{
    message=''
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing
    Write-Host "❌ Devrait retourner 400"
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ Validation OK (400 reçu)"
    }
}

Write-Host ""

# Test 4 : Check logs en base
Write-Host "Test 4: Vérifier les logs en base de données"
Write-Host "Exécutez en terminal:" -ForegroundColor Cyan
Write-Host "  mysql -u root -p atlastech-web1 -e 'SELECT COUNT(*) as total FROM chat_logs;'"
