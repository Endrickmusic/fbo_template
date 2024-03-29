import { useRef, useState } from 'react'
import { useFBO, OrbitControls, RoundedBox, useTexture, MeshTransmissionMaterial, MeshRefractionMaterial, useEnvironment, useGLTF } from "@react-three/drei"
import { createPortal, useFrame, useThree } from "@react-three/fiber"
import { DoubleSide, Scene } from "three"
import { easing } from 'maath'
import { Perf } from 'r3f-perf'


export default function Experience(){

  const [normalMap, pic] = useTexture(['./textures/broken_glass.jpg', './textures/colorcube_01.png'])
  const envMap = useEnvironment({files:'./environments/envmap.hdr'})
  console.log(pic)


  return (
    <>
      <Perf position="top-left" />
      <OrbitControls />       

      <Model />

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
  
  export function Model(props) {
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
          ior={1.4} 
          thickness={0.9} 
          anisotropy={0.5} 
          chromaticAberration={0.5} 
          color={0xeeeeff}
          backside={true}
          backsideThickness={0.4}
          normalMap={normalMap_01}
          normalScale={0.07}
          side={DoubleSide}
          />
      </mesh>
        </group>
        </>
    )
  }

  useGLTF.preload('./models/shape_01.glb')
  
  