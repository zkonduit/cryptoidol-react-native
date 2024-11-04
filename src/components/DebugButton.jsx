import React, { useState } from 'react'
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { testAudioProcessing } from '../audio/TestAudio'

const DebugControls = ({ state, onFinished, renderAvatar, onRenderSelected }) => {
  const [isProcessing, setIsProcessing] = useState(false) // State for button processing

  // Handles processing dummy recording
  const handleProcess = () => {
    setIsProcessing(true)
    testAudioProcessing().then(
      () => {
        console.log('Processing complete')
        setIsProcessing(false)
        onFinished()
      },
      (error) => {
        console.error('Error processing audio:', error)
        setIsProcessing(false)
      },
    )
  }

  // Handles toggle switch for avatar rendering
  const handleToggleAvatar = (value) => {
    onRenderSelected(value)
  }

  return (
    <View style={styles.debugContainer}>
      {/* Displaying the debug state */}
      <Text style={styles.debugText}> {'Debug State: ' + state} </Text>

      {/* Button for processing */}
      <TouchableOpacity
        onPress={handleProcess}
        style={[styles.button, isProcessing && styles.buttonDisabled]}
        disabled={isProcessing}
      >
        <Text style={styles.buttonText}>{isProcessing ? 'Processing...' : 'Process Dummy Recording'}</Text>
      </TouchableOpacity>

      {/* Toggle switch for avatar rendering */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Render Avatar (Only Real iPhone)</Text>
        <Switch
          value={renderAvatar}
          onValueChange={handleToggleAvatar}
          trackColor={{ false: '#767577', true: '#007bff' }} // Colors for switch
          thumbColor={renderAvatar ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  debugContainer: {
    padding: 15,
    backgroundColor: '#f0f0f0', // Light background color to separate the section
    borderRadius: 10,
    marginVertical: 10,
  },
  debugText: {
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff', // Button background color
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0', // Gray out the button when disabled
  },
  buttonText: {
    fontSize: 14, // Small button text
    color: '#fff', // White text color
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
})

export default DebugControls
