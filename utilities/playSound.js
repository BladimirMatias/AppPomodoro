import { Audio } from 'expo-av';

export const playSound = async (sonido) => {
  try {
    const { sound } = await Audio.Sound.createAsync(sonido);
    await sound.playAsync();
  } catch (error) {
    console.log("Error al reproducir sonido:", error);
  }
};