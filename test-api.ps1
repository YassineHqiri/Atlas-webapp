$ErrorActionPreference = 'SilentlyContinue'

# Test registration
Write-Host "Testing registration endpoint..."
$headers = @{'Content-Type'='application/json'}
$body = @{
    name='Test User'
    email='test123@example.com'
    password='testpass123'
    password_confirmation='testpass123'
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/auth/register `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing
    
    Write-Host "Response Status: $($response.StatusCode)"
    Write-Host "Response Content: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
