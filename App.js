import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Platform, Text } from 'react-native';
import Titulo from './components/Titulo.js';
import Button from './components/Button.js';
import Show from './components/Show.js';
import Tabs from './components/tabs.js';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import * as Notifications from "expo-notifications";
import { enviarNotificacion } from './utilities/notifications.js';

export default function App() { 
  const [tiempo, setTiempo] = useState(25 * 60);
  const [seleccion, setSeleccion] = useState(0);
  const [run, setRun] = useState(false);
  
  const colores = ["#04D96F", "#FF6B6B", "#FFD166"];
  const alarma = require("./assets/sound/alarmclock.mp3");

  // Configuración inicial de notificaciones
  useEffect(() => {
    const configurarNotificaciones = async () => {
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    configurarNotificaciones();
  }, []);

  // Efecto para el temporizador
  useEffect(() => {
    let intervalo;
    
    if (run && tiempo > 0) {
      intervalo = setInterval(() => {
        setTiempo(tiempoAnterior => tiempoAnterior - 1);
      }, 1);
    }
    
    return () => clearInterval(intervalo);
  }, [run, tiempo]);

  // Efecto para cuando el tiempo llega a cero
  useEffect(() => {
    const manejarTiempoCero = async () => {
      if (tiempo === 0 && run) {
        setRun(false);
        
        try {
          // Reproducir sonido de alarma
          const { sound } = await Audio.Sound.createAsync(alarma);
          await sound.playAsync();
          
          // Enviar notificación
          await enviarNotificacion();
          
          // Liberar recurso de sonido
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

  // Efecto para reiniciar tiempo al cambiar de tab
  useEffect(() => {
    if (seleccion === 0) setTiempo(25 * 60);  // Pomodoro
    else if (seleccion === 1) setTiempo(5 * 60); // Descanso corto
    else setTiempo(15 * 60); // Descanso largo
    
    setRun(false);
  }, [seleccion]);

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
        <Button run={run} setRun={setRun} />
        <Tabs seleccion={seleccion} setSeleccion={setSeleccion}/>
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