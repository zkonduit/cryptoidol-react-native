import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { Buffer } from 'buffer'
import { useReadContract } from 'wagmi'
import { SvgUri } from 'react-native-svg'
import { cryptoIdolABI, cryptoIdolAddresses } from './Minting'

export const NFT = ({ tokenIdMinted }) => {
  const [imageFileUri, setImageFileUri] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const tokenMetadata = useReadContract({
    address: cryptoIdolAddresses.sepolia,
    abi: cryptoIdolABI,
    functionName: 'tokenURI',
    args: [tokenIdMinted],
  })

  useEffect(() => {
    const saveImageToFileSystem = async (base64Data) => {
      try {
        // Define file path and name
        const fileUri = `${FileSystem.cacheDirectory}nft_image.svg`

        // Save the image to the file system
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        })

        // Set the file URI
        setImageFileUri(fileUri)
        console.debug('NFT image saved to file system:', fileUri)
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFT #{BigInt(tokenIdMinted).toString()}</Text>
      {imageFileUri ? (
        <SvgUri
          width="100%"
          height="100%"
          uri={imageFileUri}
        />
      ) : (
        <Text style={styles.errorText}>Image data not available.</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
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
