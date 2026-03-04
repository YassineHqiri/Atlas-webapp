$headers = @{'Content-Type' = 'application/json'}
$body = '{"message":"Quels services proposez-vous ?"}'

Write-Host "Making API call..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    
    $json = $response.Content | ConvertFrom-Json
    Write-Host "Response:" -ForegroundColor Green
    Write-Host ($json | ConvertTo-Json) -ForegroundColor White
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "`n=== Checking logs ===" -ForegroundColor Cyan
$logFile = "c:\Users\hp\Atlas-webapp\atlastech-backend\storage\logs\laravel-2026-03-03.log"
if (Test-Path $logFile) {
    $lastLines = Get-Content $logFile -Tail 30
    Write-Host $lastLines
} else {
    Write-Host "Log file not found" -ForegroundColor Red
}
