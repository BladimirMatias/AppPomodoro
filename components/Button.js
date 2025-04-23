import { View, Text, Pressable, StyleSheet } from "react-native";
import { playSound } from "../utilities/playSound";

import {Audio} from "expo-av";

const Button = (props) => {

  const{run, setRun} = props

  //llamamos toggle que significa alterar valor

  const sonido = require ("../assets/sound/click.mp3")

  const toggleRun = () =>{
    setRun(!run);
    playSound(sonido);
  };

  const onClick = () => {
    console.log ("Presionaste el boton")
  };


  return (
    <View>
      <Pressable onPress={()=> toggleRun()}
        style={({pressed})=>[ styles.boton, {opacity: pressed ? 0.5 : 1}]}>
        <Text>{
          //RENDERIZADO CONDICIONAL
          //SI RUN ES VERDADERO MOSTRAR "PARAR" SI ES FALSO MOSTRAR "INICIAR"
          run ? "parar" : "iniciar"}

        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04D96F",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  boton: {
    width: 150,
    padding: 15,
    borderRadius: 7,
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});


export default Button;