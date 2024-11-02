import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'
import { NativeModules } from 'react-native'

const { NativeModelProver } = NativeModules

export let proverAssets = null

export const setupModelProver = async () => {
  const start = new Date()

  const compiledCircuitPath = await FileSystem.downloadAsync(Asset.fromModule(require('../../assets/model/model.ezkl')).uri, `${FileSystem.cacheDirectory}model.ezkl`)
  const srsPath = await FileSystem.downloadAsync(Asset.fromModule(require('../../assets/model/kzg17.srs')).uri, `${FileSystem.cacheDirectory}kzg17.srs`)


  // Prepare input parameter as JSON string with paths
  const inputParam = JSON.stringify({
    compiledCircuit: compiledCircuitPath.uri,
    srs: srsPath.uri,
  })

  // Call setupCircuitForTheModel and handle the promise
  NativeModelProver.setupKeys(inputParam)
    .then(result => {
      proverAssets = {
        pkPath: result.pkPath,
        vkPath: result.vkPath,
        srsPath: srsPath.uri,
        compiledCircuitPath: compiledCircuitPath.uri,
      }
      console.debug('Model Prover setup successful')
      console.debug('Prover Setup time:', (new Date().getTime() - start.getTime()) / 1000, 'seconds')
    })
    .catch(error => {
      console.error('Error in `setupCircuitForTheModel`:', error)
    })
}
