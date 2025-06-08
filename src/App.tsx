// ===================================================================
// APP PRINCIPAL - ELARIA RPG
// ===================================================================

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FirebaseAuthProvider, useFirebaseAuth } from './contexts/FirebaseAuthContext';
import { CharacterProvider } from './contexts/CharacterContext';
import { ToastProvider } from './contexts/ToastContext';
import { AlertProvider } from './contexts/AlertContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import { MigrationModal } from './components/MigrationModal';
import { useMigration } from './hooks/useMigration';
import { ROUTES } from './constants';

// Lazy loading dos componentes de página
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const CharacterList = lazy(() => import('./pages/CharacterList'));
const CharacterCreation = lazy(() => import('./pages/CharacterCreation'));
const CharacterSheet = lazy(() => import('./pages/CharacterSheet'));
const FinalizedCharacterSheet = lazy(() => import('./components/CharacterSheet/CharacterSheet'));
const ReferenceGuide = lazy(() => import('./pages/ReferenceGuide'));

/**
 * Componente de Loading para Suspense
 */
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 font-medium">Carregando...</p>
    </div>
  </div>
);

/**
 * Componente para gerenciar migração
 */
const MigrationManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useFirebaseAuth();
  const { checkForLocalData } = useMigration();
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [migrationChecked, setMigrationChecked] = useState(false);

  useEffect(() => {
    // Verificar migração apenas quando o usuário estiver autenticado e não estivermos carregando
    if (isAuthenticated && !isLoading && !migrationChecked) {
      const hasLocalData = checkForLocalData();
      if (hasLocalData) {
        setShowMigrationModal(true);
      }
      setMigrationChecked(true);
    }
  }, [isAuthenticated, isLoading, migrationChecked, checkForLocalData]);

  const handleMigrationComplete = () => {
    setShowMigrationModal(false);
    // Opcionalmente, recarregar a página ou fazer outras ações
    console.log('Migração concluída com sucesso!');
  };

  return (
    <>
      {children}
      <MigrationModal
        isOpen={showMigrationModal}
        onClose={() => setShowMigrationModal(false)}
        onMigrationComplete={handleMigrationComplete}
      />
    </>
  );
};

/**
 * Componente de conteúdo da aplicação
 */
function AppContent() {
  const location = useLocation();
  const isCharacterSheet = location.pathname === ROUTES.CHARACTER_SHEET;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header sempre visível */}
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>

      {/* Conteúdo principal */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          {isCharacterSheet ? (
            <main className="w-full">
              <Routes>
                <Route 
                  path={ROUTES.CHARACTER_SHEET} 
                  element={<FinalizedCharacterSheet />} 
                />
              </Routes>
            </main>
          ) : (
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                
                {/* Rotas públicas (redirecionam se logado) */}
                <Route path={ROUTES.LOGIN} element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path={ROUTES.REGISTER} element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } />
                
                {/* Rotas protegidas (requerem login) */}
                <Route path={ROUTES.PROFILE} element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path={ROUTES.CHARACTERS} element={
                  <ProtectedRoute>
                    <CharacterList />
                  </ProtectedRoute>
                } />
                <Route path={ROUTES.CHARACTER_NEW} element={
                  <ProtectedRoute>
                    <CharacterCreation />
                  </ProtectedRoute>
                } />
                <Route path={ROUTES.CHARACTER_DETAIL} element={
                  <ProtectedRoute>
                    <CharacterSheet />
                  </ProtectedRoute>
                } />
                
                {/* Rotas abertas */}
                <Route path={ROUTES.REFERENCE} element={<ReferenceGuide />} />
                
                {/* Rota 404 */}
                <Route 
                  path="*" 
                  element={
                    <div className="text-center py-12">
                      <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Página não encontrada
                      </h1>
                      <p className="text-gray-600 mb-6">
                        A página que você está procurando não existe.
                      </p>
                      <a 
                        href={ROUTES.HOME}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Voltar ao Início
                      </a>
                    </div>
                  } 
                />
              </Routes>
            </main>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

/**
 * Componente App principal
 */
function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log de erro em produção - pode ser enviado para serviço de monitoramento
        console.error('Erro capturado pelo App ErrorBoundary:', error);
        console.error('Component stack:', errorInfo.componentStack);
      }}
    >
      <Router future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}>
        <FirebaseAuthProvider>
          <AlertProvider>
            <ToastProvider>
              <CharacterProvider>
                <MigrationManager>
                  <AppContent />
                </MigrationManager>
              </CharacterProvider>
            </ToastProvider>
          </AlertProvider>
        </FirebaseAuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
