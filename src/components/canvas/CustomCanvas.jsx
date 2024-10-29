import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import Avatar from './Avatar'
import Loading from './Loading'


const CustomCanvas = ({ state }) => {
  return (
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
  )
}

export default CustomCanvas
