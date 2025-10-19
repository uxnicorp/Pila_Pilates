/*
  SCRIPT DE LIMPIEZA Y RE-SUSCRIPCIÓN
  
  Este script limpia la suscripción actual y fuerza una nueva suscripción
  para solucionar problemas cuando OneSignal no reconoce al usuario.
*/

async function limpiarYResuscribir() {
  console.log('\n🧹 === LIMPIEZA Y RE-SUSCRIPCIÓN ===\n');

  if (!window.OneSignal) {
    alert('OneSignal no está disponible. Recargá la página.');
    return;
  }

  try {
    console.log('1️⃣ Obteniendo estado actual...');
    const estadoAntes = {
      playerId: window.OneSignal.User?.PushSubscription?.id,
      optedIn: window.OneSignal.User?.PushSubscription?.optedIn,
      permission: await window.OneSignal.Notifications.permission
    };
    console.log('   Estado antes:', estadoAntes);

    console.log('\n2️⃣ Desuscribiendo del usuario actual...');
    
    // Optar out (desuscribirse)
    if (window.OneSignal.User?.PushSubscription?.optOut) {
      await window.OneSignal.User.PushSubscription.optOut();
      console.log('   ✅ Opt-out exitoso');
    }

    // Esperar un momento
    await new Promise(r => setTimeout(r, 1000));

    console.log('\n3️⃣ Volviendo a suscribir...');
    
    // Optar in (suscribirse)
    if (window.OneSignal.User?.PushSubscription?.optIn) {
      await window.OneSignal.User.PushSubscription.optIn();
      console.log('   ✅ Opt-in exitoso');
    }

    // Esperar un momento para que se genere el nuevo playerId
    await new Promise(r => setTimeout(r, 2000));

    console.log('\n4️⃣ Verificando nuevo estado...');
    const estadoDespues = {
      playerId: window.OneSignal.User?.PushSubscription?.id,
      optedIn: window.OneSignal.User?.PushSubscription?.optedIn,
      permission: await window.OneSignal.Notifications.permission
    };
    console.log('   Estado después:', estadoDespues);

    if (estadoDespues.playerId && estadoDespues.playerId !== estadoAntes.playerId) {
      console.log('\n✅ ¡Nuevo playerId generado!');
      console.log('   Anterior:', estadoAntes.playerId);
      console.log('   Nuevo:', estadoDespues.playerId);
      
      // Intentar guardar el nuevo playerId
      console.log('\n5️⃣ Guardando nuevo playerId en el backend...');
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await fetch('http://localhost:4000/api/usuarios/notificaciones', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-token': token
            },
            body: JSON.stringify({ playerId: estadoDespues.playerId })
          });
          
          const data = await response.json();
          console.log('   Respuesta:', data);
          
          if (data.ok) {
            alert('✅ ¡Re-suscripción exitosa!\n\nNuevo PlayerId: ' + estadoDespues.playerId.substring(0, 20) + '...\n\nAhora deberías aparecer en OneSignal.');
          }
        } catch (err) {
          console.error('   Error guardando:', err);
          alert('PlayerId generado pero no se pudo guardar en el servidor:\n' + estadoDespues.playerId);
        }
      } else {
        alert('Nuevo PlayerId generado:\n' + estadoDespues.playerId + '\n\nPero no hay token de sesión. Iniciá sesión y hacé click en "Activar recordatorios".');
      }
    } else {
      console.log('\n⚠️  No se generó un nuevo playerId o es el mismo');
      alert('No se pudo generar un nuevo playerId. Intentá:\n1. Borrar las notificaciones del sitio en configuración del navegador\n2. Recargar la página\n3. Volver a activar notificaciones');
    }

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    alert('Error: ' + error.message);
  }

  console.log('\n🧹 === FIN DE LIMPIEZA ===\n');
}

// Hacer disponible globalmente para poder llamar desde consola
window.limpiarYResuscribir = limpiarYResuscribir;

console.log('💡 Para forzar una re-suscripción, escribí en la consola: limpiarYResuscribir()');
