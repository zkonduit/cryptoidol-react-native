import * as ort from 'onnxruntime-react-native'
import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'

// Function to prepare the model and run inference
export async function runAudioClassifier(processedMelSpectrogram) {

  const flattenedData = processedMelSpectrogram.map(row => Array.from(row)).reduce((acc, row) => acc.concat(row), [])

  // Check if the flattened data has the correct length
  if (flattenedData.length !== 128 * 130) {
    throw new Error(`Flattened data length (${flattenedData.length}) does not match expected length (16,640).`)
  }

  // Convert to Float32Array for the ONNX model
  const inputData = new Float32Array(flattenedData)

  const localPath = `${FileSystem.cacheDirectory}network.onnx`
  const { uri } = await FileSystem.downloadAsync(Asset.fromModule(require('../../assets/model/network.onnx')).uri, localPath)

  // TODO - consider preloading the model
  const session = await ort.InferenceSession.create(uri)

  // Run inference and get results
  try {
    return await runInference(session, inputData)
  } catch (error) {
    console.error('Error running Audio Classifier:', error)
  }
}

// Function to run inference
async function runInference(session, inputData) {
  const start = new Date()

  // Ensure the tensor has the shape [1, 1, 128, 130]
  const feeds = {
    'input': new ort.Tensor('float32', inputData, [1, 1, 128, 130]),
  }

  try {
    const outputData = await session.run(feeds)
    const end = new Date()
    const inferenceTime = (end.getTime() - start.getTime()) / 1000

    console.debug('Inference time:', inferenceTime, 'seconds')
    console.debug('Output:', outputData)

    // Return the output value
    return Number(outputData.output.cpuData['0'])

  } catch (error) {
    console.error('Error during inference:', error)
    return null
  }
}
