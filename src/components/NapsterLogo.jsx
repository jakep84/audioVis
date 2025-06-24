import React, { useRef, useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three-stdlib";
import { useAudioAnalyzer } from "../context/AudioAnalyzerContext";
import * as THREE from "three";

export default function NapsterLogo() {
  const group = useRef();
  const { frequencyData } = useAudioAnalyzer();
  const [shapes, setShapes] = useState([]);

  const svgData = useLoader(SVGLoader, "/assets/brand-napster.svg");

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

        const material = new THREE.MeshStandardMaterial({
          color: path.color || "#ffffff",
          emissive: "blue",
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(geometry, material);
        shapeArray.push(mesh);
      }
    }

    setShapes(shapeArray);
  }, [svgData]);

  useEffect(() => {
    if (!group.current) return;
    const animate = () => {
      const avg =
        frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;
      const scale = 1 + avg / 300;
      group.current.scale.set(scale, scale, scale);
      requestAnimationFrame(animate);
    };
    animate();
  }, [frequencyData]);

  return (
    <group ref={group} position={[0, 5, 0]}>
      {shapes.map((mesh, i) => (
        <primitive object={mesh} key={i} />
      ))}
    </group>
  );
}
