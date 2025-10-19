/*
  SERVICE WORKER DE ONESIGNAL v16
  --------------------------
  Este archivo permite que OneSignal gestione las notificaciones push en tu sitio web.
  Debe estar en la carpeta /public y accesible desde la raíz del dominio.
  
  IMPORTANTE: Usa OneSignalSDK.sw.js (Service Worker), NO OneSignalSDK.page.js
  
  Más info: https://documentation.onesignal.com/docs/web-push-service-worker-setup
*/
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');