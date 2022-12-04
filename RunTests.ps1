$days = Get-ChildItem -Directory | Select-Object Name | Where {$_ -match "\d{2}.$"}

foreach ($day in $days) {
    Write-Host "==DAY $($day.Name)=="
    Push-Location $day.Name
    tsc "solution.ts"
    pwsh -Command { $env:TESTS_ONLY="true"; node "solution.js" }
    Pop-Location
    if ($LASTEXITCODE -ne 0) { break; }
}