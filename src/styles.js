// GlobalStyles.js
import { StyleSheet, useColorScheme } from 'react-native'

// Custom hook to get global styles based on color scheme
export const useGlobalStyles = () => {
  const isDarkMode = useColorScheme() === 'dark'

  return StyleSheet.create({
    isDarkMode: isDarkMode,
    userText: {
      color: isDarkMode ? '#FFFFFF' : '#333333',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
    },
    background: {
      backgroundColor: isDarkMode ? '#1c1c1c' : '#FFFFFF',
    },
  })
}
