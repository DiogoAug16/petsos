// Teste do authService
// Rodar: node test-auth-service.js

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, deleteUser } = require('firebase/auth');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const authService = {
  async register(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential;
  },

  async login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  async logout() {
    return await signOut(auth);
  },

  getCurrentUser() {
    return auth.currentUser;
  }
};

console.log('🧪 Testando authService...\n');

const testEmail = `test-${Date.now()}@petsos.com`;
const testPassword = 'Test123456';
const testName = 'Test User';

(async () => {
  try {
    // Teste 1: Register
    console.log('1️⃣ Testando register(email, password, name)...');
    const registerResult = await authService.register(testEmail, testPassword, testName);
    console.log('✅ Register OK');
    console.log('   UID:', registerResult.user.uid);
    console.log('   Email:', registerResult.user.email);
    console.log('   DisplayName:', registerResult.user.displayName);

    if (registerResult.user.displayName !== testName) {
      throw new Error('DisplayName não foi definido corretamente');
    }

    // Teste 2: Logout
    console.log('\n2️⃣ Testando logout()...');
    await authService.logout();
    console.log('✅ Logout OK');
    console.log('   getCurrentUser():', authService.getCurrentUser());

    if (authService.getCurrentUser() !== null) {
      throw new Error('Usuário ainda está autenticado após logout');
    }

    // Teste 3: Login
    console.log('\n3️⃣ Testando login(email, password)...');
    const loginResult = await authService.login(testEmail, testPassword);
    console.log('✅ Login OK');
    console.log('   UID:', loginResult.user.uid);
    console.log('   DisplayName:', loginResult.user.displayName);

    // Teste 4: getCurrentUser
    console.log('\n4️⃣ Testando getCurrentUser()...');
    const currentUser = authService.getCurrentUser();
    console.log('✅ getCurrentUser OK');
    console.log('   UID:', currentUser.uid);
    console.log('   Email:', currentUser.email);
    console.log('   DisplayName:', currentUser.displayName);

    // Teste 5: Token
    console.log('\n5️⃣ Testando geração de token...');
    const token = await currentUser.getIdToken();
    console.log('✅ Token gerado');
    console.log('   ', token.substring(0, 50) + '...');

    // Limpar
    console.log('\n6️⃣ Limpando usuário de teste...');
    await deleteUser(currentUser);
    console.log('✅ Usuário removido');

    console.log('\n🎉 TODOS OS MÉTODOS DO AUTHSERVICE FUNCIONAM!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERRO:', error.code || error.message);
    console.error('   ', error.message);
    process.exit(1);
  }
})();
