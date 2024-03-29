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

  const colorCube = useRef()
  const boxRef = useRef()


  const colors = [0x00ff00, 0xff0000, 0x0000ff, 0x444, 0xffff00, 0xaaa]

  useFrame((state, delta) => {
    boxRef.current.rotation.x = boxRef.current.rotation.y += delta / 3
  })

  return (
    <>
      <Perf position="top-left" />
      <OrbitControls />       
      <mesh
      ref={colorCube}
      scale={10.}
      position={[-30, 0, 5]}
      visible={false}
      >
        <boxGeometry />
        {colors.map((color, index) => (
            <meshPhysicalMaterial
              key={index}
              attach={`material-${index}`}
              color={color}
              roughness={0.1}
              metalness={0.0}
              transmission={1.0}
              opacity={1.0}
              thickness={5.0}
              envMap={envMap}
            />
          ))}
      </mesh>

      <Model />

      <mesh
      visible={false}
      scale={8.}
      position={[20, 10, 30]}
      ref={boxRef}
      >
        <boxGeometry />
        <MeshTransmissionMaterial 
          envMap={envMap}
          roughness={0.2} 
          ior={1.2} 
          thickness={1.5} 
          anisotropy={0.1} 
          chromaticAberration={0.04} 
        />
      </mesh>
      
        {/* <Lens> */}
        <RoundedBox
        visible={false}
          radius={0.1}
          scale={10.}
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

       {/* </Lens> */}
    </>
  )}

  function Lens({ children, damping = 0.15, ...props }) {

    
    const colors = [0x00ff00]
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

        <mesh 
        visible={false}
        scale={10.} 
        ref={ref} 
        rotation={[Math.PI / 4, Math.PI / .1 , Math.PI / 2.9 ]} 
        >
          <boxGeometry />
        
          <MeshTransmissionMaterial 
          // buffer={buffer.texture}
          roughness={0.2} 
          ior={1.2} 
          thickness={1.5} 
          anisotropy={0.1} 
          chromaticAberration={0.04} 
          attach={`material-1`}
          // distortion={0.1}
          backside={true}
          backsideThickness={0.5}
          />
        </mesh>
      </>
    )
  }
  
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
          ior={1.8} 
          thickness={0.5} 
          anisotropy={1.0} 
          chromaticAberration={1.00} 
          color={0xffffff}
          backside={false}
          backsideThickness={0.5}
          normalMap={normalMap_01}
          normalScale={0.01}
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
        ior={1.6} 
        thickness={0.5} 
        anisotropy={0.1} 
        chromaticAberration={0.04} 
        color={0xffffee}
        backside={false}
        backsideThickness={0.5}
        normalMap={normalMap_01}
        normalScale={0.01}
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
          chromaticAberration={0.9} 
          color={0xffeeee}
          backside={false}
          backsideThickness={0.0}
          normalMap={normalMap_01}
          normalScale={0.01}
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
          ior={1.0} 
          thickness={0.5} 
          anisotropy={0.1} 
          chromaticAberration={0.04} 
          color={0xeeeeff}
          backside={false}
          backsideThickness={0.5}
          normalMap={normalMap_01}
          normalScale={0.4}
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
          roughness={0.4} 
          ior={1.0} 
          thickness={0.5} 
          anisotropy={0.1} 
          chromaticAberration={0.04} 
          color={0xeeeeff}
          backside={false}
          backsideThickness={0.5}
          normalMap={normalMap_01}
          normalScale={0.4}
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
          roughness={0.4} 
          ior={1.0} 
          thickness={0.5} 
          anisotropy={0.1} 
          chromaticAberration={0.04} 
          color={0xeeeeff}
          backside={false}
          backsideThickness={0.5}
          normalMap={normalMap_01}
          normalScale={0.4}
          side={DoubleSide}
          />
        </mesh>
        </group>
        </>
    )
  }

  useGLTF.preload('./models/color_cube.glb')
  
  