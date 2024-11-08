import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SvgUri } from 'react-native-svg'

const Minted = ({ nft, onRecordAgain }) => {
  return (
    <>
      {/* Success message */}
      <View style={styles.container}>
        <Text style={styles.title}>NFT #{BigInt(nft.id).toString()}</Text>
        {nft.uri ? (
          <SvgUri
            width="100%"
            height="100%"
            uri={nft.uri}
          />
        ) : (
          <Text style={styles.errorText}>Image data not available.</Text>
        )}
      </View>
      <View style={styles.finishedContainer}>
        <Text style={styles.finishedText}>NFT successfully minted! 🎉</Text>

        {/* Share button */}
        <TouchableOpacity style={styles.button} onPress={onRecordAgain}>
          <Text style={styles.buttonText}>Record Again</Text>
        </TouchableOpacity>
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  finishedContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  finishedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38a169', // Dark green color for success message
    marginBottom: 15,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#4A90E2', // Blue button background for visibility
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
  },
  buttonText: {
    fontSize: 16, // Adjust the size for readability
    color: '#fff', // White text color for better contrast
    fontWeight: 'bold',
  },
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
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
})

export default Minted
