// src/Componentes/Notificaciones.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

/** * BOTÓN DE NOTIFICACIONES PUSH (ONESIGNAL) * 
 * * ¿Qué hace este componente? 
 * * - Muestra un botón para que el usuario active las notificaciones push. 
 * * - Al hacer click, muestra el prompt de OneSignal para suscribirse. 
 * * - Cuando el usuario acepta, obtiene el playerId de OneSignal y lo envía al backend junto con el JWT del usuario. * 
 * * - El backend guarda el playerId en el usuario para poder enviarle notificaciones push. * 
 * * ¿Qué necesitas saber? 
 * * - window.OneSignal se inicializa por el script externo en index.html. 
 * * - El JWT debe estar en localStorage (o ajusta según tu lógica de login). 
 * * - El backend debe tener la ruta /api/usuarios/notificaciones para guardar el playerId. 
 * * - El playerId es único por dispositivo/navegador. 
 *  * Documentación oficial: https://documentation.onesignal.com/docs/web-push-sdk */

const BotonNotificaciones = ({ className = "", iconColor = "#3e2214" }) => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Chequear estado inicial de suscripción (si OneSignal ya está cargado)
  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        if (window?.OneSignal?.isPushNotificationsEnabled) {
          const isEnabled = await window.OneSignal.isPushNotificationsEnabled();
          setEnabled(Boolean(isEnabled));
        }
      } catch (e) {
        console.warn("No se pudo verificar el estado de OneSignal:", e);
      }
    };
    checkInitialStatus();
  }, []);

  const handleClick = async () => {
    if (!window?.OneSignal) {
      alert("OneSignal no está cargado.");
      return;
    }

    setLoading(true);
    try {
      // Muestra el prompt de suscripción
      await window.OneSignal.showSlidedownPrompt();

      // Espera el cambio de suscripción una sola vez
      const isSubscribed = await new Promise((resolve) => {
        const handler = (subscribed) => {
          window.OneSignal.off("subscriptionChange", handler);
          resolve(subscribed);
        };
        window.OneSignal.on("subscriptionChange", handler);
      });

      if (isSubscribed) {
        setEnabled(true);
        const playerId = await window.OneSignal.getUserId();
        const token = localStorage.getItem("token"); // ajusta si guardás el JWT en otro lado

        try {
          await axios.post(
            "/api/usuarios/notificaciones",
            { playerId },
            { headers: token ? { "x-token": token } : {} }
          );
          // Si querés mostrar un toast, podés hacerlo acá
        } catch (err) {
          console.error("Error guardando playerId en backend:", err);
          alert("No se pudo guardar el playerId.");
        }
      }
    } catch (error) {
      console.error("Error activando notificaciones:", error);
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
