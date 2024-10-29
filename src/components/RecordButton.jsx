import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, TouchableOpacity } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const RED_COLOR = `#FF214D`
const GREEN_COLOR = `#359008`

export const RecordButton = ({ recordState = 'start', onPress }) => {
  const outerCircleScale = useRef(new Animated.Value(1)).current
  const innerCircleScale = useRef(new Animated.Value(1)).current
  const outerCircleOpacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (recordState === 'start') {
      animateCircles(1.3, 1.0, 0.5)
    } else if (recordState === 'inprogress') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(outerCircleScale, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(outerCircleScale, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else if (recordState === 'end') {
      animateCircles(1, 0, 0) // Hide outer circle
    }
  }, [recordState])

  const animateCircles = (outerScale, innerScale, opacity) => {
    Animated.timing(outerCircleScale, {
      toValue: outerScale,
      duration: 300,
      useNativeDriver: true,
    }).start()
    Animated.timing(innerCircleScale, {
      toValue: innerScale,
      duration: 300,
      useNativeDriver: true,
    }).start()
    Animated.timing(outerCircleOpacity, {
      toValue: opacity,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {recordState !== 'end' ? (
        <>
          <Animated.View
            style={[
              styles.outerCircle,
              {
                transform: [{ scale: outerCircleScale }],
                opacity: outerCircleOpacity,
                backgroundColor: RED_COLOR,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.innerCircle,
              {
                transform: [{ scale: innerCircleScale }],
                backgroundColor: RED_COLOR,
              },
            ]}
          />
        </>
      ) : (
        <Svg width="75" height="75" viewBox="0 0 75 75" fill="none">
          <Path
            d="M60 27.3397C66.6667 31.1887 66.6667 40.8113 60 44.6603L15 70.641C8.33333 74.49 -3.65772e-06 69.6788 -3.32122e-06 61.9808L-1.04991e-06 10.0192C-7.13424e-07 2.32124 8.33333 -2.49002 15 1.35898L60 27.3397Z"
            fill={GREEN_COLOR}
          />
        </Svg>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: 75,
    margin: 8,
  },
  outerCircle: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 9999,
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
})
