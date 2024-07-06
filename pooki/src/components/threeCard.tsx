import {
  Image as DImage,
  Environment,
  Float,
  MeshReflectorMaterial,
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
  OrbitControls,
  PerspectiveCamera,
  RoundedBox,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Plane: THREE.Mesh;
    Plane001: THREE.Mesh;
  };
  materials: {};
};

export function ThreeDCard({ idx }: { idx: string }) {
  const { nodes, materials } = useGLTF("models/card.glb") as GLTFResult;

  return (
    <Float>
      <group>
        <DImage
          position={[0, 0, 0.01]}
          scale={[0.9, 0.9, 0.9]}
          transparent
          url={`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${idx}.png`}
        />
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.6} dispose={null}>
          <mesh geometry={nodes.Plane.geometry}>
            <meshPhysicalMaterial color="#a0a0a0" roughness={0} metalness={1} />{" "}
          </mesh>
          <mesh geometry={nodes.Plane001.geometry}>
            <meshPhysicalMaterial
              metalness={1}
              roughness={0.2}
              color={"#ca8a04"}
            />
          </mesh>
        </group>
        {/* <RoundedBox scale={[1, 1.5, 0.01]}>
          <meshPhysicalMaterial roughness={0.3} metalness={1} />
        </RoundedBox> */}
      </group>
    </Float>
  );
}

useGLTF.preload("/models/card.glb");
