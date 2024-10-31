import React, { useState } from 'react'
import { Button, SafeAreaView, StyleSheet, Text } from 'react-native'
import CustomCanvas from './canvas/CustomCanvas'
import ConfettiComponent from './ConfettiComponent'
import Processing from './Processing'
import { Recording } from './Recording'

const MainBlock = () => {
  const [state, setState] = useState('recording')
  const renderAvatar = false // TODO - make this true to render the avatar
  const [recording, setRecording] = useState(null)

  const submitRecording = (record) => {
    setRecording(record)
    setState('processing')
  }

  const onProcessingFinished = () => {
    setState('result')
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
        state === 'result' && (
          <Button title="Record Again" onPress={() => setState('recording')} />
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
