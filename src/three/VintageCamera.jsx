import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Center, useGLTF } from '@react-three/drei'
import { Vector3 } from 'three'
import modelUrl from '../assets/models/vintage-camera.glb?url'
import { lensWeights } from '../lib/rig'

// Poly Haven "Vintage Video Camera" (CC0), Meshopt + WebP, ~430KB.
// Appears in the Video lens state (85mm): it turns from profile to look
// straight down the lens at the visitor.
const forward = new Vector3()

export default function VintageCamera() {
  const { scene } = useGLTF(modelUrl, false, true)
  const group = useRef(null)
  const { camera, size } = useThree()
  const shown = useRef(0)
  const model = useMemo(() => scene, [scene])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const target = lensWeights.align
    shown.current += (target - shown.current) * (1 - Math.exp(-delta * 4))
    const s = shown.current
    g.visible = s > 0.01
    if (!g.visible) return

    // Portrait: smaller, cropped into the lower right so the copy stays legible.
    const portrait = size.height > size.width
    camera.getWorldDirection(forward)
    g.position.copy(camera.position).addScaledVector(forward, 3.1)
    g.position.x += portrait ? 0.2 : 0
    g.position.y -= portrait ? 0.2 : 0.02
    const ease = 1 - Math.pow(1 - s, 3)
    g.scale.setScalar((portrait ? 2.1 : 3.4) * (0.6 + 0.4 * ease))
    g.rotation.set(0.06, -1.5 * (1 - ease) + Math.sin(state.clock.elapsedTime * 0.5) * 0.12 * ease, 0)
  })

  return (
    <group ref={group} visible={false}>
      <Center>
        <primitive object={model} />
      </Center>
    </group>
  )
}

useGLTF.preload(modelUrl, false, true)
