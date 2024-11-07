import '@walletconnect/react-native-compat'
import { useAccount, useReadContract, useSendTransaction, useWaitForTransactionReceipt, WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, polygon, sepolia } from '@wagmi/core/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppKit, AppKitButton, createAppKit, defaultWagmiConfig, useAppKit } from '@reown/appkit-wagmi-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Animated, Button, StyleSheet, Text, View } from 'react-native'
import { WALLETCONNECT_CLOUD_PROJECT_ID } from '@env'
import { testWorkflow } from '../util/TestSystem'
import { bigEndianToLittleEndian } from '../util/bigEndianToLittleEndian'
import { encodeAbiParameters, encodeFunctionData, keccak256 } from 'viem'

const cryptoIdolAddresses = require('../../assets/blockchain/addresses.json')
const cryptoIdolABI = require('../../assets/blockchain/abi.json')

// Query client for data caching
const queryClient = new QueryClient()
const projectId = WALLETCONNECT_CLOUD_PROJECT_ID

// Metadata configuration for WalletConnect
const metadata = {
  name: 'Crypto Idol',
  description: 'Prove the world how well you can sing!',
  url: 'https://ezkl.xyz/',
  icons: ['https://cryptoidol.tech/icons/favicon-32x32.png'],
  redirect: {
    native: 'cryptoidol://',
    // universal: 'YOUR_APP_UNIVERSAL_LINK.com', // TODO - add universal link to cryptoidol.tech domain
  },
}

const chains = [mainnet, polygon, arbitrum, sepolia]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createAppKit({
  projectId,
  wagmiConfig,
  defaultChain: mainnet,
  enableAnalytics: true,
})

const sentencesStages = {
  committing: [
    'Publishing your proof to the blockchain... 🌐',
    'Waiting for network confirmation... ⏳',
  ],
  minting: [
    'Initiating NFT minting... 🎨',
    'Finalizing mint on blockchain... ✅',
  ],
}

const BlockchainTransaction = ({ proof, onTransactionComplete }) => {
  const [currentSentence, setCurrentSentence] = useState(0)
  const [stage, setStage] = useState('connecting')
  const fadeAnim = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const [tmpProof, setTmpProof] = useState(null)
  const [hexProof, setHexProof] = useState(null)
  const [instances, setInstances] = useState(null)
  const [dataHash, setDataHash] = useState(null)

  const [tokenIdMinted, setTokenIdMinted] = useState(null)
  const [commitTxId, setCommitTxId] = useState(null)
  const [mintTxId, setMintTxId] = useState(null)
  const [commitConfig, setCommitConfig] = useState(null)
  const [mintConfig, setMintConfig] = useState(null)
  const [committed, setCommitted] = useState(false)

  // Wallet and transaction hooks
  const { address, isConnected, chain } = useAccount()
  const {
    sendTransaction, isPending, data: hash, error: sendTxError,
  } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: waitForTxError } =
    useWaitForTransactionReceipt({
      hash,
    })
  const { open } = useAppKit()

  const tokenMetadata = useReadContract({
    address: chain?.id === 11155111 ? cryptoIdolAddresses.sepolia : cryptoIdolAddresses.base, // TODO - we still need to add base
    abi: cryptoIdolABI,
    functionName: 'tokenURI',
    args: [tokenIdMinted],
  })

  let imageData
  if (tokenMetadata.data) {
    const data = tokenMetadata?.data
    const jsonData = data.split(',')[1]
    const decodedJson = atob(jsonData)
    const jsonObject = JSON.parse(decodedJson)
    imageData = jsonObject.image
  }

  const preprocessProof = async () => {

    let proof
    if (!tmpProof) {
      proof = await testWorkflow()
      setTmpProof(proof)
    } else {
      proof = tmpProof
    }

    const json_proof = JSON.parse(proof)

    // Ensure hexProof is a valid hex string
    const hexProof = json_proof['hex_proof']

    // Convert each element in instances to BigInt for proper ABI encoding
    const instances = json_proof['instances'].map(pair =>
      pair.map(value => BigInt(`0x${bigEndianToLittleEndian(value)}`)),
    )

    const dataHash = keccak256(
      encodeAbiParameters(
        [{ type: 'bytes' }, { type: 'uint256[]' }],
        [
          hexProof,
          instances.flat(),
        ],
      ),
    )

    return { hexProof, instances, dataHash }
  }


  const startProcess = async () => {

    if (isConnected && address) {
      try {
        const { hexProof, instances, dataHash } = await preprocessProof()

        console.debug('Finished preprocessing proof')

        // Step 1: Send the transaction
        const transaction = await sendTransaction({
          to: chain?.id === 11155111 ? cryptoIdolAddresses.sepolia : cryptoIdolAddresses.base,
          data: encodeFunctionData({
            abi: cryptoIdolABI,
            functionName: 'commitResult',
            args: [dataHash],
          }),
        })

        console.debug('Transaction sent. Awaiting user approval...')

        // Step 2: Wait for transaction confirmation
        // try {
        //   console.log('Waiting for transaction confirmation...', hash)
        //   const result = await waitForTransaction({
        //     hash: hash, // Use the transaction hash to track confirmation
        //   })
        //
        //   console.debug('Value committed to blockchain')
        //   console.debug(result)
        // } catch (error) {
        //   console.error('Transaction failed or was rejected:', error)
        //   // Provide feedback to the user or retry logic as needed
        // }
        //
        // await sendTransaction({
        //     address: chain?.id === 11155111 ? cryptoIdolAddresses.sepolia : cryptoIdolAddresses.base,
        //     data: encodeFunctionData({
        //       abi: cryptoIdolABI,
        //       functionName: 'mint',
        //       args: [hexProof, instances],
        //     }),
        //     // value: parseEther('0.01'), // TODO - consider adding a value to mint
        //   },
        // )
        //
        // console.debug('Minting transaction sent to blockchain')
      } catch (error) {
        setError('Sending transactions failed.')
        Alert.alert('Error', error.toString(), [{ text: 'OK' }])
      }


    } else {
      open()
    }
  }


  useEffect(() => {
    const timer = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 500, useNativeDriver: true }),
      ]).start(() => {
        setCurrentSentence((prev) => (prev + 1) % sentencesStages['committing'].length)
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]).start()
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [stage])

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.sentenceText,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {sentencesStages['committing'][currentSentence]}
        </Animated.Text>
      </View>
      <AppKitButton balance={'show'} />
      <AppKit />
      <Button onPress={startProcess} title={'Start Process'}>
      </Button>
      {waitForTxError && <Text>{waitForTxError}</Text>}
      {sendTxError && <Text>{sendTxError}</Text>}
      {isConfirming && <Text>Waiting for confirmation...</Text>}
      {isConfirmed && <Text>Transaction confirmed.</Text>}
      {isPending ? <Text>'Confirming...'</Text> : <Text>'Send'</Text>}
      {
        !isConnected && <Text> Disconnected</Text>
      }
      {
        address && <Text> Address: {address}</Text>
      }
    </View>
  )
}

export default function Minting({ proof }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BlockchainTransaction proof={proof} onTransactionComplete={() => console.log('Transaction complete')} />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  textContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  sentenceText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
})
