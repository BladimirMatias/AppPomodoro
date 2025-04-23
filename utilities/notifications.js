import * as Notifications from "expo-notifications";

// Configurar cómo se comportan las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const enviarNotificacion = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏳ Pomodoro Finalizado",
        body: "Tu tiempo ha terminado. ¡Tómate un descanso!",
        sound: true,
        vibrate: [0, 250, 250, 250], // Vibración opcional
      },
      trigger: null, // Se envía de inmediato
    });
  } catch (error) {
    console.log("Error al enviar notificación:", error);
  }
};