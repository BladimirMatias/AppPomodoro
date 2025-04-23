// Show.js
import { StyleSheet, View, Text } from 'react-native';

const Show = ({ tiempo }) => {
  return (
    <View style={styles.tiempoContainer}>
      <Text style={styles.tiempoTexto}>{tiempo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tiempoContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    marginVertical: 40,
  },
  tiempoTexto: {
    fontSize: 72,
    color: 'black',
    textAlign: 'center',
  },
});

export default Show;