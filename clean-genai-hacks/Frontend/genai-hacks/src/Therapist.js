import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience.jsx";
import UI from "./components/UI.jsx";
import { ChatProvider } from "./components/hooks/useChat.jsx";
import { useEffect } from "react";
import "./therapistUI.css";

function Therapist() {
  useEffect(() => {
    document.body.classList.add("therapist-background");
    return () => {
      document.body.classList.remove("therapist-background");
      document.body.classList.remove("greenScreen");
    };
  }, []);

  return (
    <ChatProvider>
      <div className="therapist-wrapper">
        <Loader />
        <Leva hidden />
        <UI />
        <Canvas
          shadows
          camera={{ position: [0, 1.6, 3.5], fov: 30 }}
          className="therapist-canvas"
        >
          <Experience />
        </Canvas>
      </div>
    </ChatProvider>
  );
}

export default Therapist;
