@echo off
echo ================================
echo    DEPLOY ELARIA RPG
echo ================================
echo.

echo [1/3] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha na instalacao das dependencias
    pause
    exit /b 1
)

echo.
echo [2/3] Construindo projeto para producao...
call npm run build
if %errorlevel% neq 0 (
    echo ERRO: Falha no build do projeto
    pause
    exit /b 1
)

echo.
echo [3/3] Build concluido com sucesso!
echo.
echo ================================
echo    PROXIMOS PASSOS:
echo ================================
echo.
echo 1. Netlify (Recomendado):
echo    - Va para: https://netlify.com/drop
echo    - Arraste a pasta 'build' para o site
echo.
echo 2. Vercel:
echo    - Execute: npx vercel --prod
echo.
echo 3. GitHub Pages:
echo    - Execute: npm run deploy
echo.
echo A pasta 'build' esta pronta para deploy!
echo.
pause 