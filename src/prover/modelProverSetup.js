import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'
import { NativeModules } from 'react-native'

const { NativeCryptoIdolModule } = NativeModules

export const prepareModelProver = async (setKeys) => {
  const compiledCircuitPath = await FileSystem.downloadAsync(Asset.fromModule(require('../../assets/model/model.ezkl')).uri, `${FileSystem.cacheDirectory}model.ezkl`)
  const srsPath = await FileSystem.downloadAsync(Asset.fromModule(require('../../assets/model/kzg17.srs')).uri, `${FileSystem.cacheDirectory}kzg17.srs`)


  // Prepare input parameter as JSON string with paths
  const inputParam = JSON.stringify({
    compiledCircuit: compiledCircuitPath.uri,
    srs: srsPath.uri,
  })

  // Call setupCircuitForTheModel and handle the promise
  NativeCryptoIdolModule.setupCircuitForTheModel(inputParam)
    .then(result => {
      setKeys(result.provingKeyPath, result.verificationKeyPath)
    })
    .catch(error => {
      console.error('Error in `setupCircuitForTheModel`:', error)
    })
}
