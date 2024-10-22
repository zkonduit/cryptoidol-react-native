import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';

const App = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Count: {count}</Text>
        <Button title="Increment" onPress={handleIncrement} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    alignItems: 'center',
  },
  counterText: {
    fontSize: 32,
    marginBottom: 20,
  },
});

// TODO - use this style from tailwind.config.js
// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     margin: 0,
//     padding: 0,
//     overflow: 'hidden', // Similar to "overflow: hidden" in CSS
//   },
// });

export default App;


