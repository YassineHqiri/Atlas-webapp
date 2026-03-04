$ErrorActionPreference = 'SilentlyContinue'

Write-Host "Testing /api/admin/login endpoint..."
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
    
    Write-Host "✅ Status: $($response.StatusCode)"
    $content = $response.Content | ConvertFrom-Json
    Write-Host "Message: $($content.message)"
    Write-Host "Token: $($content.data.token.substring(0, 20))..."
} catch {
    Write-Host "❌ Error Status: $($_.Exception.Response.StatusCode.value__)"
    try {
        $errorContent = $_.Exception.Response.Content.ReadAsStringAsync().Result | ConvertFrom-Json
        Write-Host "Error Message: $($errorContent.message)"
    } catch {
        Write-Host "Could not read error response"
    }
}

Write-Host ""
Write-Host "Testing /api/auth/login endpoint (customer)..."
$body = @{
    email='admin@atlastech.com'
    password='admin123'
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/auth/login `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing
    
    Write-Host "✅ Status: $($response.StatusCode)"
    $content = $response.Content | ConvertFrom-Json
    Write-Host "Message: $($content.message)"
} catch {
    Write-Host "❌ Error Status: $($_.Exception.Response.StatusCode.value__)"
    try {
        $errorContent = $_.Exception.Response.Content.ReadAsStringAsync().Result | ConvertFrom-Json
        Write-Host "Error Message: $($errorContent.message)"
    } catch {
        Write-Host "Could not read error response"
    }
}
