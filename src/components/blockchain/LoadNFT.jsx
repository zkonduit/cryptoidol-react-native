import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { Buffer } from 'buffer'
import { useReadContract } from 'wagmi'
import { cryptoIdolABI, cryptoIdolAddresses } from './TransactionPanel'

export const NFTLoader = ({ tokenId, onLoadedNFT }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const tokenMetadata = useReadContract({
    address: cryptoIdolAddresses.sepolia,
    abi: cryptoIdolABI,
    functionName: 'tokenURI',
    args: [tokenId],
  })

  useEffect(() => {
    const saveImageToFileSystem = async (base64Data) => {
      try {
        // Define file path and name
        const fileUri = `${FileSystem.cacheDirectory}nft_image_${tokenId}.svg`

        // Save the image to the file system
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        })

        // Notify the parent component
        onLoadedNFT(fileUri, tokenId)
      } catch (err) {
        setError('Failed to save NFT image to file system.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (tokenMetadata.data) {
      try {
        const data = tokenMetadata.data
        const jsonData = data.split(',')[1] // Assuming data URL format: data:application/json;base64,...
        const decodedJson = Buffer.from(jsonData, 'base64').toString('utf8')
        const jsonObject = JSON.parse(decodedJson)

        if (jsonObject.image && jsonObject.image.startsWith('data:image')) {
          // Extract base64 image data
          const base64Image = jsonObject.image.split(',')[1]
          saveImageToFileSystem(base64Image)
        } else {
          setError('Invalid image data.')
          setLoading(false)
        }
      } catch (err) {
        setError('Failed to decode NFT metadata.')
        console.error(err)
        setLoading(false)
      }
    } else if (tokenMetadata.isError) {
      setError('Failed to fetch NFT metadata.')
      setLoading(false)
    }
  }, [tokenMetadata.data, tokenMetadata.isError])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading NFT...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return null // No UI needed once the NFT is loaded
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
})
