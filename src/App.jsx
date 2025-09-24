import React, { useEffect } from "react";
import AppRoutes from "./rutas/AppRoutes"
import OneSignal from "react-onesignal"

/**
 * INTEGRACIÓN DE ONESIGNAL (NOTIFICACIONES PUSH)
 *
 * ¿Qué hace este archivo?
 * - Inicializa el SDK de OneSignal para habilitar notificaciones push en la web.
 * - La función OneSignal.init() se ejecuta al montar la app y configura el servicio con tu appId.
 * - La opción allowLocalhostAsSecureOrigin permite probar notificaciones en local (solo en HTTPS o localhost).
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
    OneSignal.init({
      appId: "5e0ae9ac-b242-404f-857c-98a1b5c98a97",
      allowLocalhostAsSecureOrigin: true // útil para pruebas locales
    });
  }, []);

  return (
    <>
    <AppRoutes />
    </>
  )
}

export default App
