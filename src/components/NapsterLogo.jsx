import React, { useRef, useEffect, useState } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { SVGLoader } from "three-stdlib";
import { useAudioAnalyzer } from "../context/AudioAnalyzerContext";
import * as THREE from "three";
import napsterSVG from "../assets/brand-napster.svg";

export default function NapsterLogo() {
  const group = useRef();
  const { frequencyData } = useAudioAnalyzer();
  const [shapes, setShapes] = useState([]);

  const svgData = useLoader(SVGLoader, napsterSVG);

  useEffect(() => {
    const paths = svgData.paths;
    const shapeArray = [];

    for (let path of paths) {
      const shapes = SVGLoader.createShapes(path);
      for (let shape of shapes) {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 1,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelSegments: 2,
        });

        geometry.center();

        const material = new THREE.MeshStandardMaterial({
          color: "#ffffff",
          emissive: "#88ccff", // soft blue glow
          emissiveIntensity: 2,
          metalness: 0.1,
          roughness: 0.3,
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(geometry, material);

        shapeArray.push(mesh);

        const outlineMaterial = new THREE.MeshBasicMaterial({
          color: "white",
          side: THREE.BackSide,
        });
        const outline = new THREE.Mesh(geometry.clone(), outlineMaterial);
        outline.scale.multiplyScalar(1.02); // slightly bigger

        shapeArray.push(outline, mesh);
      }
    }

    setShapes(shapeArray);
  }, [svgData]);

  useFrame(() => {
    if (!group.current) return;

    const avg = frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;

    const dynamicScale = 1 + avg / 300;
    group.current.scale.set(dynamicScale, dynamicScale, dynamicScale);

    group.current.rotation.y += 0.002;
  });

  return (
    <group
      ref={group}
      position={[0, 4.5, 0]}
      rotation={[Math.PI, 0, 0]}
      scale={[0.003, 0.003, 0.003]}
    >
      {shapes.map((mesh, i) => (
        <primitive object={mesh} key={i} />
      ))}
    </group>
  );
}
