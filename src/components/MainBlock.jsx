import React, { useRef, useState } from 'react'
import { Alert, Linking, SafeAreaView, StyleSheet, useColorScheme, View } from 'react-native'
import ConfettiComponent from './ConfettiComponent'
import ActionButtons from './ActionButtons'
import UserPrompt from './UserPrompt'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import CustomCanvas from './canvas/CustomCanvas'

const MainBlock = () => {
  const [state, setState] = useState('start')
  const [recording, setRecording] = useState(false)
  const [recordFilePath, setRecordFilePath] = useState(null)

  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current


  const checkMicrophonePermission = async () => {
    // TODO - Implement permission check for Android and IOS Correctly
    const permission = await check(PERMISSIONS.IOS.MICROPHONE)
    if (permission === RESULTS.GRANTED) {
      return true
    } else if (permission === RESULTS.DENIED) {
      const requestPermission = await request(PERMISSIONS.IOS.MICROPHONE)
      return requestPermission === RESULTS.GRANTED
    } else if (permission === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Needed',
        'Microphone access is required to record audio. Please enable it in Settings.',
        [
          { text: 'OK' },
          { text: 'Open Settings', onPress: () => Linking.openURL('app-settings:') },
        ],
      )
      return false
    }
    return false
  }


  const startRecord = async () => {

    // const hasPermission = await checkMicrophonePermission()
    // if (!hasPermission) return

    setState('inprogress')
    setRecording(true)

    try {
      const result = await audioRecorderPlayer.startRecorder()
      setRecordFilePath(result) // Set the file path for playback
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  // Function to stop recording
  const stopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder()
      setRecordFilePath(result) // Store the recorded file path
      setRecording(false)
      setState('end')
    } catch (error) {
      console.error('Failed to stop recording:', error)
    }
  }

  // Function to start playback
  const startPlayback = async () => {
    if (recordFilePath) {
      setState('inprogress')
      try {
        await audioRecorderPlayer.startPlayer(recordFilePath)
        audioRecorderPlayer.addPlayBackListener((e) => {
          if (e.currentPosition === e.duration) {
            stopPlayback()
          }
        })
      } catch (error) {
        console.error('Failed to start playback:', error)
      }
    }
  }

  // Function to stop playback
  const stopPlayback = async () => {
    try {
      await audioRecorderPlayer.stopPlayer()
      audioRecorderPlayer.removePlayBackListener()
      setState('end')
    } catch (error) {
      console.error('Failed to stop playback:', error)
    }
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
      <CustomCanvas state={state} />
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
