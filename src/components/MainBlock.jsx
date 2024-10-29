import React, { useState } from 'react'
import { Button, SafeAreaView, Text } from 'react-native'
import ConfettiComponent from './ConfetiComponent'

const MainBlock = () => {
  const [state, setState] = useState('start')

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Canvas
        onCreated={(state) => {
          const renderer = state.gl
          renderer.setClearColor('rgb(248,225,225)', 0.1)

          renderer.extensions.get('EXT_color_buffer_float')

          // TODO - a fix from https://github.com/expo/expo-three/issues/196#issuecomment-1334807693

          const _gl = state.gl.getContext()
          const pixelStorei = _gl.pixelStorei.bind(_gl)
          _gl.pixelStorei = function(...args) {
            const [parameter] = args
            switch (parameter) {
              case _gl.UNPACK_FLIP_Y_WEBGL:
                return pixelStorei(...args)
            }
          }
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[0, 5, 5]} intensity={1.2} />
      {/*<CustomCanvas state={state} />*/}


      {state === 'start' ? (
        <>
          <Text style={{ textAlign: 'center' }}>
            Not Minted Yet
          </Text>

          <Button
            title="Start Minting!"
            onPress={() => {
              setState('minting')
              // Time out for 10 seconds
              setTimeout(() => {
                setState('minted')
              }, 1000)
            }}
          />
        </>
      ) : state === 'minting' ? (
        <Text>Minting...</Text>
      ) : (
        <>
          <Text>Minted!</Text>
          <Button title={'Mint Again'} onPress={() => setState('start')} />
        </>
      )}
    </SafeAreaView>
  )
}

export default MainBlock
