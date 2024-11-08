import React from 'react'
import Main from './src/components/Main'

import { TextDecoder, TextEncoder } from 'text-encoding'

// Needed to load the VRM model file
global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder

const App = () => {
  return <Main />
}

export default App
