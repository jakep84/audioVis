import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import song from "../assets/song.mp3";

const AudioAnalyzerContext = createContext();

export const useAudioAnalyzer = () => useContext(AudioAnalyzerContext);

export const AudioAnalyzerProvider = ({ children }) => {
  const [frequencyData, setFrequencyData] = useState(new Uint8Array(64));
  const [started, setStarted] = useState(false);
  const audioRef = useRef();
  const analyserRef = useRef();
  const dataRef = useRef();

  const start = () => {
    if (started) return;
    setStarted(true);

    const audio = new Audio(song);
    audio.loop = true;
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const context = new (window.AudioContext || window.webkitAudioContext)();
    const src = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    analyser.fftSize = 128;

    const data = new Uint8Array(analyser.frequencyBinCount);
    dataRef.current = data;
    analyserRef.current = analyser;

    src.connect(analyser);
    analyser.connect(context.destination);

    const update = () => {
      analyser.getByteFrequencyData(data);
      setFrequencyData([...data]);
      requestAnimationFrame(update);
    };

    audio.play().then(update);
  };

  return (
    <AudioAnalyzerContext.Provider value={{ frequencyData, start, started }}>
      {children}
    </AudioAnalyzerContext.Provider>
  );
};
