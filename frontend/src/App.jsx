import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PortalLayout from './layouts/PortalLayout';
import LabLayout from './layouts/LabLayout';
import LandingPage from './pages/LandingPage';
import LabWorkspace from './pages/LabWorkspace';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Portal Routes (Has Header/Footer) */}
        <Route path="/" element={<PortalLayout />}>
          <Route index element={<LandingPage />} />
        </Route>

        {/* Full-Screen Lab Routes (No global wrapper) */}
        <Route path="/labs" element={<LabLayout />}>
          <Route path=":id" element={<LabWorkspace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
