import React, { useState } from 'react'
import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import { useAccount } from 'wagmi'
import { AppKit, AppKitButton, useAppKit } from '@reown/appkit-wagmi-react-native'
import { encodeAbiParameters, keccak256 } from 'viem'

import { testWorkflow } from '../../util/TestSystem'
import { bigEndianToLittleEndian } from '../../util/bigEndianToLittleEndian'
import MintingTransaction from './MintingTransaction'
import CommittingTransaction from './CommittingTransaction'

export const cryptoIdolAddresses = require('../../../assets/blockchain/addresses.json')
export const cryptoIdolABI = require('../../../assets/blockchain/abi.json')

export default function Transactions({ onTransactionComplete, onCancelled, proof }) {
  const [stage, setStage] = useState('idle') // stages: idle, preprocessing, committing, minting, completed
  const [error, setError] = useState(null)
  const [proofData, setProofData] = useState(null)
  const { isConnected } = useAccount()
  const { open } = useAppKit()

  // Preprocess the proof before starting transactions
  const preprocessProof = async () => {
    try {
      setStage('preprocessing')
      const proof = await testWorkflow() // TODO - use a real proof instead of a test workflow
      const json_proof = JSON.parse(proof)

      const hexProof = json_proof['hex_proof']
      const instances = json_proof['instances'].map((pair) =>
        pair.map((value) => BigInt(`0x${bigEndianToLittleEndian(value)}`)),
      )

      const dataHash = keccak256(
        encodeAbiParameters([{ type: 'bytes' }, { type: 'uint256[]' }], [hexProof, instances.flat()]),
      )

      setProofData({ hexProof, instances, dataHash })
      setStage('committing')
    } catch (err) {
      setError('Error preprocessing proof.')
      Alert.alert('Error', err.toString(), [{ text: 'OK' }])
    }
  }

  const handleStartProcess = async () => {
    if (!isConnected) {
      open() // Prompt the user to connect their wallet
    } else {
      await preprocessProof()
    }
  }

  const handleCommitSuccess = () => {
    setStage('idle')
  }

  const handleMintSuccess = () => {
    setStage('completed')
    if (onTransactionComplete) {
      onTransactionComplete()
    }
  }

  const handleError = (err) => {
    setError(err)
    Alert.alert('Error', err.toString(), [{ text: 'OK' }])
  }

  return (
    <View style={styles.container}>
      <AppKitButton balance="show" />
      <AppKit />
      {stage === 'idle' && (
        <View>
          <Text>Welcome! Press the button to start the process.</Text>
          <Button title="Start Process" onPress={handleStartProcess} />
        </View>
      )}
      {stage === 'preprocessing' && <Text>Preprocessing proof. Will be removed once the real workflow is set up.</Text>}
      {stage === 'committing' && proofData && (
        <CommittingTransaction
          proofData={proofData}
          onSuccess={handleCommitSuccess}
          onError={handleError}
        />
      )}
      {stage === 'minting' && proofData && (
        <MintingTransaction proofData={proofData} onSuccess={handleMintSuccess} onError={handleError} />
      )}
      {stage === 'completed' && <Text>Transaction completed successfully!</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
})
