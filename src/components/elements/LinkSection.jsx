import { Linking, Text, View } from 'react-native'
import React from 'react'
import { useGlobalStyles } from '../../styles'

export const LinksSection = () => {
  const globalStyles = useGlobalStyles()
  const isNightMode = globalStyles.isDarkMode

  return (

    <View style={styles.linksContainer}>
      <Text style={[styles.linksHeader, { color: isNightMode ? '#cccccc' : '#555555' }]}>
        Tap below to learn more:
      </Text>
      <View style={styles.linksRow}>
        <Text style={[styles.linkText, { color: isNightMode ? '#aaaaaa' : '#666666' }]}
              onPress={() => Linking.openURL('https://ezkl.xyz/')}>
          ezkl.xyz
        </Text>
        <Text style={styles.divider}>|</Text>
        <Text style={[styles.linkText, { color: isNightMode ? '#aaaaaa' : '#666666' }]}
              onPress={() => Linking.openURL('https://discord.gg/cbNvpsThmd')}>
          Discord
        </Text>
        <Text style={styles.divider}>|</Text>
        <Text style={[styles.linkText, { color: isNightMode ? '#aaaaaa' : '#666666' }]}
              onPress={() => Linking.openURL('https://t.me/+QRzaRvTPIthlYWMx')}>
          Telegram
        </Text>
      </View>
    </View>
  )
}

const styles = {
  linksContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linksHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  divider: {
    marginHorizontal: 8,
    fontSize: 14,
    color: '#888888',
  },
}
