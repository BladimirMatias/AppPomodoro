import { View, Text, Pressable, StyleSheet } from "react-native";

const opciones = ["Pomodoro", "Descanso Corto", "Descanso Largo"];

const Tabs = ({seleccion, setSeleccion}) => {
  return (
    <View style={styles.container}>
      {opciones.map((opcion, index) => (
        <Pressable
          key={index}
          onPress={() => setSeleccion(index)}
          style={[
            styles.tab,
            seleccion === index && styles.tabActivo
          ]}
        >
          <Text style={[
            styles.text,
            seleccion === index && styles.textActivo
          ]}>
            {opcion}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  tab: {
    padding: 5,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 5,
    marginHorizontal: 1,
  },
  tabActivo: {
    backgroundColor: "white",
  },
  text: {
    opacity: 0.8,
    color: "white",
  },
  textActivo: {
    opacity: 1,
    color: "black",
    fontWeight: "bold",
  },
});

export default Tabs;