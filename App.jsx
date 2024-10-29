import React from 'react'
import MainBlock from './src/components/MainBlock'

import { TextDecoder, TextEncoder } from 'text-encoding'

// Needed to load the VRM model file
global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder

const App = () => {
  return <MainBlock />
}

export default App
