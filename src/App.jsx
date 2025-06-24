import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  AudioAnalyzerProvider,
  useAudioAnalyzer,
} from "./context/AudioAnalyzerContext";
import DiscoFloor from "./components/DiscoFloor";
import NapsterLogo from "./components/NapsterLogo";
import Stars from "./components/Stars";

function Visualizer() {
  const { start, started } = useAudioAnalyzer();

  if (!started) {
    return (
      <div style={{ textAlign: "center", paddingTop: "20vh" }}>
        <button
          onClick={start}
          style={{ fontSize: "2rem", padding: "1rem 2rem" }}
        >
          Start Music Visualizer
        </button>
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
      <ambientLight />
      <spotLight
        position={[10, 20, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1}
      />
      <OrbitControls enableZoom={false} />
      <Stars />
      <DiscoFloor />
      <NapsterLogo />
    </Canvas>
  );
}

export default function App() {
  return (
    <AudioAnalyzerProvider>
      <Visualizer />
    </AudioAnalyzerProvider>
  );
}
