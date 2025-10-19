// src/Componentes/Notificaciones.jsx
import { useEffect, useState } from "react";
import authApi from "../api/authApi";
import "bootstrap-icons/font/bootstrap-icons.css";

/** 
 * BOTÓN DE NOTIFICACIONES PUSH (ONESIGNAL v16) 
 * 
 * ¿Qué hace este componente? 
 * - Muestra un botón para que el usuario active las notificaciones push. 
 * - Al hacer click, solicita permisos usando la nueva API v16 de OneSignal.
 * - Cuando el usuario acepta, obtiene el playerId y lo envía al backend.
 * - El backend guarda el playerId en el usuario para poder enviarle notificaciones push.
 * 
 * ¿Qué necesitas saber? 
 * - window.OneSignal se inicializa en index.html con el SDK v16.
 * - Usa la nueva API: OneSignal.Notifications.requestPermission() y OneSignal.User.PushSubscription.id
 * - El backend debe tener la ruta /api/usuarios/notificaciones para guardar el playerId. 
 * - El playerId es único por dispositivo/navegador. 
 * 
 * Documentación oficial: https://documentation.onesignal.com/docs/web-push-sdk 
 */

const BotonNotificaciones = ({ className = "", iconColor = "#3e2214" }) => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Chequear estado inicial de suscripción (si OneSignal ya está cargado)
  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        if (window?.OneSignal?.Notifications) {
          const permission = await window.OneSignal.Notifications.permission;
          setEnabled(permission === "granted");
        }
      } catch (e) {
        console.warn("No se pudo verificar el estado de OneSignal:", e);
      }
    };
    
    // Esperar un poco para que OneSignal se inicialice completamente
    setTimeout(checkInitialStatus, 1000);
  }, []);

  const handleClick = async () => {
    if (!window?.OneSignal) {
      console.error("❌ OneSignal no está disponible");
      alert("OneSignal no está cargado. Recargá la página.");
      return;
    }

    setLoading(true);
    console.log("🔔 Iniciando proceso de suscripción...");
    console.log("🔍 Estructura de OneSignal disponible:", {
      hasUser: !!window.OneSignal.User,
      hasPushSubscription: !!window.OneSignal.User?.PushSubscription,
      hasNotifications: !!window.OneSignal.Notifications
    });

    try {
      // Verificar el estado actual de los permisos
      const permission = await window.OneSignal.Notifications.permission;
      console.log("📋 Permiso actual:", permission);
      
      if (permission === "granted" || permission === true) {
        console.log("✅ Ya tiene permisos concedidos");
        
        // Ya está suscrito, obtener el playerId de diferentes formas
        let playerId = null;
        
        try {
          // Método 1: User.PushSubscription.id (v16)
          if (window.OneSignal.User?.PushSubscription?.id) {
            playerId = window.OneSignal.User.PushSubscription.id;
            console.log("📊 PlayerId obtenido de User.PushSubscription.id:", playerId);
          }
          
          // Método 2: Subscription.id (alternativo)
          if (!playerId && window.OneSignal.User?.PushSubscription?.token) {
            const token = window.OneSignal.User.PushSubscription.token;
            console.log("📊 Token obtenido:", token);
            playerId = token; // A veces el token ES el playerId
          }
          
          // Método 3: Esperar a que se genere el playerId
          if (!playerId) {
            console.log("🔄 PlayerId no disponible inmediatamente, esperando...");
            // Esperar a que OneSignal genere el playerId
            await new Promise(r => setTimeout(r, 2000));
            playerId = window.OneSignal.User?.PushSubscription?.id;
            console.log("📊 PlayerId después de esperar:", playerId);
          }
          
          console.log("📊 Estado de suscripción completo:", {
            playerId,
            optedIn: window.OneSignal.User?.PushSubscription?.optedIn,
            token: window.OneSignal.User?.PushSubscription?.token
          });
          
          if (playerId) {
            console.log("📤 Enviando playerId al backend:", playerId);
            console.log("🔑 Token en localStorage:", localStorage.getItem("token") ? "✅ Existe" : "❌ No existe");
            
            try {
              const response = await authApi.post("/api/usuarios/notificaciones", { playerId });
              console.log("✅ PlayerId guardado correctamente");
              console.log("📡 Respuesta del servidor:", response.data);
              
              setEnabled(true);
              alert(`¡Notificaciones activadas!\n\nTu ID de suscripción: ${playerId.substring(0, 8)}...`);
            } catch (err) {
              console.error("❌ Error guardando playerId en backend:", err);
              console.error("📡 Respuesta de error:", err.response?.data);
              console.error("📡 Status:", err.response?.status);
              console.error("📡 Headers enviados:", err.config?.headers);
              alert(`No se pudo guardar en el servidor: ${err.response?.data?.msg || err.message}`);
            }
          } else {
            console.warn("⚠️ Tiene permisos pero no se pudo obtener el playerId");
            console.log("🔍 Estructura completa de OneSignal.User:", window.OneSignal.User);
            alert("No se pudo obtener el ID de suscripción. Probá recargar la página.");
          }
        } catch (err) {
          console.error("❌ Error obteniendo playerId:", err);
          alert("Error obteniendo la suscripción. Probá recargar la página.");
        }
        
        setLoading(false);
        return;
      }

      // Si no tiene permisos, solicitarlos
      console.log("🔔 Solicitando permisos de notificación...");
      
      // Solicitar permiso
      const result = await window.OneSignal.Notifications.requestPermission();
      console.log("📝 Resultado de solicitud:", result);
      
      if (!result) {
        console.log("❌ Usuario rechazó las notificaciones");
        alert("Necesitás aceptar las notificaciones para recibir recordatorios.");
        setLoading(false);
        return;
      }

      console.log("✅ Usuario aceptó las notificaciones");
      console.log("⏳ Esperando a que OneSignal genere el playerId...");
      
      // Esperar a que OneSignal genere el playerId (puede tardar unos segundos)
      let intentos = 0;
      let playerId = null;
      
      while (intentos < 10 && !playerId) {
        await new Promise(r => setTimeout(r, 1000));
        playerId = window.OneSignal.User?.PushSubscription?.id;
        intentos++;
        console.log(`Intento ${intentos}/10: playerId = ${playerId || 'aún no disponible'}`);
      }
      
      if (playerId) {
        console.log("✅ PlayerId generado:", playerId);
        setEnabled(true);
        
        try {
          const response = await authApi.post("/api/usuarios/notificaciones", { playerId });
          console.log("✅ PlayerId guardado correctamente");
          console.log("📡 Respuesta del servidor:", response.data);
          alert(`¡Notificaciones activadas correctamente!\n\nAhora recibirás recordatorios de tus clases.`);
        } catch (err) {
          console.error("❌ Error guardando playerId en backend:", err);
          console.error("📡 Respuesta de error:", err.response?.data);
          alert(`Notificaciones activadas pero no se pudo guardar:\n${err.response?.data?.msg || err.message}`);
        }
      } else {
        console.warn("⚠️ No se pudo obtener el playerId después de 10 segundos");
        alert("Notificaciones aceptadas pero OneSignal no generó el ID.\nIntentá recargar la página y activar notificaciones nuevamente.");
      }
      
    } catch (error) {
      console.error("❌ Error en el proceso de suscripción:", error);
      console.error("Detalles del error:", error.message, error.stack);
      alert("Error al activar notificaciones. Revisá la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`btn panel-linkbtn ${className}`}
      onClick={handleClick}
      disabled={loading}
      aria-pressed={enabled}
      aria-label={enabled ? "Recordatorios activados" : "Activar recordatorios"}
    >
      <i
        className="bi bi-bell-fill btn-ico"
        style={{ color: iconColor, fontSize: 18 }}
        aria-hidden="true"
      />
      {enabled
        ? "Recordatorios activados"
        : loading
        ? "Activando..."
        : "Activar recordatorios"}
    </button>
  );
};

export default BotonNotificaciones;
