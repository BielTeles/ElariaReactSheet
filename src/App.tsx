import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CharacterList from './pages/CharacterList';
import CharacterCreation from './pages/CharacterCreation';
import CharacterSheet from './pages/CharacterSheet';
import FinalizedCharacterSheet from './components/CharacterSheet/CharacterSheet';
import ReferenceGuide from './pages/ReferenceGuide';

function AppContent() {
  const location = useLocation();
  const isCharacterSheet = location.pathname === '/character-sheet';

  return (
    <div className="min-h-screen">
      <Header />
      {isCharacterSheet ? (
        <main className="w-full">
          <Routes>
            <Route path="/character-sheet" element={<FinalizedCharacterSheet />} />
          </Routes>
        </main>
      ) : (
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/characters" element={<CharacterList />} />
            <Route path="/characters/new" element={<CharacterCreation />} />
            <Route path="/characters/:id" element={<CharacterSheet />} />
            <Route path="/reference" element={<ReferenceGuide />} />
          </Routes>
        </main>
      )}
    </div>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AppContent />
    </Router>
  );
}

export default App;
