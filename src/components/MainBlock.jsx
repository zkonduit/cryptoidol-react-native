import React, { useState } from 'react'
import { Button, SafeAreaView, Text } from 'react-native'
import ConfettiComponent from './ConfettiComponent'

const MainBlock = () => {
  const [state, setState] = useState('start')

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/*<CustomCanvas state={state} />*/}
      {
        state === 'minted' &&
        <ConfettiComponent />
      }


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
