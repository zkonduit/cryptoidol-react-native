import Transactions from './blockchain/Transactions'
import { arbitrum, mainnet, polygon, sepolia } from 'viem/chains'
import { createAppKit, defaultWagmiConfig } from '@reown/appkit-wagmi-react-native'

import { WALLETCONNECT_CLOUD_PROJECT_ID } from '@env'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

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
const chains = [mainnet, polygon, arbitrum, sepolia]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createAppKit({
  projectId,
  wagmiConfig,
  defaultChain: mainnet,
  enableAnalytics: true,
})

export const Minting = ({ onTransactionComplete, onCancelled, proof }) => { // Add new parameters here
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Transactions
          onTransactionComplete={onTransactionComplete}
          onCancelled={onCancelled}
          proof={proof}
        />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
