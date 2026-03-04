$ErrorActionPreference = 'SilentlyContinue'

# Test admin login
Write-Host "Testing ADMIN login..."
$headers = @{'Content-Type'='application/json'}
$body = @{
    email='admin@atlastech.com'
    password='admin123'
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/admin/login `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing
    
    Write-Host "✅ Admin Login - Status: $($response.StatusCode)"
    $content = $response.Content | ConvertFrom-Json
    Write-Host "Response: $($content.message)"
    Write-Host "Token: $($content.data.token)"
} catch {
    Write-Host "❌ Admin Login Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "Testing CUSTOMER login..."
$body = @{
    email='test123@example.com'
    password='testpass123'
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/auth/login `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing
    
    Write-Host "✅ Customer Login - Status: $($response.StatusCode)"
    $content = $response.Content | ConvertFrom-Json
    Write-Host "Response: $($content.message)"
    Write-Host "Token: $($content.data.token)"
} catch {
    Write-Host "❌ Customer Login Error: $($_.Exception.Message)"
}
