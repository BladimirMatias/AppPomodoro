import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Platform, Text } from 'react-native';
import Titulo from './components/Titulo.js';
import Button from './components/Button.js';
import Show from './components/Show.js';
import Tabs from './components/tabs.js';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';


export default function App() { 

  const [tiempo, setTiempo] = useState(25 * 60);
  const [seleccion, setSeleccion] = useState(0); // Cambiado a número para el índice
  const [run, setRun] = useState(false);
  
  // Colores para cada tab
  const colores = ["#04D96F", "#FF6B6B", "#FFD166"];

  useEffect(() => {
    let intervalo;
    
    if (run && tiempo > 0) {
      intervalo = setInterval(() => {
        setTiempo(tiempoAnterior => tiempoAnterior - 1);
      }, 1000); // 1000 milisegundos = 1 segundo
    }
    
    // Limpieza del intervalo cuando el componente se desmonta o run cambia
    return () => clearInterval(intervalo);
  }, [run, tiempo]); // Se ejecuta cuando run o tiempo cambian

  useEffect(() => {
    // Reinicia el tiempo según la selección
    if (seleccion === 0) setTiempo(25 * 60); // Pomodoro
    else if (seleccion === 1) setTiempo(5 * 60); // Descanso corto
    else setTiempo(15 * 60); // Descanso largo
    
    // También detenemos el temporizador al cambiar
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
          Platform.OS === "android" && { paddingTop: 25 },
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