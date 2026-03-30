Write-Host "Stopping Nexus Banking Architect..."

if (Test-Path "server.pid") {
    $PID_CONTENT = Get-Content "server.pid"
    if ($PID_CONTENT) {
        # Stop the background process
        Stop-Process -Id $PID_CONTENT -ErrorAction SilentlyContinue
        Remove-Item "server.pid"
        Write-Host "Server (PID $PID_CONTENT) successfully stopped." -ForegroundColor Green
    }
} else {
    Write-Host "server.pid not found. The server may not be running or the PID file was deleted." -ForegroundColor Yellow
}
