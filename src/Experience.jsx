import { useRef, useState } from 'react'
import { useFBO, OrbitControls, RoundedBox, useTexture, MeshTransmissionMaterial } from "@react-three/drei"
import { createPortal, useFrame, useThree } from "@react-three/fiber"
import { DoubleSide, Scene } from "three"
import { easing } from 'maath'


export default function Experience(){

  const [normalMap, pic] = useTexture(['./textures/waternormals.jpeg', './textures/colorcube_01.png'])
  console.log(pic)

  return (
    <>
      <OrbitControls />       
        <Lens>
        <RoundedBox
          radius={0.01}
          >
          <meshStandardMaterial 
            metalness={1}
            roughness={0.12}
            normalMap={ normalMap }
            visible={false}
          />
       </RoundedBox>

       <mesh>
        <planeGeometry 
        args={[pic.source.data.width/100, pic.source.data.height/100, 16, 16]}
        />
        <meshBasicMaterial
        side={DoubleSide}
        map={pic} />
       </mesh>

       </Lens>
    </>
  )}

  function Lens({ children, damping = 0.15, ...props }) {
    const ref = useRef()
    const buffer = useFBO()
    const viewport = useThree((state) => state.viewport)
    const [scene] = useState(() => new Scene())
    useFrame((state, delta) => {
      // Tie lens to the pointer
      // getCurrentViewport gives us the width & height that would fill the screen in threejs units
      // By giving it a target coordinate we can offset these bounds, for instance width/height for a plane that
      // sits 15 units from 0/0/0 towards the camera (which is where the lens is)
      const viewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 15])
      easing.damp3(
        ref.current.position,
        [(state.pointer.x * viewport.width) / 2, (state.pointer.y * viewport.height) / 2, 15],
        damping,
        delta
      )
      // This is entirely optional but spares us one extra render of the scene
      // The createPortal below will mount the children of <Lens> into the new THREE.Scene above
      // The following code will render that scene into a buffer, whose texture will then be fed into
      // a plane spanning the full screen and the lens transmission material
      state.gl.setRenderTarget(buffer)
      state.gl.setClearColor('#d8d7d7')
      state.gl.render(scene, state.camera)
      state.gl.setRenderTarget(null)

      ref.current.rotation.x = ref.current.rotation.y += delta / 3
    })
    return (
      <>
        {createPortal(children, scene)}
        <mesh scale={[viewport.width, viewport.height, 1]}>
          <planeGeometry />
          <meshBasicMaterial 
          map={buffer.texture} 
          color={0xeeeeff}
          />
        </mesh>
        {/* <mesh 
        scale={10.} 
        ref={ref} 
        rotation={[Math.PI / 4, Math.PI / .1 , Math.PI / 2.9 ]} 
        {...props}> */}
          <RoundedBox
            scale={10.}          
            ref={ref} 
            radius={0.005}
          >
          <MeshTransmissionMaterial 
          // buffer={buffer.texture}
          roughness={0.2} 
          ior={1.2} 
          thickness={1.5} 
          anisotropy={0.1} 
          chromaticAberration={0.04} 
          // color={0x9999ee}
          // distortion={0.1}
          backside={true}
          backsideThickness={0.5}
          />
          </RoundedBox>
        {/* </mesh> */}
      </>
    )
  }