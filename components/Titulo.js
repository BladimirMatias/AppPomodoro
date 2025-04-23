
import { View, Text, StyleSheet } from "react-native";

const Titulo = ({ titulo }) => {
  return (
    <View>
      <Text style={styles.texto}>{titulo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  texto: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    padding: 10,
  },
});

export default Titulo;
