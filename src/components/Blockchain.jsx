import { mainnet, sepolia } from 'viem/chains'
import { createAppKit, defaultWagmiConfig } from '@reown/appkit-wagmi-react-native'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

import Minting from './blockchain/Minting'
import Minted from './blockchain/Minted'

import { WALLETCONNECT_CLOUD_PROJECT_ID } from '@env'

const queryClient = new QueryClient()

const projectId = WALLETCONNECT_CLOUD_PROJECT_ID
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
const chains = [sepolia] // TODO - expand to include arbitrum, polygon, and mainnet
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createAppKit({
  projectId,
  wagmiConfig,
  defaultChain: mainnet,
  enableAnalytics: true,
})

export const Blockchain = ({ onMinted, onRecordAgain, onCancelled, proof }) => {
  const [nftId, setNftId] = React.useState(null)

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>

        {
          nftId ? (<Minted tokenIdMinted={nftId} onRecordAgain={() => {
            setNftId(null)
            onRecordAgain()
          }} />) : <Minting
            onTransactionsComplete={(newNftId) => {
              setNftId(newNftId)
              onMinted()
            }}
            onCancelled={onCancelled}
            proof={proof}
          />
        }

      </QueryClientProvider>
    </WagmiProvider>
  )
}