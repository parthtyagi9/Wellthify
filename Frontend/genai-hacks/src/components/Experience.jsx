import {
  CameraControls,
  ContactShadows,
  Environment,
} from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import { useChat } from "./hooks/useChat";
import { Avatar } from "./Avatar";

export const Experience = () => {
  const cameraControls = useRef();
  const { cameraZoomed } = useChat();

  const getCameraSettings = () => {
    if (!cameraControls.current) return null;
    
    // Get the current camera position
    const position = cameraControls.current.getPosition();
    const target = cameraControls.current.getTarget();
    
    return {
      position,
      target,
      distance: cameraControls.current.getDistance(),
      zoomLevel: cameraZoomed
    };
};

// Inside Experience.jsx
useEffect(() => {
  cameraControls.current.setLookAt(0, 1.6, 5, -0.2, 0.9, 0); // initial view
}, []);

useEffect(() => {
  if (cameraZoomed) {
    cameraControls.current.setLookAt(0, 1.5, 5, -0.2, 0.9, 0, true);
  } else {
    cameraControls.current.setLookAt(0, 1.6, 5, -0.2, 0.9, 0, true);
  }
}, [cameraZoomed]);


  return (
    <>
      <CameraControls ref={cameraControls} />
      <Environment preset="sunset" />
      <Suspense fallback={null}>
        <Avatar />
        <ContactShadows position={[0, 0, 0]} opacity={0.6} />
      </Suspense>
    </>
  );
};