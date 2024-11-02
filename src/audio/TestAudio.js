import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'
import preprocessAudioFile from './preprocessAudioFile'
import { preloadedModelSession, runAudioClassifier } from './audioClassifier'
import { generateProverInputJSON, runModelProver } from '../prover/runModelProver'
import { proverAssets } from '../prover/setupModelProver'

function sleepUntilPreloaded(toCheck, maxTimeout = 100000) {
  return new Promise((resolve, reject) => {
    let waited = 0
    const waitTime = 100

    let interval = setInterval(() => {
      waited += waitTime
      if (toCheck) {
        clearInterval(interval)
        resolve()
      }
      if (waited >= maxTimeout) {
        clearInterval(interval)
        reject('Timeout')
      }
    }, waitTime)
  })
}

export const testAudioProcessing = async () => {
  const localPath = `${FileSystem.cacheDirectory}angry.wav`
  const testAudioFile = await FileSystem.downloadAsync(Asset.fromModule(require('../../assets/model/sample_audio.wav')).uri, localPath)
  const blockchainAddress = 0.08811962604522705

  console.log('Testing Audio Processing')


  // Load the audio file
  try {
    let preprocessedData = await preprocessAudioFile(testAudioFile.uri)

    console.log('Preprocessing complete')

    // Before starting, first wait until the model is preloaded
    await sleepUntilPreloaded(preloadedModelSession)
    let score = await runAudioClassifier(preprocessedData, blockchainAddress)

    console.log('Scoring complete. Score:', Math.round(score * 100) / 100, '/ 1')

    let proverInput = generateProverInputJSON(preprocessedData, score, blockchainAddress)

    console.log('Prover Input generated')

    // Before starting, first wait until the prover is set up
    await sleepUntilPreloaded(proverAssets)
    let proof = await runModelProver(proverInput)

    console.log('Proof generated')
    return score
  } catch (error) {
    console.error('Error processing audio:', error)
  }

}
