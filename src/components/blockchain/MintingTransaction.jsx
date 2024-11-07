import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useContractWrite, useWaitForTransactionReceipt } from 'wagmi'
import { cryptoIdolABI, cryptoIdolAddresses } from './Transactions'
import { encodeFunctionData } from 'viem'

export default function MintingTransaction({ proofData, onSuccess, onError }) {
  const { hexProof, instances } = proofData
  const contractAddress = cryptoIdolAddresses.sepolia // Use appropriate address based on chain

  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    to: contractAddress,
    data: encodeFunctionData({
      abi: cryptoIdolABI,
      functionName: 'mint',
      args: [hexProof, instances],
    }),
  })

  const { isLoading: isTxLoading, isSuccess: isTxSuccess, error: txError } = useWaitForTransactionReceipt({
    hash: data?.hash,
  })

  useEffect(() => {
    if (error) {
      onError('Mint transaction failed.')
    }
  }, [error])

  useEffect(() => {
    if (txError) {
      onError('Transaction failed or was rejected.')
    }
  }, [txError])

  useEffect(() => {
    if (isSuccess) {
      // Transaction sent, wait for confirmation
    }
  }, [isSuccess])

  useEffect(() => {
    if (isTxSuccess) {
      onSuccess()
    }
  }, [isTxSuccess])

  // Initiate the transaction when the component mounts
  useEffect(() => {
    if (write) {
      write()
    }
  }, [write])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mint Transaction</Text>
      {isLoading && <Text>Waiting for user approval...</Text>}
      {isTxLoading && <Text>Transaction is being confirmed...</Text>}
      {error && <Text style={styles.errorText}>{error.message}</Text>}
      {txError && <Text style={styles.errorText}>{txError.message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
})
