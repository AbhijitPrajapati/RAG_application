import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import CollectionsPage from './pages/collections/CollectionsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ChatPage />} />
        <Route path='/collections' element={<CollectionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;