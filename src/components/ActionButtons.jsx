import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RecordButton } from './RecordButton'

const ActionButtons = ({ state, recording, onRecordPress, onSubmit, onRestart }) => {
  const submitButtonColor = '#38a169'
  const restartButtonColor = '#e53e3e'


  return (
    <View style={styles.buttonContainer}>
      {state !== 'processing' && state !== 'result' && (
        <RecordButton recordState={state} onPress={onRecordPress} recording={recording} />
      )}
      {state === 'end' && (
        <>
          <TouchableOpacity style={[styles.submitButton, { backgroundColor: submitButtonColor }]} onPress={onSubmit}>
            <Text style={styles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.restartButton, { backgroundColor: restartButtonColor }]} onPress={onRestart}>
            <Text style={styles.buttonText}>RESTART</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

export default ActionButtons

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButton: {
    marginHorizontal: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  restartButton: {
    marginHorizontal: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
})
