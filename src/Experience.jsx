import { useRef, useState } from 'react'
import { useFBO, OrbitControls, RoundedBox, useTexture, MeshTransmissionMaterial, MeshRefractionMaterial, useEnvironment, useGLTF } from "@react-three/drei"
import { createPortal, useFrame, useThree } from "@react-three/fiber"
import { DoubleSide, Scene } from "three"
import { easing } from 'maath'
import { Perf } from 'r3f-perf'


export default function Experience(){

  const [normalMap, pic] = useTexture(['./textures/waternormals.jpeg', './textures/colorcube_01.png'])
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
    const { nodes } = useGLTF('./models/color_cube_separate_01.glb')
    const [normalMap_01, normalMap_02] = useTexture(['./textures/waternormals.jpeg', './textures/Asphalt_1.jpg'])
    const modelRef = useRef()
    useFrame((state, delta) => {
      modelRef.current.rotation.x = modelRef.current.rotation.y += delta / 3
    })

    return (
      <>
    <group
      ref={modelRef}
      position={[0, 0, 15]}
    >
      <mesh castShadow receiveShadow
      position={[0,0, -5]}
      rotation={[0, Math.PI, 0]}
      scale={10.}
      >
      <planeGeometry />
      <MeshTransmissionMaterial 
          roughness={0.1} 
          ior={1.4} 
          thickness={0.01} 
          anisotropy={0.1} 
          chromaticAberration={0.5} 
          color={0xffffff}
          backside={false}
          backsideThickness={0.5}
          normalMap={normalMap_01}
          normalScale={0.1}
          side={DoubleSide}
          />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        position={[5, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={10.}
        >
        <planeGeometry />
        <MeshTransmissionMaterial 
        roughness={0.1} 
        ior={1.4} 
        thickness={0.01} 
        anisotropy={0.1} 
        chromaticAberration={0.5} 
        color={0xffffff}
        backside={false}
        normalMap={normalMap_01}
        normalScale={0.1}
        side={DoubleSide}
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        position={[0, 0, 5]}
        scale={10.}
        >
        <planeGeometry />
        <MeshTransmissionMaterial 
          roughness={0.1} 
          ior={1.4} 
          thickness={0.01} 
          anisotropy={0.1} 
          chromaticAberration={0.5} 
          color={0xffffff}
          backside={false}
          normalMap={normalMap_01}
          normalScale={0.1}
          side={DoubleSide}
          />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        position={[-5, 0, 0]}
        rotation={[0, - Math.PI / 2, 0]}
        scale={10.}
        >
        <planeGeometry />
        <MeshTransmissionMaterial 
          roughness={0.4} 
          ior={1.4} 
          thickness={0.5} 
          anisotropy={0.1} 
          chromaticAberration={0.04} 
          color={0xffffff}
          backside={false}
          backsideThickness={0.5}
          normalMap={normalMap_01}
          normalScale={0.1}
          side={DoubleSide}
          />
        </mesh>
        <mesh
        castShadow
        receiveShadow
        position={[0, -5, 0]}
        rotation={[- Math.PI / 2, 0, 0]}
        scale={10.}
        >
        <planeGeometry />
        <MeshTransmissionMaterial 
          roughness={0.1} 
          ior={1.0} 
          thickness={0.5} 
          anisotropy={0.1} 
          chromaticAberration={0.04} 
          color={0xffffff}
          backside={false}
          backsideThickness={0.5}
          normalMap={normalMap_01}
          normalScale={0.1}
          side={DoubleSide}
          />
        </mesh>
        <mesh
        castShadow
        receiveShadow
        position={[0, 5, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={10.}
        >
        <planeGeometry />
        <MeshTransmissionMaterial 
          roughness={0.1} 
          ior={1.4} 
          thickness={0.5} 
          anisotropy={0.1} 
          chromaticAberration={0.4} 
          color={0xffffff}
          backside={false}
          backsideThickness={0.5}
          normalMap={normalMap_01}
          normalScale={0.1}
          side={DoubleSide}
          />
        </mesh>
        </group>
        </>
    )
  }

  useGLTF.preload('./models/color_cube.glb')
  
  