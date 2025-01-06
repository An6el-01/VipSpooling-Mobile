import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { ImageBackground, StyleSheet } from 'react-native';
import store from './store/store';
import Welcome from './screens/Onboarding/Welcome';

const AppContent = () => {
  // Get the isDarkMode state from Redux
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  // Set the background image based on isDarkMode
  const backgroundImage = isDarkMode
    ? require('./assets/DarkMode.jpg') // Dark mode image
    : require('./assets/LightMode.jpg'); // Light mode image

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Welcome isDarkMode={isDarkMode} />
    </ImageBackground>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the screen
  },
});

export default App;
