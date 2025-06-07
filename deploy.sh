#!/bin/bash

echo "================================"
echo "    DEPLOY ELARIA RPG"
echo "================================"
echo

echo "[1/3] Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    echo "ERRO: Falha na instalação das dependências"
    exit 1
fi

echo
echo "[2/3] Construindo projeto para produção..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERRO: Falha no build do projeto"
    exit 1
fi

echo
echo "[3/3] Build concluído com sucesso!"
echo
echo "================================"
echo "    PRÓXIMOS PASSOS:"
echo "================================"
echo
echo "1. Netlify (Recomendado):"
echo "   - Vá para: https://netlify.com/drop"
echo "   - Arraste a pasta 'build' para o site"
echo
echo "2. Vercel:"
echo "   - Execute: npx vercel --prod"
echo
echo "3. GitHub Pages:"
echo "   - Execute: npm run deploy"
echo
echo "A pasta 'build' está pronta para deploy!"
echo 