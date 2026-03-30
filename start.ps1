Write-Host "Starting Nexus Banking Architect..."
$PORT = 8000

# Start python HTTP server in the background and capture the process
$process = Start-Process -FilePath "python" -ArgumentList "-m http.server $PORT" -NoNewWindow -PassThru -RedirectStandardOutput "server.log" -RedirectStandardError "server_error.log"

# Save the Process ID (PID) to a file so we can stop it later
$process.Id | Out-File -FilePath "server.pid" -Encoding ascii

Write-Host "Server successfully started." -ForegroundColor Green
Write-Host "Access the application at: http://localhost:$PORT"
Write-Host "Process ID ($($process.Id)) saved to server.pid"
