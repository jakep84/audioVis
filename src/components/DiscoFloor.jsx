import React from "react";
import { useAudioAnalyzer } from "../context/AudioAnalyzerContext";

export default function DiscoFloor() {
  const { frequencyData } = useAudioAnalyzer();
  const tileSize = 1;
  const gridSize = 8;

  return (
    <group
      position={[-(gridSize * tileSize) / 2, 0, -(gridSize * tileSize) / 2]}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, i) => {
        const x = (i % gridSize) * tileSize;
        const z = Math.floor(i / gridSize) * tileSize;
        const value = frequencyData[i % frequencyData.length] / 255;

        return (
          <mesh key={i} position={[x, value, z]}>
            <boxGeometry args={[1, 0.5 + value * 2, 1]} />
            <meshStandardMaterial color={`hsl(${value * 200}, 150%, 55%)`} />
          </mesh>
        );
      })}
    </group>
  );
}
