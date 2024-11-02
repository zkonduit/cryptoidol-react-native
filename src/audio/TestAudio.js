import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'
import preprocessAudioFile from './preprocessAudioFile'
import { runAudioClassifier } from './audioClassifier'

export const testAudioProcessing = async () => {
  const localPath = `${FileSystem.cacheDirectory}angry.wav`
  const testAudioFile = await FileSystem.downloadAsync(Asset.fromModule(require('../../assets/model/sample_audio.wav')).uri, localPath)

  console.log('Testing Audio Processing')

  // Load the audio file
  try {
    let preprocessedDataJson = await preprocessAudioFile(testAudioFile.uri)

    console.log('Preprocessing Result Length:', preprocessedDataJson.length)

    let output = await runAudioClassifier(preprocessedDataJson, 0.08811962604522705)

    console.log('Resulting Score:', Math.round(output * 100) / 100, '/ 1')
  } catch (error) {
    console.error('Error processing audio:', error)
  }

}
