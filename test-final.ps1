Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "CHATBOT INTELLIGENT - TEST FINAL" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

$headers = @{'Content-Type' = 'application/json'}

$tests = @(
    @{ msg = "Quels services proposez-vous ?"; desc = "Mots-cles exacts" },
    @{ msg = "est ce qu'il ya des autres services"; desc = "Variante conversationnelle" },
    @{ msg = "combien coute le basic pack"; desc = "Question tarifaire" },
    @{ msg = "on peut faire du support apres lancement"; desc = "Question de support" },
    @{ msg = "parlons de votre offre globale"; desc = "Demande generale" }
)

$success = 0
$total = $tests.Count

foreach ($test in $tests) {
    $body = @{'message' = $test.msg} | ConvertTo-Json
    try {
        $response = Invoke-WebRequest -Uri http://localhost:8000/api/chatbot/reply -Method POST -Headers $headers -Body $body -UseBasicParsing
        $json = $response.Content | ConvertFrom-Json
        
        if ($json.found) {
            Write-Host "[OK] $($test.desc)" -ForegroundColor Green
            Write-Host "  Q: $($test.msg)" -ForegroundColor Gray
            Write-Host "  R: $($json.message.Substring(0, 70))..." -ForegroundColor Gray
            $success++
        } else {
            Write-Host "[NO] $($test.desc)" -ForegroundColor Yellow
            Write-Host "  Q: $($test.msg)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "[ERR] $($test.desc)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Resultat: $success/$total tests reussis" -ForegroundColor $(if ($success -eq $total) {'Green'} else {'Yellow'})
Write-Host "========================================`n" -ForegroundColor Cyan
