// Script de teste do Firebase Auth
// Rodar: node test-firebase-auth.js

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } = require('firebase/auth');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔥 Testando conexão Firebase Auth...\n');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Email de teste aleatório
const testEmail = `test-${Date.now()}@petsos.com`;
const testPassword = 'Test123456';

(async () => {
  try {
    // Teste 1: Criar usuário
    console.log('1️⃣ Criando usuário de teste...');
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Usuário criado com sucesso!');
    console.log('   UID:', userCredential.user.uid);
    console.log('   Email:', userCredential.user.email);

    // Teste 2: Fazer login
    console.log('\n2️⃣ Testando login...');
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Login funcionou!');

    // Teste 3: Pegar token
    console.log('\n3️⃣ Pegando token de autenticação...');
    const token = await userCredential.user.getIdToken();
    console.log('✅ Token gerado:');
    console.log('   ', token.substring(0, 50) + '...');

    // Limpar: deletar usuário de teste
    console.log('\n4️⃣ Limpando usuário de teste...');
    await deleteUser(userCredential.user);
    console.log('✅ Usuário de teste removido');

    console.log('\n🎉 FIREBASE AUTH ESTÁ FUNCIONANDO PERFEITAMENTE!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERRO:', error.code);
    console.error('   Mensagem:', error.message);
    console.log('\n🔍 Verifique:');
    console.log('   - Authentication está habilitado no console Firebase?');
    console.log('   - Provider Email/Password está ativado?');
    console.log('   - Credenciais no .env estão corretas?');
    process.exit(1);
  }
})();
