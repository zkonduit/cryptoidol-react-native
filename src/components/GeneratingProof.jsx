import React, { useEffect, useRef } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { generateProverInputJSON, runModelProver } from '../prover/runModelProver'
import { LinksSection } from './elements/LinkSection'
import CancelButton from './elements/CancelButton'
import RotatingSentences from './elements/RotatingSentences'

const sentences = [
  'Generating cryptographic proof... 🔐',
  'Verifying with zero-knowledge technology... ⚙️',
  'Almost there! Preparing proof for verification... 🛠️',
]

export const GeneratingProof = ({ score, preprocessedRecordingData, onProofGenerated, onCancelled }) => {
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


  return (
    <View style={styles.container}>
      <RotatingSentences sentences={sentences} />

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
})
