import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { cryptoIdolABI, cryptoIdolAddresses } from './Transactions'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { encodeFunctionData } from 'viem'

export default function CommittingTransaction({ proofData, onSuccess, onError }) {
  const { dataHash } = proofData
  const contractAddress = cryptoIdolAddresses.sepolia // TODO - Use appropriate address based on chain

  const { data: hash, isLoading, isSuccess, write, error, status, sendTransaction } = useSendTransaction()

  const { isLoading: isTxLoading, isSuccess: isTxSuccess, error: txError } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (error) {
      onError('Commit transaction failed.')
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
      console.debug('Commit transaction sent:', hash)
    }
  }, [isSuccess])

  useEffect(() => {
    if (isTxSuccess) {
      console.debug('Commit transaction confirmed:', hash)
      onSuccess()
    }
  }, [isTxSuccess])

  // Initiate the transaction when the component mounts
  useEffect(() => {
    if (write) {
      write()
    }
  }, [write])

  useEffect(() => {
    console.debug('Sending commit transaction...', hash)
  }, [hash])

  useEffect(() => {
    sendTransaction({
      to: contractAddress,
      data: encodeFunctionData({
        abi: cryptoIdolABI,
        functionName: 'commitResult',
        args: [dataHash],
      }),
    })
  }, [dataHash, contractAddress])

  return (
    <View style={styles.container}>
      <Text> {status}</Text>
      <Text style={styles.title}>Commit Transaction</Text>
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
