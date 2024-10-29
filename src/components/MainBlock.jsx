import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, useColorScheme, View } from 'react-native'
import ConfettiComponent from './ConfettiComponent'
import ActionButtons from './ActionButtons'
import UserPrompt from './UserPrompt'
import CustomCanvas from './canvas/CustomCanvas'

const MainBlock = () => {
  const [state, setState] = useState('start')
  const [recording, setRecording] = useState(false)

  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'

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
      <CustomCanvas state={state} />
      {
        state === 'minted' &&
        <ConfettiComponent />
      }


      <View style={[styles.container, { backgroundColor: isDarkMode ? '#252525' : '#FFFFFF' }]}>
        <UserPrompt state={state} recording={recording} isDarkMode={isDarkMode} />
        <ActionButtons
          state={state}
          setState={setState}
          recording={recording}
          setRecording={setRecording}
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
