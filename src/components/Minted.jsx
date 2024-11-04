import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Minted = ({ onPress }) => {
  return (
    <View style={styles.finishedContainer}>
      {/* Success message */}
      <Text style={styles.finishedText}>Score successfully published! 🎉</Text>

      {/* Share button */}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Record Again</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  finishedContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  finishedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38a169', // Dark green color for success message
    marginBottom: 15,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#4A90E2', // Blue button background for visibility
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
  },
  buttonText: {
    fontSize: 16, // Adjust the size for readability
    color: '#fff', // White text color for better contrast
    fontWeight: 'bold',
  },
})

export default Minted
