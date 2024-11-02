import React
import EzklPackage // Replace with the actual name of your SPM library

@objc(NativeCryptoIdolModule)
class NativeCryptoIdolModule: NSObject {

  @objc
  func setupCircuitForTheModel(_ param: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInitiated).async {
      do {
        // Parse JSON parameter to get paths
        guard let paths = try JSONSerialization.jsonObject(with: param.data(using: .utf8)!, options: []) as? [String: String],
              var compiledCircuitPath = paths["compiledCircuit"],
              var srsPath = paths["srs"] else {
          throw NSError(domain: "InvalidParameterError", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid paths in input parameter."])
        }

        // Remove "file://" prefix if present
        if compiledCircuitPath.hasPrefix("file://") {
          compiledCircuitPath = String(compiledCircuitPath.dropFirst(7))
        }
        if srsPath.hasPrefix("file://") {
          srsPath = String(srsPath.dropFirst(7))
        }

        // Read compiledCircuit and srs files as binary data
        let compiledCircuitData = try Data(contentsOf: URL(fileURLWithPath: compiledCircuitPath))
        let srsData = try Data(contentsOf: URL(fileURLWithPath: srsPath))

        // Convert data to base64 encoded strings
        let compiledCircuitBase64 = compiledCircuitData.base64EncodedString()
        let srsBase64 = srsData.base64EncodedString()



        // Generate vk and pk using the functions in EzklPackage
        let vk = try EzklPackage.genVk(compiledCircuit: compiledCircuitData, srs: srsData, compressSelectors: false)
        let pk = try EzklPackage.genPk(vk: vk, compiledCircuit: compiledCircuitData, srs: srsData)

        // Save vk and pk to local files
        let vkPath = FileManager.default.temporaryDirectory.appendingPathComponent("vk.key")
        let pkPath = FileManager.default.temporaryDirectory.appendingPathComponent("pk.key")

        try vk.write(to: vkPath)
        try pk.write(to: pkPath)

        // Prepare result dictionary to send back file paths to JavaScript
        let result: [String: String] = [
          "vkPath": vkPath.path,
          "pkPath": pkPath.path
        ]

        // Return to the main thread and resolve with file paths
        DispatchQueue.main.async {
          resolver(result)
        }
      } catch {
        // Handle any errors and reject promise with full error description
        DispatchQueue.main.async {
          let errorMessage = "Error during setupCircuitForTheModel computation: \(error.localizedDescription)"
          rejecter("E_COMPUTATION_ERROR", errorMessage, error)
        }
      }
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
