import React, { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

const RotatingSentences = ({ sentences }) => {
  const [currentSentence, setCurrentSentence] = useState(0)
  const fadeAnim = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    // Cycle through sentences every 4 seconds
    const timer = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentSentence((prev) => (prev + 1) % sentences.length)
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start()
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [fadeAnim, scaleAnim, sentences.length])

  return (
    <View style={styles.textContainer}>
      <Animated.Text
        style={[
          styles.sentenceText,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {sentences[currentSentence]}
      </Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
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

export default RotatingSentences
