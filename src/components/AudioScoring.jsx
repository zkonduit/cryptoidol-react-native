import { Alert, Animated, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useGlobalStyles } from '../styles'
import preprocessAudioFile from '../audio/preprocessAudioFile'
import { runAudioClassifier } from '../audio/audioClassifier'

const sentences = [
  'Analyzing audio! 🕒',
  'Please give us a minute! ⏳',
  'Almost there! Verifying your results ⚙️',
]


export const AudioScoring = ({ onCancel, recording, onFinished }) => {

  const [currentSentence, setCurrentSentence] = useState(0)
  const fadeAnim = useRef(new Animated.Value(1)).current // Start with opacity 1 for instant display
  const scaleAnim = useRef(new Animated.Value(0.95)).current // Slight scale effect
  const preprocessedRecording = useRef(null)
  const modelResults = useRef(null)
  const [processingState, setProcessingState] = useState('processing') // ['processing', 'finished'

  const globalStyles = useGlobalStyles()

  const handleCancel = () => {
    setProcessingState('cancelled')
    onCancel()
    // TODO - figure out a way to handle cancel to run the processing while not blocking UI
    // Currently we have a workaround by splitting the processing into multiple tasks
    // And then checking if the task was cancelled before running the next step
    // This is not ideal and should be fixed
  }

  useEffect(() => {
    preprocessAudioFile(recording).then(
      (result) => {
        preprocessedRecording.current = result
        setProcessingState('classification')
      },
      (error) => {
        console.error(error)
        Alert.alert('Error processing audio', 'Please try again', [{ text: 'OK' }])
        handleCancel()
      },
    )

  }, [recording])

  useEffect(() => {
    // TODO - we currently have a timeout to allow all the blocked UI Cancel calls to run before we continue processing
    setTimeout(() => {
      if (processingState === 'classification') {
        runAudioClassifier(preprocessedRecording.current).then(
          (result) => {
            modelResults.current = result
            setProcessingState('finished')
          },
          (error) => {
            console.error(error)
            Alert.alert('Error processing audio', 'Please try again', [{ text: 'OK' }])
            handleCancel()
          },
        )
      } else if (processingState === 'finished') {
        onFinished(preprocessedRecording.current, modelResults.current)
      }
    }, 50)
  }, [processingState, onFinished])

  useEffect(() => {
    // Cycle through sentences every 5 seconds
    const timer = setInterval(() => {
      // Fade out current sentence
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Update to the next sentence
        setCurrentSentence((prev) => (prev + 1) % sentences.length)

        // Fade in new sentence with scale effect
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start()
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.sentenceText,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              color: globalStyles.userText.color, // Adjust for night mode
            },
          ]}
        >
          {sentences[currentSentence]}
        </Animated.Text>
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={globalStyles.buttonText}>CANCEL</Text>
      </TouchableOpacity>
      <LinksSection isNightMode={globalStyles.isDarkMode} />
    </View>
  )
}


const LinksSection = ({ isNightMode }) => (
  <View style={styles.linksContainer}>
    <Text style={[styles.linksHeader, { color: isNightMode ? '#cccccc' : '#555555' }]}>
      Tap below to learn more:
    </Text>
    <View style={styles.linksRow}>
      <Text style={[styles.linkText, { color: isNightMode ? '#aaaaaa' : '#666666' }]}
            onPress={() => Linking.openURL('https://ezkl.xyz/')}>
        ezkl.xyz
      </Text>
      <Text style={styles.divider}>|</Text>
      <Text style={[styles.linkText, { color: isNightMode ? '#aaaaaa' : '#666666' }]}
            onPress={() => Linking.openURL('https://discord.gg/cbNvpsThmd')}>
        Discord
      </Text>
      <Text style={styles.divider}>|</Text>
      <Text style={[styles.linkText, { color: isNightMode ? '#aaaaaa' : '#666666' }]}
            onPress={() => Linking.openURL('https://t.me/+QRzaRvTPIthlYWMx')}>
        Telegram
      </Text>
    </View>
  </View>
)

export default AudioScoring

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  textContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  sentenceText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  linksContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linksHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  divider: {
    marginHorizontal: 8,
    fontSize: 14,
    color: '#888888',
  },
})
