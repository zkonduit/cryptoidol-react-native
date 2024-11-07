import '@walletconnect/react-native-compat'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, polygon, sepolia } from '@wagmi/core/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppKit, AppKitButton, createAppKit, defaultWagmiConfig } from '@reown/appkit-wagmi-react-native'
import React from 'react'
import { Text } from 'react-native'
import { WALLETCONNECT_CLOUD_PROJECT_ID } from '@env'


// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId at https://cloud.reown.com
const projectId = WALLETCONNECT_CLOUD_PROJECT_ID

// 2. Create config
const metadata = {
  name: 'AppKit RN',
  description: 'AppKit RN Example',
  url: 'https://reown.com/appkit',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
}

const chains = [mainnet, polygon, arbitrum, sepolia]

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createAppKit({
  projectId,
  wagmiConfig,
  defaultChain: mainnet, // Optional
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
})

export default function Minting() {
  console.log('Project ID:', projectId)
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <>
          <Text> ...rest of your view</Text>
          <AppKitButton />
        </>
        <AppKit />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
