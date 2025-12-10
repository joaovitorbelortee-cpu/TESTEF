# Script para configurar Git no Windows
# Execute este arquivo: .\configurar-git.ps1

# Tentar encontrar o Git em diferentes locais
$gitPaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
    "git.exe"
)

$gitExe = $null
foreach ($path in $gitPaths) {
    if (Test-Path $path -ErrorAction SilentlyContinue) {
        $gitExe = $path
        break
    }
    # Tentar como comando
    $cmd = Get-Command $path -ErrorAction SilentlyContinue
    if ($cmd) {
        $gitExe = $cmd.Source
        break
    }
}

if ($null -eq $gitExe) {
    Write-Host "❌ Git não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Git de: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git encontrado em: $gitExe" -ForegroundColor Green
Write-Host ""

# Configurar email
Write-Host "Configurando email..." -ForegroundColor Cyan
& $gitExe config --global user.email "joaovitorbelortee@gmail.com"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Email configurado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao configurar email" -ForegroundColor Red
}

# Configurar nome
Write-Host "Configurando nome..." -ForegroundColor Cyan
& $gitExe config --global user.name "belorte"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Nome configurado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao configurar nome" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Configuração atual:" -ForegroundColor Cyan
& $gitExe config --global --list | Select-String -Pattern "user\."

Write-Host ""
Write-Host "✅ Configuração concluída!" -ForegroundColor Green



