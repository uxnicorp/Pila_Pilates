import { useLocation } from 'react-router-dom';
import { NavBar } from '../../Componentes/Navbar';
import MostrarTurnos from '../../Componentes/MostrarTurnos';

export const PanelEmpleado = () => {
  
      const location = useLocation();
    const user = location.state;
  
  return (
    <div>
      <NavBar user={user} />
      <div style={{ padding: '20px' }}>
        <h1>Panel Empleado</h1>
        <MostrarTurnos tipoUsuario="empleado" userInfo={user} />
      </div>
    </div>
  )
}
