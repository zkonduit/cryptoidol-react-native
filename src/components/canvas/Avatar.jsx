import React, { useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'
import * as THREE from 'three'
import { LinearFilter, LinearMipMapNearestFilter, MeshStandardMaterial, TextureLoader } from 'three'
import { Asset } from 'expo-asset'
import { GLTFLoader } from 'three-stdlib'
import * as FileSystem from 'expo-file-system'
import { SRGBColorSpace } from 'three/src/constants'
import { loadMixamoAnimation } from './LoadMixamoAnimation'

const PREFIX = '../../../assets/3D/animations/'

const loader = new GLTFLoader()
loader.register((parser) => {
  return new VRMLoaderPlugin(parser)
})

export default function Avatar({ avatarState = 'start', onLoadedAvatar, ...props }) {


  const [vrm, setVrm] = useState(null)
  const [gltf, setGltf] = useState(null)
  const [animationUrl, setAnimationUrl] = useState('')
  const [mixer, setMixer] = useState(null)
  const [lookAtTarget, setLookAtTarget] = useState(null)
  const [previousBlink, setPreviousBlink] = useState(0)
  const [previousHappy, setPreviousHappy] = useState(0)
  const { camera } = useThree() // Access the default camera from the canvas
  const radius = 7 // Radius for the circular motion
  // animation states
  const [blink, setBlink] = useState(false)
  const [happy, setHappy] = useState(false)

  const [bodyMaterial, setBodyMaterial] = useState()
  const [hatMaterial, setHatMaterial] = useState()

  useEffect(() => {
    console.debug('Loading model...')
    const loadModel = async () => {
      try {
        const localPath = `${FileSystem.cacheDirectory}smaller.vrm`
        const { uri } = await FileSystem.downloadAsync(Asset.fromModule(require('../../../assets/3D/smaller.vrm')).uri, localPath)

        loader.load(
          uri,
          (gltf) => {
            setGltf(gltf)
            const vrm = gltf.userData.vrm

            // Disable frustum culling
            vrm.scene.traverse((obj) => {
              obj.frustumCulled = false
            })

            setLookAtTarget(new THREE.Object3D)
            vrm.lookAt.target = lookAtTarget


            // create animation mixer
            setMixer(new THREE.AnimationMixer(gltf.scene))

            VRMUtils.removeUnnecessaryVertices(gltf.scene)
            VRMUtils.removeUnnecessaryJoints(gltf.scene)

            vrm.scene.traverse((obj) => {
              obj.frustumCulled = false
            })


            vrm.scene.traverse((obj) => {
              if (obj.isMesh) {
                // If the object material is `'Material.001'` then update it with the new body material
                if (obj.material && obj.material.name === 'Material.001') {
                  setBodyMaterial(obj.material)
                  obj.material = new MeshStandardMaterial(
                    {
                      name: 'Material.001',
                      color: new THREE.Color('hotpink'), // Initial pink color
                      metalness: 1,
                      roughness: 0.5,
                    },
                  )
                }

                // If the object material is `'Material.002'` then update it with the new hat material
                if (obj.material && obj.material.name === 'Material.002') {
                  setHatMaterial(obj.material)
                  obj.material = new MeshStandardMaterial(
                    {
                      name: 'Material.002',
                      color: new THREE.Color('hotpink'), // Initial pink color
                      metalness: 1,
                      roughness: 0.5,
                    },
                  )

                }
              }
            })

            setVrm(vrm)
          },
          (progress) => {
            console.debug('Loading model...', (100.0 * progress.loaded) / progress.total, '%')
          },
          (error) => {
            console.error('Error loading model:', error) // Log the full error
          },
        )
      } catch (err) {
        console.error('Error during model loading process:', err)
      }
    }

    loadModel()
  }, [])

  useEffect(() => {


    const localBodyPath = `${FileSystem.cacheDirectory}texture_body.png` // Local storage path for the image
    const localHatPath = `${FileSystem.cacheDirectory}texture_hat.png` // Local storage path for the image
    const textureLoader = new TextureLoader()

    const loadBodyTexture = async () => {
      try {
        // Download the image to the local filesystem
        const { uri } = await FileSystem.downloadAsync(Asset.fromModule(require('../../../assets/3D/body.png')).uri, localBodyPath)
        // Load the texture from the local file URI
        textureLoader.load(
          uri,
          (texture) => {
            texture.flipY = false
            texture.minFilter = LinearMipMapNearestFilter
            texture.magFilter = LinearFilter
            texture.wrapT = 1000
            texture.wrapS = 1000
            texture.colorSpace = SRGBColorSpace
            let clond = bodyMaterial.clone()
            clond.map = texture
            clond.name = 'Material_Updated.001'
            texture.needsUpdate = true
            setBodyMaterial(clond)

          },
          undefined,
          (error) => {
            console.error('An error happened while loading the texture:', error)
          },
        )
      } catch (error) {
        console.error('Error downloading image:', error)
      }
    }
    const loadHatTexture = async () => {
      try {
        // Download the image to the local filesystem
        const { uri } = await FileSystem.downloadAsync(Asset.fromModule(require('../../../assets/3D/hat.png')).uri, localHatPath)

        // Load the texture from the local file URI
        textureLoader.load(
          uri,
          (texture) => {
            texture.flipY = false
            texture.minFilter = LinearMipMapNearestFilter
            texture.magFilter = LinearFilter
            texture.wrapT = 1000
            texture.wrapS = 1000
            texture.colorSpace = SRGBColorSpace
            let clond = hatMaterial.clone()
            clond.map = texture
            clond.name = 'Material_Updated.002'
            texture.needsUpdate = true
            setHatMaterial(clond)

          },
          undefined,
          (error) => {
            console.error('An error happened while loading the texture:', error)
          },
        )
      } catch (error) {
        console.error('Error downloading image:', error)
      }
    }

    const updateMaterials = () => {
      try {
        console.debug('Updating materials...')

        // Traverse through all materials and adjust properties
        vrm.scene.traverse((obj) => {
          if (obj.isMesh) {
            // If the object material is `'Material.001'` then update it with the new body material
            if (obj.material && obj.material.name === 'Material.001') {
              obj.material = bodyMaterial
              obj.needsUpdate = true

            }

            // If the object material is `'Material.002'` then update it with the new hat material
            if (obj.material && obj.material.name === 'Material.002') {
              obj.material = hatMaterial
              obj.needsUpdate = true

            }
          }
        })
      } catch (error) {
        console.error('Error updating materials:', error)
      }
    }

    if (bodyMaterial && bodyMaterial.name === 'Material.001' && hatMaterial && hatMaterial.name === 'Material.002') {
      loadBodyTexture()
    }

    if (hatMaterial && hatMaterial.name === 'Material.002' && bodyMaterial && bodyMaterial.name === 'Material.001') {
      loadHatTexture()
    }

    if (bodyMaterial && hatMaterial && bodyMaterial.name === 'Material_Updated.001' && hatMaterial.name === 'Material_Updated.002') {
      updateMaterials()
      console.debug('Avatar setup complete')
      onLoadedAvatar()
    }
  }, [bodyMaterial, hatMaterial])

  // animation handler
  useEffect(() => {
    if (vrm && mixer && animationUrl) {
      console.debug('Updating animation to:', animationUrl)
      mixer.stopAllAction()
      loadMixamoAnimation(animationUrl, vrm)
        .then((clip) => {
          mixer.clipAction(clip).play()
          mixer.timeScale = 1.0
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [vrm, mixer, animationUrl])

  // handle periodic events
  useFrame(({ clock }, delta) => {
    if (vrm && mixer) {
      // blink every ~5 seconds
      if (clock.elapsedTime > previousBlink) {
        setBlink(true)
        setPreviousBlink(clock.elapsedTime + 5)
      }

      if (clock.elapsedTime > previousHappy) {
        setHappy(true)
        setPreviousHappy(clock.elapsedTime + 13)
      }

      // animation sequence start
      if (avatarState === 'start') {
        setAnimationUrl('Button Pushing.fbx')
      }

      if (avatarState === 'inprogress') {
        setAnimationUrl('Chicken Dance.fbx')
      }

      if (avatarState === 'end') {
        setAnimationUrl('Thinking.fbx')
      }

      if (avatarState === 'processing') {
        setAnimationUrl('Gangnam Style.fbx')
      }

      if (avatarState === 'result') {
        setAnimationUrl('Thankful.fbx')
      }

      if (avatarState === 'committing') {
        setAnimationUrl('Gangnam Style.fbx')
      }

      if (avatarState === 'mint') {
        setAnimationUrl('Button Pushing.fbx')
      }

      if (avatarState === 'minting') {
        setAnimationUrl('Gangnam Style.fbx')
      }

      if (avatarState === 'minted') {
        setAnimationUrl('Thankful.fbx')
      }

      // handle blink
      if (blink) {
        setBlink(false)

        // tweak expressions
        const s = Math.sin(2 * Math.PI * clock.elapsedTime)
        vrm.expressionManager.setValue('blink', 0.5 + 0.5 * s)
        vrm.update(delta)

        // don't blink when eyes are open
        if (0.5 + 0.5 * s <= 0.01) {
          setBlink(false)
        }
      }

      // handle happy
      if (happy && !blink) {
        // tweak expressions
        const s = Math.sin(Math.PI * clock.elapsedTime)
        vrm.expressionManager.setValue('relaxed', 0.5 + 0.5 * s)

        // don't blink when happy is done
        if (0.5 + 0.5 * s <= 0.01) {
          setHappy(false)
        }
      }

      // update deltas
      mixer.update(delta)
      vrm.update(delta)
    }
  })

  if (gltf) return <primitive object={gltf.scene} {...props} />
}
