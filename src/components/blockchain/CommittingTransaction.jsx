import React, { useEffect } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { cryptoIdolABI, cryptoIdolAddresses, transactionsStyles } from './TransactionPanel'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { encodeFunctionData } from 'viem'

export default function CommittingTransaction({ proofData, onSuccess, onError }) {
  const { dataHash } = proofData
  const contractAddress = cryptoIdolAddresses.sepolia // TODO - Use appropriate address based on chain

  const { data: hash, isSuccess, error, sendTransaction } = useSendTransaction()

  const { isLoading: isTxLoading, isSuccess: isTxSuccess, error: txError } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (error) {
      onError('Commit transaction failed.\n' + error.message)
    }
  }, [error, onError])

  useEffect(() => {
    if (txError) {
      onError('Commit transaction failed or was rejected.\n' + txError.message)
    }
  }, [onError, txError])

  useEffect(() => {
    if (isSuccess) {
      // Transaction sent, wait for confirmation
      console.debug('Commit transaction sent:', hash)
    }
  }, [hash, isSuccess])

  useEffect(() => {
    if (isTxSuccess) {
      console.debug('Commit transaction confirmed:', hash)
      onSuccess()
    }
  }, [hash, isTxSuccess, onSuccess])

  useEffect(() => {
    sendTransaction({
      to: contractAddress,
      data: encodeFunctionData({
        abi: cryptoIdolABI,
        functionName: 'commitResult',
        args: [dataHash],
      }),
    })
  }, [dataHash, contractAddress, sendTransaction])

  return (
    <View style={transactionsStyles.container}>
      {/* Transaction Status Title */}
      <Text style={transactionsStyles.title}>Issuing "Commit" Transaction</Text>

      {/* Description */}
      <Text style={transactionsStyles.description}>
        This transaction locks in your spot to prevent others from frontrunning you and ensures that your NFT can be
        minted securely.
      </Text>

      {/* Loading Indicators */}
      {!isSuccess && (
        <View style={transactionsStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={transactionsStyles.loadingText}>Waiting for user approval...</Text>
        </View>
      )}

      {isTxLoading && (
        <View style={transactionsStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={[transactionsStyles.loadingText, { color: '#4CAF50' }]}>Transaction is being confirmed...</Text>
        </View>
      )}
    </View>
  )
}

