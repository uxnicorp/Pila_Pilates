import React from 'react';
import axios from 'axios';

/**
 * BOTÓN DE NOTIFICACIONES PUSH (ONESIGNAL)
 *
 * ¿Qué hace este componente?
 * - Muestra un botón para que el usuario active las notificaciones push.
 * - Al hacer click, muestra el prompt de OneSignal para suscribirse.
 * - Cuando el usuario acepta, obtiene el playerId de OneSignal y lo envía al backend junto con el JWT del usuario.
 * - El backend guarda el playerId en el usuario para poder enviarle notificaciones push.
 *
 * ¿Qué necesitas saber?
 * - window.OneSignal se inicializa por el script externo en index.html.
 * - El JWT debe estar en localStorage (o ajusta según tu lógica de login).
 * - El backend debe tener la ruta /api/usuarios/notificaciones para guardar el playerId.
 * - El playerId es único por dispositivo/navegador.
 *
 * Documentación oficial: https://documentation.onesignal.com/docs/web-push-sdk
 */

const BotonNotificaciones = () => {
  const handleClick = async () => {
    // Espera que OneSignal esté inicializado por el script externo
    if (window.OneSignal) {
      try {
        await window.OneSignal.showSlidedownPrompt();

        window.OneSignal.on('subscriptionChange', async (isSubscribed) => {
          if (isSubscribed) {
            const playerId = await window.OneSignal.getUserId();
            const token = localStorage.getItem('token'); // Ajusta si el JWT está en otro lado

            try {
              const res = await axios.post(
                '/api/usuarios/notificaciones',
                { playerId },
                { headers: { 'x-token': token } }
              );
              if (res.data.ok) {
                alert('PlayerId guardado correctamente');
              } else {
                alert('No se pudo guardar el playerId');
              }
            } catch (err) {
              alert('Error de conexión');
            }
          }
        });
      } catch (error) {
        console.error('Error activating notifications:', error);
      }
    } else {
      alert('OneSignal is not loaded.');
    }
  };

  return (
    <button onClick={handleClick}>
      🔔 Activar recordatorios
    </button>
  );
};

export default BotonNotificaciones;