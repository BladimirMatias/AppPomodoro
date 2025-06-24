import { registerBackgroundTimer, unregisterBackgroundTimer } from './components/Backgroundtimer.js';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Platform, AppState } from 'react-native';
import Titulo from './components/Titulo.js';
import Button from './components/Button.js';
import Show from './components/Show.js';
import Tabs from './components/tabs.js';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import * as Notifications from "expo-notifications";
import { enviarNotificacion } from './utilities/notifications.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() { 
  const [tiempo, setTiempo] = useState(25 * 60);
  const [seleccion, setSeleccion] = useState(0);
  const [run, setRun] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  const colores = ["#04D96F", "#FF6B6B", "#FFD166"];
  const alarma = require("./assets/sound/alarmclock.mp3");

  // Configuración inicial de notificaciones
  useEffect(() => {
  let intervalo;

  if (run && tiempo > 0) {
    intervalo = setInterval(() => {
      setTiempo(t => t - 1);
    }, 1000); // cada 1 segundo

    // Registrar temporizador en segundo plano
    const fin = Date.now() + tiempo * 1000;
    registerBackgroundTimer(fin);
  } else {
    clearInterval(intervalo);
    unregisterBackgroundTimer();
  }

  return () => clearInterval(intervalo);
}, [run]);

// Configuración de permisos de notificaciones
useEffect(() => {
  const configurarNotificaciones = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  };

  configurarNotificaciones();
}, []);

  // Temporizador
  useEffect(() => {
    let intervalo;

    if (run && tiempo > 0) {
      intervalo = setInterval(() => {
        setTiempo((t) => t - 1);
      }, 1000); // 1 segundo
    }

    return () => clearInterval(intervalo);
  }, [run, tiempo]);

  // Cuando llega a 0
  useEffect(() => {
    const manejarTiempoCero = async () => {
      if (tiempo === 0 && run) {
        setRun(false);
        await AsyncStorage.removeItem('pomodoro_start_time');
        await AsyncStorage.removeItem('pomodoro_duration');

        try {
          const { sound } = await Audio.Sound.createAsync(alarma);
          await sound.playAsync();

          await enviarNotificacion();

          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              sound.unloadAsync();
            }
          });
        } catch (error) {
          console.log("Error:", error);
        }
      }
    };

    manejarTiempoCero();
  }, [tiempo, run]);

  // Cambio de sesión (Pomodoro / Descansos)
  useEffect(() => {
    if (seleccion === 0) setTiempo(25 * 60);
    else if (seleccion === 1) setTiempo(5 * 60);
    else setTiempo(15 * 60);
    detenerTemporizador();
  }, [seleccion]);

  // Guardar tiempo de inicio al empezar
  const iniciarTemporizador = async () => {
    setRun(true);
    const ahora = Date.now();
    await AsyncStorage.setItem('pomodoro_start_time', ahora.toString());
    await AsyncStorage.setItem('pomodoro_duration', tiempo.toString());
  };

  const detenerTemporizador = async () => {
    setRun(false);
    await AsyncStorage.removeItem('pomodoro_start_time');
    await AsyncStorage.removeItem('pomodoro_duration');
  };

  // Sincronizar al volver a primer plano
  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', async (estado) => {
      if (estado === 'active') {
        const inicioStr = await AsyncStorage.getItem('pomodoro_start_time');
        const duracionStr = await AsyncStorage.getItem('pomodoro_duration');

        if (inicioStr && duracionStr) {
          const inicio = parseInt(inicioStr);
          const duracion = parseInt(duracionStr);
          const ahora = Date.now();
          const transcurrido = Math.floor((ahora - inicio) / 1000);
          const restante = duracion - transcurrido;

          if (restante <= 0) {
            setTiempo(0);
            setRun(false);
            await AsyncStorage.removeItem('pomodoro_start_time');
            await AsyncStorage.removeItem('pomodoro_duration');
          } else {
            setTiempo(restante);
            setRun(true);
          }
        }
      }

      setAppState(estado);
    });

    return () => suscripcion.remove();
  }, []);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          Platform.OS === "ios" && { paddingTop: 25 },
          { backgroundColor: colores[seleccion] }
        ]}
      >
        <Titulo titulo="Pomodoro"/>
        <Show tiempo={formatTime(tiempo)}/>
        <Button run={run} setRun={() => {
          if (!run) iniciarTemporizador();
          else detenerTemporizador();
        }} />
        <Tabs seleccion={seleccion} setSeleccion={setSeleccion}/>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
