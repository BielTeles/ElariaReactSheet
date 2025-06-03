import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CharacterList from './pages/CharacterList';
import CharacterCreation from './pages/CharacterCreation';
import CharacterSheet from './pages/CharacterSheet';
import FinalizedCharacterSheet from './components/CharacterSheet/CharacterSheet';
import ReferenceGuide from './pages/ReferenceGuide';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/characters" element={<CharacterList />} />
            <Route path="/characters/new" element={<CharacterCreation />} />
            <Route path="/characters/:id" element={<CharacterSheet />} />
            <Route path="/character-sheet" element={<FinalizedCharacterSheet />} />
            <Route path="/reference" element={<ReferenceGuide />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
