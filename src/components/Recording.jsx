import React, { useEffect, useRef, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
} from 'react-native-audio-recorder-player'
import { RecordButton } from './elements/RecordButton'
import { useGlobalStyles } from '../styles'


// TODO - consider splitting this into recording and recorded components
export const Recording = ({ onSubmit, state, setState }) => {
  const globalStyles = useGlobalStyles()

  const [recordFilePath, setRecordFilePath] = useState(null)
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current
  const [promptText, setPromptText] = useState('')

  useEffect(() => {
    if (state === 'start') {
      setPromptText('Think you can be the next Crypto Idol?')
    } else if (state === 'recording') {
      setPromptText('Sing now! Press Stop when you\'re done️')
    } else if (state === 'recorded') {
      setPromptText('Will the AI like you? Get judged 🤔️')
    } else if (state === 'listening') {
      setPromptText('Here\'s what you\'ve sung ❤️')
    } else {
      setPromptText('Invalid application state ⛔️\nPlease reload the app')
      console.error('Invalid recording state:', state)
    }
  }, [state])

  // const checkMicrophonePermission = async () => {
  //   // Define platform-specific permissions
  //   const permissionType =
  //     Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
  //
  //   // Check the permission status
  //   const permission = await check(permissionType);
  //   if (permission === RESULTS.GRANTED) {
  //     return true;
  //   } else if (permission === RESULTS.DENIED) {
  //     const requestPermission = await request(permissionType);
  //     return requestPermission === RESULTS.GRANTED;
  //   } else if (permission === RESULTS.BLOCKED) {
  //     Alert.alert(
  //       "Permission Needed",
  //       "Microphone access is required to record audio. Please enable it in Settings.",
  //       [
  //         { text: "OK" },
  //         { text: "Open Settings", onPress: () => Linking.openURL('app-settings:') },
  //       ]
  //     );
  //     return false;
  //   }
  //   return false;
  // };

  const startRecord = async () => {

    // TODO - check for microphone permission
    // const hasPermission = await checkMicrophonePermission()
    // if (!hasPermission) return

    setState('recording')

    const audioSettings =
      {
        AVSampleRateKeyIOS: 44100, // Sample rate of audio file in Hz (44.1 kHz is standard)
        AVFormatIDKeyIOS: AVEncodingOption.wav, // Uncompressed format (LPCM)
        AVLinearPCMBitDepthKeyIOS: 16, // 16-bit depth for quality
        AVLinearPCMIsBigEndianKeyIOS: false, // Default to little-endian
        AVLinearPCMIsFloatKeyIOS: false, // Integer format (not float)
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high, // High-quality audio encoding
        AVModeIOS: AVModeIOSOption.spokenaudio, // Mode optimized for voice/audio recording
      }

    try {
      const result = await audioRecorderPlayer.startRecorder(undefined, audioSettings, false)
      audioRecorderPlayer.addRecordBackListener((e) => {
        // No action needed here, just prevent warning
      })

      setRecordFilePath(result) // Set the file path for playback
    } catch (error) {
      console.error('Failed to start recording:', error)
    }


  }

  // Function to stop recording
  const stopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder()
      audioRecorderPlayer.removeRecordBackListener()
      setRecordFilePath(result) // Store the recorded file path
      setState('recorded')
    } catch (error) {
      console.error('Failed to stop recording:', error)
    }
  }

  // Function to start playback
  const startPlayback = async () => {
    if (recordFilePath) {
      setState('listening')
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
      setState('recorded')
    } catch (error) {
      console.error('Failed to stop playback:', error)
    }
  }

  // Function to collect the recorded file for further processing
  const collectRecording = () => {
    if (recordFilePath) {
      console.debug('Collecting recording file:', recordFilePath)
      return recordFilePath // Return the MP4 file path
    } else {
      Alert.alert('No Recording', 'Please record a track before submitting.')
      return null
    }
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.headerText}>{promptText}</Text>
      <View style={styles.buttonContainer}>
        <RecordButton
          startRecord={startRecord}
          stopRecord={stopRecord}
          startPlayback={startPlayback}
          stopPlayback={stopPlayback}
          recordingState={state}
        />
        {state === 'recorded' && (
          <>
            <TouchableOpacity
              style={[globalStyles.secondaryButton, styles.actionButton]}
              onPress={() => setState('start')}
            >
              <Text style={globalStyles.buttonText}>RESTART</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.primaryButton, styles.actionButton]}
              onPress={() => onSubmit(collectRecording())}
            >
              <Text style={globalStyles.buttonText}>SUBMIT</Text>
            </TouchableOpacity>

          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
})
