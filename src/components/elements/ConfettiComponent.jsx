import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import ConfettiCannon from 'react-native-confetti-cannon'

const ConfettiComponent = () => {
  const { width } = Dimensions.get('window')

  return (
    <View style={styles.confettiContainer}>
      <ConfettiCannon
        count={200}
        origin={{ x: width / 2, y: 0 }}
        fadeOut={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  confettiContainer: {
    ...StyleSheet.absoluteFillObject, // Makes the confetti cover the entire area
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensures confetti is on top
  },
})

export default ConfettiComponent
