import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UsuarioList from './components/Usuario/UsuarioList';
// luego importar PacienteList, etc.

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/usuarios" element={<UsuarioList />} />
        {/* Aquí agregaremos las rutas para otras entidades */}
      </Routes>
    </Router>
  );
}
