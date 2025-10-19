/*
  SCRIPT DE VERIFICACIÓN: Estado de OneSignal
  
  Este script verifica el estado completo de la integración con OneSignal
  y muestra información detallada sobre la suscripción.
*/

console.log('\n🔍 === VERIFICACIÓN DE ESTADO DE ONESIGNAL ===\n');

// Esperar a que OneSignal esté disponible
setTimeout(async () => {
  if (!window.OneSignal) {
    console.error('❌ OneSignal no está disponible');
    return;
  }

  try {
    console.log('📊 INFORMACIÓN GENERAL:');
    console.log('   - OneSignal inicializado:', !!window.OneSignal);
    console.log('   - User disponible:', !!window.OneSignal.User);
    console.log('   - Notifications disponible:', !!window.OneSignal.Notifications);

    console.log('\n🔔 ESTADO DE NOTIFICACIONES:');
    const permission = await window.OneSignal.Notifications.permission;
    console.log('   - Permiso:', permission);
    console.log('   - Permiso concedido:', permission === 'granted' || permission === true);

      let subscription = window.OneSignal.User?.PushSubscription;
      if (subscription) {
        console.log('\n📱 SUSCRIPCIÓN:');
        console.log('   - ID:', subscription.id || 'No disponible');
        console.log('   - Token:', subscription.token ? subscription.token.substring(0, 50) + '...' : 'No disponible');
        console.log('   - OptedIn:', subscription.optedIn);
        // Intentar obtener más info
        try {
          const subscriptionData = await window.OneSignal.User.PushSubscription.getSubscription();
          console.log('   - Datos completos:', subscriptionData);
        } catch (e) {
          console.log('   - No se pudieron obtener datos completos');
        }
      }

    console.log('\n🌐 CONFIGURACIÓN:');
    console.log('   - URL actual:', window.location.href);
    console.log('   - Protocolo:', window.location.protocol);
    console.log('   - Es HTTPS o localhost:', window.location.protocol === 'https:' || window.location.hostname === 'localhost');

    console.log('\n⚙️ SERVICE WORKER:');
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log('   - Service Workers registrados:', registrations.length);
      registrations.forEach((reg, index) => {
        console.log(`   - SW ${index + 1}:`, reg.active?.scriptURL || 'No activo');
      });
    } else {
      console.log('   - Service Worker no soportado');
    }

    console.log('\n💡 RECOMENDACIONES:');
    
    if (!subscription?.id) {
      console.log('   ⚠️  No hay playerId. El usuario debe:');
      console.log('      1. Hacer click en "Activar recordatorios"');
      console.log('      2. Aceptar el permiso del navegador');
      console.log('      3. Verificar que se guarde el playerId');
    }

    if (permission !== 'granted' && permission !== true) {
      console.log('   ⚠️  Permisos no concedidos. Verificar:');
      console.log('      - Hacer click en el ícono del candado en la barra de direcciones');
      console.log('      - Cambiar "Notificaciones" a "Permitir"');
    }

    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      console.log('   ⚠️  No estás en HTTPS ni localhost');
      console.log('      - OneSignal requiere HTTPS en producción');
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }

  console.log('\n🔍 === FIN DE VERIFICACIÓN ===\n');
}, 3000);
