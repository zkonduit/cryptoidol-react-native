import React, { useEffect, useRef, useState } from 'react'
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useGlobalStyles } from '../styles'
import { generateProverInputJSON, runModelProver } from '../prover/runModelProver'

const sentencesProof = [
  'Generating cryptographic proof... 🔐',
  'Verifying with zero-knowledge technology... ⚙️',
  'Almost there! Preparing proof for verification... 🛠️',
]

const sentencesBlockchain = [
  'Publishing your proof to the blockchain... 🌐',
  'Waiting for network confirmation... ⏳',
  'Almost done! Finalizing publication... ✅',
]

export const PublishScore = ({ score, preprocessedRecordingData, onPublish }) => {
  const [currentSentence, setCurrentSentence] = useState(0)
  const [processingState, setProcessingState] = useState('generating') // ['generating', 'publishing', 'finished']
  const fadeAnim = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const globalStyles = useGlobalStyles()

  // TODO - use a real address
  const blockchainAddress = 0.08811962604522705

  const handlePublishing = async () => {
    const proverInput = generateProverInputJSON(preprocessedRecordingData, score, blockchainAddress)
    runModelProver(proverInput).then((proof) => {
        console.debug('Proof generated successfully')
        setProcessingState('publishing')

        // Now, simulate publishing the proof to blockchain
        publishToBlockchain(proof).then(() => {
          setProcessingState('finished')
          console.debug('Proof published to blockchain')
          onPublish()
        }, reason => {
          console.error('Error publishing proof:', reason)
          Alert.alert('Error publishing proof', 'Please try again', [{ text: 'OK' }])
        })
      }, (error) => {
        console.error('Proof generation error:', error)
        Alert.alert('Error generating proof', 'Please try again', [{ text: 'OK' }])
      },
    )
  }

  const publishToBlockchain = async (proof) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.debug('Proof published to blockchain')
        resolve(true)
      }, 3000) // Simulate async blockchain publishing
    })
  }

  useEffect(() => {
    handlePublishing().then(
      () => console.debug('Proof generation complete'),
      (error) => {
        console.error('Proof generation error:', error)
        Alert.alert('Error generating proof', 'Please try again', [{ text: 'OK' }])
      },
    )
  }, [])

  useEffect(() => {
    // Cycle through sentences every 4 seconds
    const timer = setInterval(() => {
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
        setCurrentSentence((prev) => (prev + 1) % (processingState === 'generating' ? sentencesProof.length : sentencesBlockchain.length))
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
  }, [processingState])

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.sentenceText,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              color: globalStyles.userText.color,
            },
          ]}
        >
          {processingState === 'generating'
            ? sentencesProof[currentSentence]
            : sentencesBlockchain[currentSentence]}
        </Animated.Text>
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={() => console.log('Cancelled')}>
        <Text style={globalStyles.buttonText}>CANCEL</Text>
      </TouchableOpacity>


    </View>
  )
}

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
})
