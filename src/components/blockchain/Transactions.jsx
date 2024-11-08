import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAccount } from 'wagmi'
import { encodeAbiParameters, keccak256 } from 'viem'

import CommittingTransaction from './CommittingTransaction'
import { bigEndianToLittleEndian } from '../../util/bigEndianToLittleEndian'
import MintingTransaction from './MintingTransaction'
import { AppKit, AppKitButton } from '@reown/appkit-wagmi-react-native'

export const cryptoIdolAddresses = require('../../../assets/blockchain/addresses.json')
export const cryptoIdolABI = require('../../../assets/blockchain/abi.json')

export default function Transactions({ onTransactionComplete, onCancelled, proof }) {
  const [stage, setStage] = useState('connecting')
  const [error, setError] = useState(null)
  const [proofData, setProofData] = useState(null)
  const { isConnected } = useAccount()

  // Preprocess the proof before starting transactions
  const preprocessProof = async () => {
    try {
      const json_proof = JSON.parse(proof)

      const hexProof = json_proof.hex_proof
      const instances = json_proof.instances.map((pair) =>
        pair.map((value) => `0x${bigEndianToLittleEndian(value)}`),
      )

      const dataHash = keccak256(
        encodeAbiParameters([{ type: 'bytes' }, { type: 'uint256[]' }], [hexProof, instances.flat()]),
      )

      setProofData({ hexProof, instances, dataHash })
    } catch (err) {
      setError('Error preprocessing proof.')
      Alert.alert('Error', err.toString(), [{ text: 'OK' }])
    }
  }

  const handleStartProcess = async () => {
    if (isConnected && stage === 'connecting') {
      setStage('preprocessing')
      console.debug('Finished preprocessing proof')
      await preprocessProof()
      setStage('committing')
    } else if (!isConnected) {
      setStage('connecting')
    }
  }

  useEffect(() => {
    handleStartProcess()
  }, [isConnected])

  const handleCommitSuccess = () => {
    console.debug('Committed proof hash!')
    setStage('minting')
  }

  const handleMintSuccess = () => {
    console.debug('Minted NFT completed successfully!')
    onTransactionComplete()
  }

  const handleError = (err) => {
    setError(err)
    Alert.alert('Error', err.toString(), [{ text: 'OK' }])
    setStage('error')
  }

  const handleRetry = () => {
    setError(null) // Clear the error
    handleStartProcess() // Retry the process
  }

  return (
    <View style={styles.container}>
      <AppKitButton balance="show" />
      <AppKit />
      {/* Show connection message when waiting for user to connect wallet */}
      {stage === 'connecting' && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Please connect your wallet to mint NFT.</Text>
        </View>
      )}

      {/* Display error message if there's an error */}
      {stage === 'error' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            An error occurred: {error.substring(0, 60)}{error.length > 60 ? '...' : ''}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Show committing stage UI if no error */}
      {stage === 'committing' && (
        <CommittingTransaction
          proofData={proofData}
          onSuccess={handleCommitSuccess}
          onError={handleError}
        />
      )}

      {/* Show minting stage UI if no error */}
      {stage === 'minting' && proofData && (
        <MintingTransaction proofData={proofData} onSuccess={handleMintSuccess} onError={handleError} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#e53e3e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  infoContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
  },
  infoText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})


export const transactionsStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007bff',
  },
})

