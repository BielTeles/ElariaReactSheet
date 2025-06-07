// ===================================================================
// APP PRINCIPAL - ELARIA RPG
// ===================================================================

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from './components/Header';
import { ROUTES } from './constants';

// Lazy loading dos componentes de página
const Home = lazy(() => import('./pages/Home'));
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
                <Route path={ROUTES.CHARACTERS} element={<CharacterList />} />
                <Route path={ROUTES.CHARACTER_NEW} element={<CharacterCreation />} />
                <Route path={ROUTES.CHARACTER_DETAIL} element={<CharacterSheet />} />
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
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
