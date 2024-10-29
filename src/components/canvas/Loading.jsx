import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

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
