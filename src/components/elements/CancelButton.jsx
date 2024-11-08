import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

const CancelButton = ({ onCancel, styleOverwrite = [], textStyleOverwrite = [] }) => {
  return (
    <TouchableOpacity style={[styles.cancelButton, styleOverwrite]} onPress={onCancel}>
      <Text style={[styles.buttonText, textStyleOverwrite]}>CANCEL</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cancelButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})

export default CancelButton
