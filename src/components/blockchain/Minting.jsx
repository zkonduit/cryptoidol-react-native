import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAccount } from 'wagmi'
import { encodeAbiParameters, keccak256 } from 'viem'

import CommittingTransaction from './CommittingTransaction'
import { bigEndianToLittleEndian } from '../../util/bigEndianToLittleEndian'
import MintingTransaction from './MintingTransaction'
import { AppKit, AppKitButton } from '@reown/appkit-wagmi-react-native'
import CancelButton from '../elements/CancelButton'
import { NFTLoader } from './LoadNFT'

export const cryptoIdolAddresses = require('../../../assets/blockchain/addresses.json')
export const cryptoIdolABI = require('../../../assets/blockchain/abi.json')

export default function Minting({ onNftLoaded, onCancelled, proof }) {
  const [stage, setStage] = useState('connecting')
  const [error, setError] = useState(null)
  const [proofData, setProofData] = useState(null)
  const [nftId, setNftId] = useState(null)
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
      setError('Error preprocessing proof.\n ' + err.toString())
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

  const handleMintSuccess = (nftId) => {
    console.debug('Minted NFT completed successfully with ID:', nftId)
    setNftId(nftId)
    setStage('loadingnft')
  }

  const handleNFTLoaded = (fileUri) => {
    console.debug('NFT loaded:', fileUri)
    onNftLoaded(nftId, fileUri)
  }

  const handleError = (err) => {
    setError(err)
  }

  useEffect(() => {
    if (error) {
      console.debug('Error occurred:', error)
      setStage('error')
    }
  }, [error])

  const handleRetry = () => {
    setError(null) // Clear the error
    setStage('connecting') // Reset the stage
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
          <Text style={styles.errorTitle}>An error occurred:</Text>
          <Text style={styles.errorMessage}>{error.substring(0, 100)}{error.length > 100 ? '...' : ''}</Text>

          <View style={styles.errorButtonContainer}>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            <CancelButton onCancel={onCancelled} styleOverwrite={styles.cancelButton} />
          </View>
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

      {
        stage === 'loadingnft' && (
          <NFTLoader tokenId={nftId} onLoadedNFT={handleNFTLoaded} />

        )
      }

      {/* Bottom Cancel Button */}
      {
        stage !== 'error' &&
        <CancelButton onCancel={onCancelled} styleOverwrite={styles.bottomCancelButton} />
      }

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
  },
  infoContainer: {
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fdecea',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorTitle: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  errorButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
  },
  bottomCancelButton: {
    marginTop: 20,
    alignSelf: 'center',
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

