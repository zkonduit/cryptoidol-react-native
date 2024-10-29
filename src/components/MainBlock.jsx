import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ConfettiComponent from './ConfettiComponent'
import { RecordButton } from './RecordButton'

const MainBlock = () => {
  const [state, setState] = useState('start')
  const [recording, setRecording] = useState(false)

  const startRecord = () => {
    setState('inprogress')
    setRecording(true)
  }

  const stopRecord = () => {
    setRecording(false)
  }

  const startPlayback = () => {
    setState('inprogress')
  }

  const stopPlayback = () => {

  }

  const submitRecording = () => {
    setState('processing')
    setTimeout(() => {
      setState('result')
    }, 2000)
  }

  const restart = () => {
    setState('start')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/*<CustomCanvas state={state} />*/}
      {
        state === 'minted' &&
        <ConfettiComponent />
      }


      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {state === 'start' && (
            <Text style={styles.headerText}>Think you can be the next <Text style={styles.boldText}>Crypto Idol</Text>?</Text>
          )}
          {state === 'inprogress' && recording && (
            <Text style={styles.headerText}>Sing now! Press Stop when you're done️</Text>
          )}
          {state === 'end' && !recording && (
            <Text style={styles.headerText}>Will the AI like you? Get judged 🤔️</Text>
          )}
          {state === 'inprogress' && !recording && (
            <Text style={styles.headerText}>Here's what you've sung ❤️</Text>
          )}

          <View style={styles.buttonContainer}>
            {state !== 'processing' && state !== 'result' && (
              <RecordButton
                recordState={state}
                onPress={() => {
                  if (state === 'start') {
                    startRecord()
                  } else if (state === 'inprogress') {
                    setState('end')
                    recording ? stopRecord() : stopPlayback()
                  } else if (state === 'end') {
                    startPlayback()
                  }
                }}
              />
            )}
            {state === 'end' && (
              <>
                <TouchableOpacity style={styles.submitButton} onPress={submitRecording}>
                  <Text style={styles.buttonText}>SUBMIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.restartButton} onPress={restart}>
                  <Text style={styles.buttonText}>RESTART</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MainBlock


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 8,
    textAlign: 'center',
  },
  headerText: {
    marginVertical: 8,
    marginHorizontal: 16,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButton: {
    marginHorizontal: 8,
    backgroundColor: '#38a169', // Gradient approximated
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  restartButton: {
    marginHorizontal: 8,
    backgroundColor: '#e53e3e', // Gradient approximated
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
