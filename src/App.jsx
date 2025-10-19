import React, { useEffect } from "react";
import AppRoutes from "./rutas/AppRoutes"

/**
 * INTEGRACIÓN DE ONESIGNAL (NOTIFICACIONES PUSH)
 *
 * ¿Qué hace este archivo?
 * - OneSignal se inicializa directamente en index.html con el script nativo
 * - Aquí solo verificamos que esté disponible para usar en los componentes
 *
 * ¿Cómo funciona?
 * - Cuando el usuario acepta las notificaciones (desde el botón en PanelCliente), OneSignal registra el playerId.
 * - El playerId se envía al backend para asociarlo al usuario y poder enviarle notificaciones push.
 *
 * ¿Qué necesitas saber?
 * - El SDK de OneSignal solo funciona en dominios permitidos (configura en el dashboard de OneSignal).
 * - En local, usa HTTPS para que funcione correctamente.
 * - El resto de la lógica de suscripción y guardado está en el componente BotonNotificaciones.
 *
 * Documentación oficial: https://documentation.onesignal.com/docs/web-push-quickstart
 */

function App() {

  useEffect(() => {
    // OneSignal ya se inicializa en index.html, aquí solo verificamos que esté listo
    const checkOneSignalReady = () => {
      if (window.OneSignal) {
        console.log("✅ OneSignal está disponible y listo");
        
        // Debug: Mostrar información de suscripción actual
        setTimeout(async () => {
          try {
            if (window.OneSignal.User?.PushSubscription) {
              console.log("🔍 DEBUG - Estado actual de OneSignal:");
              console.log("  - ID:", window.OneSignal.User.PushSubscription.id);
              console.log("  - Token:", window.OneSignal.User.PushSubscription.token);
              console.log("  - OptedIn:", window.OneSignal.User.PushSubscription.optedIn);
              console.log("  - Permiso:", await window.OneSignal.Notifications.permission);
            }
          } catch (e) {
            console.log("⚠️ No se pudo obtener info de debug:", e);
          }
        }, 2000); // Esperar 2 segundos para que OneSignal se inicialice completamente
      } else {
        console.log("⏳ Esperando a que OneSignal esté disponible...");
        setTimeout(checkOneSignalReady, 500);
      }
    };
    
    checkOneSignalReady();
  }, []);

  return (
    <>
    <AppRoutes />
    </>
  )
}

export default App
