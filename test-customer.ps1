$ErrorActionPreference = 'SilentlyContinue'

# Register new customer
Write-Host "Registering new customer..."
$headers = @{'Content-Type'='application/json'}
$body = @{
    name='John Doe'
    email='john@example.com'
    password='password123'
    password_confirmation='password123'
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/auth/register `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing
    
    $content = $response.Content | ConvertFrom-Json
    Write-Host "✅ Register - Status: $($response.StatusCode)"
    Write-Host "Message: $($content.message)"
    Write-Host "User: $($content.data.user.email)"
    Write-Host "Token: $($content.data.token)"
} catch {
    Write-Host "❌ Register Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "Logging in with registered customer..."
$body = @{
    email='john@example.com'
    password='password123'
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/auth/login `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing
    
    $content = $response.Content | ConvertFrom-Json
    Write-Host "✅ Customer Login - Status: $($response.StatusCode)"
    Write-Host "Message: $($content.message)"
    Write-Host "User Role: $($content.data.user.role)"
    Write-Host "Token: $($content.data.token)"
} catch {
    Write-Host "❌ Customer Login Error: $($_.Exception.Message)"
}
