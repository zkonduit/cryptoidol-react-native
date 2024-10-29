import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, useColorScheme, View } from 'react-native'
import ConfettiComponent from './ConfettiComponent'
import ActionButtons from './ActionButtons'
import UserPrompt from './UserPrompt'

const MainBlock = () => {
  const [state, setState] = useState('start')
  const [recording, setRecording] = useState(false)
  const colorScheme = useColorScheme()

  const isDarkMode = colorScheme === 'dark'

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
    console.log('submitting')
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


      <View style={[styles.container, { backgroundColor: isDarkMode ? '#252525' : '#FFFFFF' }]}>
        <UserPrompt state={state} recording={recording} isDarkMode={isDarkMode} />
        <ActionButtons
          state={state}
          recording={recording}
          onRecordPress={() => {
            if (state === 'start') startRecord()
            else if (state === 'inprogress') {
              setState('end')
              recording ? stopRecord() : stopPlayback()
            } else if (state === 'end') startPlayback()
          }}
          onSubmit={submitRecording}
          onRestart={restart}
        />
      </View>
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
