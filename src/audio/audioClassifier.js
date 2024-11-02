import * as ort from 'onnxruntime-react-native'
import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'

// Function to prepare the model and run inference
export async function runAudioClassifier(processedMelSpectrogram) {

  const localPath = `${FileSystem.cacheDirectory}network.onnx`
  const { uri } = await FileSystem.downloadAsync(Asset.fromModule(require('../../assets/model/network.onnx')).uri, localPath)

  const session = await ort.InferenceSession.create(uri)

  // We hardcode the blockchain address for first mock run of the model
  const blockchainAddress = 0.08811962604522705

  // Run inference and get results
  try {
    return await runInference(session, processedMelSpectrogram, blockchainAddress)
  } catch (error) {
    console.error('Error running Audio Classifier:', error)
  }
}

// Function to run inference
async function runInference(session, inputData, blockchainAddress) {
  const start = new Date()

  // Flatten the 2D array and convert it to Float32Array
  const flattenedData = inputData.map(row => Array.from(row)).reduce((acc, row) => acc.concat(row), [])

  // Check if the flattened data has the correct length
  if (flattenedData.length !== 128 * 130) {
    throw new Error(`Flattened data length (${flattenedData.length}) does not match expected length (16,640).`)
  }

  inputData = new Float32Array(flattenedData)

  // Convert blockchainAddress to an input tensor
  const blockchainAddressTensor = new ort.Tensor('float32', new Float32Array([blockchainAddress]), [1, 1])

  // Set up the model inputs
  const feeds = {
    'input': blockchainAddressTensor,                       // blockchainAddress input
    'input.1': new ort.Tensor('float32', inputData, [1, 1, 128, 130]), // audio data input
  }

  try {
    const outputData = await session.run(feeds)
    const end = new Date()
    const inferenceTime = (end.getTime() - start.getTime()) / 1000

    console.debug('Inference time:', inferenceTime, 'seconds')

    // Consistency check for blockchainAddress
    const outputBlockchainAddress = outputData['output'].data[0]
    if (outputBlockchainAddress !== blockchainAddress) {
      throw new Error(`Blockchain address mismatch: expected ${blockchainAddress}, but got ${outputBlockchainAddress}`)
    }

    // Extract the prediction output
    const prediction = outputData['10'].data[0]
    return Number(prediction)

  } catch (error) {
    console.error('Error during inference:', error)
    return null
  }
}
