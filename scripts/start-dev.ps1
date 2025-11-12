param(
    [int]$Port = 3000
)

Write-Output "[start-dev.ps1] Ensuring port $Port is free..."
try {
    $net = netstat -ano | Select-String ":$Port"
    if ($net) {
        $pids = ($net -split "\r?\n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' } | ForEach-Object { ($_ -split '\s+')[-1] }) | Sort-Object -Unique
        foreach ($pid in $pids) {
            Write-Output "[start-dev.ps1] Killing PID $pid"
            taskkill /PID $pid /F | Out-Null
        }
        Start-Sleep -Seconds 1
        Write-Output "[start-dev.ps1] Done."
    } else {
        Write-Output "[start-dev.ps1] Port $Port appears free."
    }
} catch {
    Write-Warning "[start-dev.ps1] Could not inspect or kill processes: $_"
}

Write-Output "[start-dev.ps1] Starting dev server (npm run dev)..."
npm run dev
