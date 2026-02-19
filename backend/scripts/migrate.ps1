param(
  [Parameter(Mandatory=$true)]
  [string]$name
)

$ErrorActionPreference = "Stop"

Write-Host "== Prisma 7 Migrate (safe) ==" -ForegroundColor Cyan
Write-Host "Migration name: $name"
Write-Host "Working dir   : $(Get-Location)"
Write-Host ""

# 1) Validar que estamos en backend (debe existir prisma.config.ts y prisma/schema.prisma)
if (!(Test-Path ".\prisma.config.ts")) {
  throw "No encuentro prisma.config.ts en el directorio actual. Ejecuta esto desde la carpeta backend."
}
if (!(Test-Path ".\prisma\schema.prisma")) {
  throw "No encuentro prisma\schema.prisma. Revisa la ruta del schema."
}
if (!(Test-Path ".\node_modules")) {
  Write-Host "Aviso: no veo node_modules. Si falla npx, ejecuta npm install." -ForegroundColor Yellow
}

# 2) Definir URLs de migraciÃ³n (usuario con acceso a repomovil + prisma_shadow)
$env:DATABASE_URL="mysql://prisma_migrate:migrate_123456@127.0.0.1:3306/repomovil"
$env:SHADOW_DATABASE_URL="mysql://prisma_migrate:migrate_123456@127.0.0.1:3306/prisma_shadow"

Write-Host "DATABASE_URL       = (prisma_migrate@localhost)/repomovil"
Write-Host "SHADOW_DATABASE_URL= (prisma_migrate@localhost)/prisma_shadow"
Write-Host ""

# 3) Verificar conectividad rÃ¡pida a la BD principal (sin herramientas extra)
Write-Host "> Checking prisma CLI..." -ForegroundColor Gray
npx prisma -v | Out-Host

try {
  Write-Host ""
  Write-Host "> npx prisma migrate dev --name $name" -ForegroundColor Green
  npx prisma migrate dev --name $name | Out-Host

  Write-Host ""
  Write-Host "> npx prisma generate" -ForegroundColor Green
  npx prisma generate | Out-Host

  Write-Host ""
  Write-Host "> npx prisma migrate status" -ForegroundColor Green
  npx prisma migrate status | Out-Host

  Write-Host ""
  Write-Host "âœ… Done." -ForegroundColor Cyan
}
catch {
  Write-Host ""
  Write-Host "âŒ Error running migration." -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  throw
}
finally {
  # 4) Limpieza: volver al runtime normal (usa tu .env con repomovil_user)
  Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
  Remove-Item Env:SHADOW_DATABASE_URL -ErrorAction SilentlyContinue
  Write-Host ""
  Write-Host "Env vars cleared (DATABASE_URL, SHADOW_DATABASE_URL)." -ForegroundColor Gray
}
