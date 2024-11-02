import React, { useEffect, useState } from 'react'
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import CustomCanvas from './canvas/CustomCanvas'
import ConfettiComponent from './ConfettiComponent'
import Processing from './Processing'
import { Recording } from './Recording'
import { testAudioProcessing } from '../audio/TestAudio'
import { prepareModelProver } from '../prover/modelProverSetup'

const MainBlock = () => {
  const [state, setState] = useState('recording')
  const renderAvatar = false // TODO - make this true to render the avatar
  const [recording, setRecording] = useState(null)
  const [result, setResult] = useState(null)

  const submitRecording = (record) => {
    setRecording(record)
    setState('processing')
  }

  const onProcessingFinished = (result) => {
    setState('result')
    setResult(result)
    // Log the result rounding it to nearest 2 decimal places
    console.debug('Audio Scoring Result:', Math.round(result * 100) / 100)
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text> {'Debug State: ' + state}</Text>
      {
        renderAvatar &&
        <CustomCanvas state={state} />
      }
      {
        state === 'minted' &&
        <ConfettiComponent />
        // TODO - also show the NFT image as in the web version
      }

      {
        // TODO - remove this button after testing
        <Button onPress={testAudioProcessing} title={'Process'}> Testing Processing</Button>
      }


      {state === 'recording' && (
        <Recording onSubmit={submitRecording} />
        // <Button title="Record" onPress={() => setState('processing')} />
      )
      }
      {state === 'processing' && (
        <Processing onCancel={() => setState('recording')} recording={recording} onFinished={onProcessingFinished} />
        // <Button title="Finish" onPress={() => setState('result')} />
      )
      }
      {
        state === 'result' && result !== null && (
          // Show the score and option to record again
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Result is {Math.round(result * 100) / 100} / 1</Text>

            <Button title="Record Again" onPress={() => setState('recording')} />
          </View>

        )}
    </SafeAreaView>
  )
}

export default MainBlock

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
})
