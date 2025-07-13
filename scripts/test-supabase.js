// ===================================================================
// SCRIPT DE TESTE - CONFIGURAÇÃO SUPABASE
// ===================================================================

const fs = require('fs');
const path = require('path');

console.log('🔍 Testando configuração do Supabase...\n');

// ===================================================================
// VERIFICAR ARQUIVO .env.local
// ===================================================================

const envPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env.local não encontrado!');
  console.log('📝 Execute: cp env.example .env.local');
  process.exit(1);
}

console.log('✅ Arquivo .env.local encontrado');

// ===================================================================
// VERIFICAR VARIÁVEIS DE AMBIENTE
// ===================================================================

const envContent = fs.readFileSync(envPath, 'utf8');

const requiredVars = [
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON_KEY'
];

let missingVars = [];

requiredVars.forEach(varName => {
  if (!envContent.includes(varName) || envContent.includes(`${varName}=your_`)) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('❌ Variáveis de ambiente não configuradas:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Configure as variáveis no arquivo .env.local');
  process.exit(1);
}

console.log('✅ Variáveis de ambiente configuradas');

// ===================================================================
// VERIFICAR ARQUIVOS DE SERVIÇO
// ===================================================================

const serviceFiles = [
  'src/services/supabase.ts',
  'src/services/authService.ts',
  'src/services/characterService.ts'
];

serviceFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo ${file} não encontrado`);
    process.exit(1);
  }
});

console.log('✅ Arquivos de serviço encontrados');

// ===================================================================
// VERIFICAR SCRIPT SQL
// ===================================================================

const sqlPath = path.join(__dirname, '..', 'database', 'schema.sql');
if (!fs.existsSync(sqlPath)) {
  console.log('❌ Arquivo database/schema.sql não encontrado');
  process.exit(1);
}

console.log('✅ Script SQL encontrado');

// ===================================================================
// RESULTADO FINAL
// ===================================================================

console.log('\n🎉 Configuração local está correta!');
console.log('\n📋 Próximos passos:');
console.log('1. Crie um projeto no Supabase (https://supabase.com)');
console.log('2. Execute o script SQL no painel do Supabase');
console.log('3. Configure as URLs de autenticação');
console.log('4. Teste com: npm start');
console.log('\n📖 Consulte o guia completo em: setup-supabase.md'); 