import React from 'react'
import { Dimensions } from 'react-native'
import ConfettiCannon from 'react-native-confetti-cannon'

const ConfettiComponent = () => {
  const { width } = Dimensions.get('window')

  return (
    <ConfettiCannon
      count={200}
      origin={{ x: width / 2, y: 0 }}
    />
  )
}

export default ConfettiComponent
