import { useRef, useMemo, useReducer } from 'react'
import { useFBO, OrbitControls, RoundedBox, useTexture, MeshTransmissionMaterial, MeshRefractionMaterial, useEnvironment, useGLTF } from "@react-three/drei"
import { createPortal, useFrame, useThree } from "@react-three/fiber"
import { DoubleSide, Vector3, MathUtils } from "three"
import { easing } from 'maath'
import { Perf } from 'r3f-perf'
import { CuboidCollider, BallCollider, Physics, RigidBody } from '@react-three/rapier'


const accents = ['#4060ff', '#20ffa0', '#ff4060', '#ffcc00']
const shuffle = (accent = 0) => [
  { color: '#444', roughness: 0.1 },
  { color: '#444', roughness: 0.75 },
  { color: '#444', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true }
]


export default function Experience(){

  const [normalMap, pic] = useTexture(['./textures/broken_glass.jpg', './textures/colorcube_01.png'])
  const envMap = useEnvironment({files:'./environments/envmap.hdr'})
  console.log(pic)

  const [accent, click] = useReducer((state) => ++state % accents.length, 0)
  const connectors = useMemo(() => shuffle(accent), [accent])

  return (
    <>
      <Perf position="top-left" />
      <OrbitControls /> 

      <Physics /*debug*/ gravity={[0, 0, 0]}>

      {connectors.map((props, i) => <Connector key={i} {...props} />) /* prettier-ignore */}
        <Connector position={[10, 10, 5]}>
           <Model />
        </Connector>

      </Physics>

       <mesh>
        <planeGeometry 
        args={[pic.source.data.width/100, pic.source.data.height/100, 16, 16]}
        />
        <meshBasicMaterial
        side={DoubleSide}
        map={pic} />
       </mesh>

    </>
  )}
  
  export function Model({ children, color = 'white', roughness = 0, ...props }) {
    const { nodes } = useGLTF('./models/shape_01.glb')
    const [normalMap_01, normalMap_02] = useTexture(['./textures/broken_glass.jpg', './textures/Asphalt_1.jpg'])
    const modelRef = useRef()
    useFrame((state, delta) => {
      modelRef.current.rotation.x = modelRef.current.rotation.y += delta / 3
    })

    return (
      <>
    <group
      ref={modelRef}
      position={[0, 0, 10]}
    >
      <mesh castShadow receiveShadow
      geometry={nodes.Shape.geometry}
      position={[0,0, 0]}
      rotation={[0, Math.PI, 0]}
      scale={2.}
      >

      <MeshTransmissionMaterial 
          roughness={0.4} 
          metalness={0.1}
          ior={1.4} 
          thickness={0.9} 
          anisotropy={0.5} 
          chromaticAberration={0.5} 
          color={0xbc99ff}
          backside={true}
          backsideThickness={0.4}
          normalMap={normalMap_01}
          normalScale={0.07}
          side={DoubleSide}
          />
          {children}
      </mesh>
        </group>
        </>
    )
  }

  useGLTF.preload('./models/shape_01.glb')
  

  function Connector({ position, children, vec = new Vector3(), scale, r = MathUtils.randFloatSpread, accent, ...props }) {
    const api = useRef()
    const pos = useMemo(() => position || [r(20), r(20), r(20)], [])
    useFrame((state, delta) => {
      delta = Math.min(0.1, delta)
      api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(0.2))
    })
    return (
      <RigidBody linearDamping={4} 
      angularDamping={1} 
      friction={0.1} 
      position={pos} 
      ref={api} 
      colliders={'hull'}>
        {/* <CuboidCollider args={[0.38, 1.27, 0.38]} />
        <CuboidCollider args={[1.27, 0.38, 0.38]} />
        <CuboidCollider args={[0.38, 0.38, 1.27]} /> */}
        {children ? children : <Model {...props} />}
        {accent && <pointLight intensity={4} distance={2.5} />}
      </RigidBody>
    )
  }
  