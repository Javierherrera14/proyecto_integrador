import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import RegistroForm from './pages/RegistroForm';
import UsuarioPage from './pages/Usuarios';
import PacienteListPage from './pages/PacienteListPage'; // O ajusta el nombre real si es `PacientePage.tsx`
import PacienteFormPage from './pages/PacienteFormPage';
import HerramientaMustPage from "./pages/HerramientaMustPage";

import FrecuenciaConsumoAlimentosPage from '../src/pages/FrecuenciaConsumoAlimentosPage';
import AntecedentesPatologicosPage from './pages/AntecedentesPatologicosPage';

import CircunstanciasAmbientalesPage from './pages/CircunstanciasAmbientalesPage';
import ExamenFisicoPage from './pages/ExamenFisicoPage';
import ExamenesBioquimicosPage from './pages/ExamenesBioquimicosPage';

import DatosAlimentariosPage from './pages/DatosAlimentariosPage';
import R24Page from './pages/R24Page';
import R24DetallePage from './pages/R24DetallePage';
import PacienteVerPage from './pages/PacienteVerPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm  />} />
        <Route path="/registro" element={<RegistroForm />} />


        <Route path="/usuarios" element={<UsuarioPage />} />


        <Route path="/pacientes" element={<PacienteListPage />} />
        <Route path="/pacientes/nuevo" element={<PacienteFormPage />} />
        <Route path="/pacientes/editar/:id" element={<PacienteFormPage />} />



        <Route path="/herramienta-must/:id" element={<HerramientaMustPage />} />

        <Route path="/frecuenciaConsumoAlimentos/:idPaciente" element={<FrecuenciaConsumoAlimentosPage />} />
        
        <Route path="/antecedentesPatologicos/:idPaciente" element={<AntecedentesPatologicosPage />} />
        
        <Route path="/circunstancias-ambientales/:idPaciente" element={<CircunstanciasAmbientalesPage />} />

        <Route path="/examen-fisico/:idPaciente" element={<ExamenFisicoPage />} />
        <Route path="/examen_fisico/:idPaciente/:examenId" element={<ExamenFisicoPage />} />

        <Route path="/examenes-bioquimicos/:id" element={<ExamenesBioquimicosPage />} />
        
        <Route path="/datos-alimentariosPage/:paciente_id" element={<DatosAlimentariosPage />} />

        <Route path="/r24/:idPaciente" element={<R24Page />} />

        <Route path="/r24_detalle/:idR24" element={<R24DetallePage />} />

        <Route path="/pacientes/ver/:id" element={<PacienteVerPage />} />

      </Routes>
    </Router>
  );
}

export default App;
