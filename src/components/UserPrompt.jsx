import React from 'react'
import { StyleSheet, Text } from 'react-native'

const UserPrompt = ({ state, recording, isDarkMode }) => {
  const textColor = isDarkMode ? '#FFFFFF' : '#000000'

  let promptText
  if (state === 'start') {
    promptText = 'Think you can be the next Crypto Idol?'
  } else if (state === 'inprogress' && recording) {
    promptText = 'Sing now! Press Stop when you\'re done️'
  } else if (state === 'end' && !recording) {
    promptText = 'Will the AI like you? Get judged 🤔️'
  } else if (state === 'inprogress' && !recording) {
    promptText = 'Here\'s what you\'ve sung ❤️'
  }

  return <Text style={[styles.headerText, { color: textColor }]}>{promptText}</Text>
}

export default UserPrompt

const styles = StyleSheet.create({
  headerText: {
    marginVertical: 8,
    marginHorizontal: 16,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
