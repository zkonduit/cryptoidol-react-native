import React, { useEffect, useRef, useState } from 'react'
import { Alert, Animated, StyleSheet, View } from 'react-native'
import { useGlobalStyles } from '../styles'
import { generateProverInputJSON, runModelProver } from '../prover/runModelProver'
import { LinksSection } from './elements/LinkSection'
import CancelButton from './elements/CancelButton'

const sentences = [
  'Generating cryptographic proof... 🔐',
  'Verifying with zero-knowledge technology... ⚙️',
  'Almost there! Preparing proof for verification... 🛠️',
]

export const GeneratingProof = ({ score, preprocessedRecordingData, onProofGenerated, onCancelled }) => {
  const [currentSentence, setCurrentSentence] = useState(0)
  const fadeAnim = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const globalStyles = useGlobalStyles()
  const canceled = useRef(false)

  // TODO - use a real blockchain address when contracts support it
  const blockchainAddress = 0.08811962604522705

  useEffect(() => {
    const proverInput = generateProverInputJSON(preprocessedRecordingData, score, blockchainAddress)
    runModelProver(proverInput).then((proof) => {
        if (canceled.current) {
          console.debug('Proof generated, but canceled')
        } else {
          console.debug('Proof generated successfully')
          onProofGenerated(proof)
        }
      }, (error) => {
        console.error('Proof generation error:', error)
        Alert.alert('Error generating proof', 'Please try again', [{ text: 'OK' }])
      },
    )
  }, [onProofGenerated, preprocessedRecordingData, score])

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
        setCurrentSentence((prev) => (prev + 1) % sentences.length)
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
  }, [fadeAnim, scaleAnim])

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
          {sentences[currentSentence]}
        </Animated.Text>
      </View>

      <CancelButton onCancel={() => {
        canceled.current = true
        onCancelled()
      }} />
      <LinksSection />

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
})
