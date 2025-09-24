import { NavBar } from '../../Componentes/Navbar'
import { useLocation } from 'react-router-dom';
import MostrarTurnos from '../../Componentes/MostrarTurnos';
import BotonNotificaciones from '../../Componentes/Notificaciones';

/**
 * PANEL CLIENTE - INTEGRACIÓN DE NOTIFICACIONES PUSH
 *
 * ¿Qué hace este archivo?
 * - Muestra el panel del cliente con el listado de turnos y el botón para activar notificaciones push.
 * - El botón <BotonNotificaciones /> permite al usuario suscribirse a notificaciones y guardar su playerId en el backend.
 *
 * ¿Qué necesitas saber?
 * - El botón solo funciona si OneSignal está correctamente inicializado (ver index.html y App.jsx).
 * - El playerId se asocia al usuario logueado y permite enviarle recordatorios y avisos desde el backend.
 */

export const PanelCliente = () => {

    const location = useLocation();
    const user = location.state;

  return (
    <div>
      <NavBar user={user} />
      <div style={{ padding: '20px' }}>
        <h1>Panel Cliente</h1>
        <MostrarTurnos tipoUsuario="cliente" userInfo={user} />
        <BotonNotificaciones />
      </div>
    </div>
  )
}
