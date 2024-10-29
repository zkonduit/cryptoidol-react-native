import React, { Suspense, useRef, useState } from 'react'
import { Button, SafeAreaView, Text } from 'react-native'
import { Canvas, useFrame } from '@react-three/fiber'
import Avatar from './canvas/Avatar'
import { PerspectiveCamera } from '@react-three/drei'

const Loading = () => {
  const meshRef = useRef()

  useFrame((state, delta, frame) => {
    // const elapsed = clock.getElapsedTime()
    // Rotate the mesh around the diagonal by rotating both x and y
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta
  })

  return (
    <mesh ref={meshRef} position={[0, 1, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

const MainBlock = () => {
  const [state, setState] = useState('start')

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Canvas
        onCreated={(state) => {
          const renderer = state.gl
          renderer.setClearColor('rgb(248,225,225)', 0.1)

          renderer.extensions.get('EXT_color_buffer_float')

          // TODO - a fix from https://github.com/expo/expo-three/issues/196#issuecomment-1334807693

          const _gl = state.gl.getContext()
          const pixelStorei = _gl.pixelStorei.bind(_gl)
          _gl.pixelStorei = function(...args) {
            const [parameter] = args
            switch (parameter) {
              case _gl.UNPACK_FLIP_Y_WEBGL:
                return pixelStorei(...args)
            }
          }
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[0, 5, 5]} intensity={1.2} />

        <PerspectiveCamera makeDefault fov={80} position={[0, -0.5, 5]} />

        <Suspense fallback={<Loading />}>
          <Avatar position={[0, -1, 3.7]} rotation={[0, -Math.PI, 0]} avatarState={state} />
        </Suspense>
      </Canvas>
      {state === 'start' ? (
        <>
          <Text style={{ textAlign: 'center' }}>
            Not Minted Yet
          </Text>

          <Button
            title="Start Minting!"
            onPress={() => {
              setState('minting')
              // Time out for 10 seconds
              setTimeout(() => {
                setState('minted')
              }, 10000)
            }}
          />
        </>
      ) : state === 'minting' ? (
        <Text>Minting...</Text>
      ) : (
        <>
          <Text>Minted!</Text>
          <Button title={'Mint Again'} onPress={() => setState('start')} />
        </>
      )}
    </SafeAreaView>
  )
}

export default MainBlock
