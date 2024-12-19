import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './context/ThemeContext';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <ThemeProvider>
       <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <StatusBar style="auto" />
        </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
