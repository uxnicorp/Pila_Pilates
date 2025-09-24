import { NavBar } from '../../Componentes/Navbar'
import { useLocation } from 'react-router-dom';
import MostrarTurnos from '../../Componentes/MostrarTurnos';

export const PanelCliente = () => {

    const location = useLocation();
    const user = location.state;

  return (
    <div>
      <NavBar user={user} />
      <div style={{ padding: '20px' }}>
        <h1>Panel Cliente</h1>
        <MostrarTurnos tipoUsuario="cliente" userInfo={user} />
      </div>
    </div>
  )
}
