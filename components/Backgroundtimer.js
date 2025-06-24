// backgroundTimer.js
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

const BACKGROUND_TASK = 'background-timer-task';
const alarma = require('../assets/sound/alarmclock.mp3');

TaskManager.defineTask(BACKGROUND_TASK, async () => {
  try {
    const endTime = await AsyncStorage.getItem('endTime');

    if (endTime && Date.now() >= parseInt(endTime)) {
      // Alarma
      const { sound } = await Audio.Sound.createAsync(alarma);
      await sound.playAsync();

      // Notificación
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⏰ ¡Tiempo finalizado!",
          body: "Terminó tu sesión Pomodoro.",
          sound: true,
        },
        trigger: null,
      });

      await AsyncStorage.removeItem('endTime');
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Error en background task:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTimer(endTimestamp) {
  await AsyncStorage.setItem('endTime', endTimestamp.toString());

  await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
    minimumInterval: 60, // cada 60 segundos
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export async function unregisterBackgroundTimer() {
  await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK);
}
