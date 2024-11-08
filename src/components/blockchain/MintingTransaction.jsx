import React, { useEffect } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { cryptoIdolABI, cryptoIdolAddresses, transactionsStyles } from './TransactionPanel'
import { encodeFunctionData, parseEther } from 'viem'

export default function MintingTransaction({ proofData, onSuccess, onError }) {
  const { hexProof, instances } = proofData
  const contractAddress = cryptoIdolAddresses.sepolia // Use appropriate address based on chain

  const { data: hash, isSuccess, error, sendTransaction } = useSendTransaction()

  const { isLoading: isTxLoading, isSuccess: isTxSuccess, error: txError, data } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (error) {
      onError('Mint transaction failed.\n' + error.message)
    }
  }, [error, onError])

  useEffect(() => {
    if (txError) {
      onError('Mint transaction failed or was rejected.\n' + txError.message)
    }
  }, [onError, txError])

  useEffect(() => {
    if (isSuccess) {
      // Transaction sent, wait for confirmation
      console.debug('Mint transaction sent:', hash)
    }
  }, [hash, isSuccess])

  useEffect(() => {
    if (isTxSuccess) {
      console.debug('Mint transaction confirmed:', hash)
      const tokenId = data?.logs[0].topics[3]
      console.debug('Minted NFT with ID:', tokenId)
      onSuccess(tokenId)
    }
  }, [hash, isTxSuccess, onSuccess])

  useEffect(() => {
    sendTransaction({
      to: contractAddress,
      value: parseEther('0'),
      data: encodeFunctionData({
        abi: cryptoIdolABI,
        functionName: 'mint',
        args: [hexProof, instances.flat()],
      }),
    })
  }, [hexProof, instances, contractAddress, sendTransaction])

  return (
    <View style={transactionsStyles.container}>
      {/* Title */}
      <Text style={transactionsStyles.title}>Mint Transaction</Text>

      {/* Description */}
      <Text style={transactionsStyles.description}>
        You’re about to mint your unique NFT, marking your achievement permanently on the blockchain. Please confirm the
        transaction in your wallet.
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

