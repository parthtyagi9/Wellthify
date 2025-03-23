// import {
//   CameraControls,
//   ContactShadows,
//   Environment,
//   Text,
// } from "@react-three/drei";
// import { Suspense, useEffect, useRef, useState } from "react";
// import { useChat } from "./hooks/useChat.jsx";
// import { Avatar } from "./Avatar.jsx";

// const Dots = (props) => {
//   const { loading } = useChat();
//   const [loadingText, setLoadingText] = useState("");
//   useEffect(() => {
//     if (loading) {
//       const interval = setInterval(() => {
//         setLoadingText((loadingText) => {
//           if (loadingText.length > 2) {
//             return ".";
//           }
//           return loadingText + ".";
//         });
//       }, 800);
//       return () => clearInterval(interval);
//     } else {
//       setLoadingText("");
//     }
//   }, [loading]);
//   if (!loading) return null;
//   return (
//     <group {...props}>
//       <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
//         {loadingText}
//         <meshBasicMaterial attach="material" color="black" />
//       </Text>
//     </group>
//   );
// };

// export const Experience = () => {
//   const cameraControls = useRef();
//   const { cameraZoomed } = useChat();

//   useEffect(() => {
//     cameraControls.current.setLookAt(0, 2, 5, 0, 1.5, 0);
//   }, []);

//   useEffect(() => {
//     if (cameraZoomed) {
//       cameraControls.current.setLookAt(0, 1.5, 2, 0, 1.0, 0, true);
//     } else {
//       cameraControls.current.setLookAt(0, 2.0, 4, 0, 1.0, 0, true);
//     }
//   }, [cameraZoomed]);
//   return (
//     <>
//       <CameraControls ref={cameraControls} />
//       <Environment preset="sunset" />
//       {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
//       <Suspense>
//         <Dots position-y={1.75} position-x={-0.02} />
//       </Suspense>
//       <Avatar />
//       <ContactShadows opacity={0.7} />
//     </>
//   );
// };
// import {
//   CameraControls,
//   ContactShadows,
//   Environment,
//   Text,
// } from "@react-three/drei";
// import { Suspense, useEffect, useRef, useState } from "react";
// import { useChat } from "./hooks/useChat.jsx";
// import { Avatar } from "./Avatar.jsx";

// const Dots = (props) => {
//   const { loading } = useChat();
//   const [loadingText, setLoadingText] = useState("");
//   useEffect(() => {
//     if (loading) {
//       const interval = setInterval(() => {
//         setLoadingText((loadingText) => {
//           if (loadingText.length > 2) {
//             return ".";
//           }
//           return loadingText + ".";
//         });
//       }, 800);
//       return () => clearInterval(interval);
//     } else {
//       setLoadingText("");
//     }
//   }, [loading]);
//   if (!loading) return null;
//   return (
//     <group {...props}>
//       <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
//         {loadingText}
//         <meshBasicMaterial attach="material" color="black" />
//       </Text>
//     </group>
//   );
// };

// export const Experience = () => {
//   const cameraControls = useRef();
//   const { cameraZoomed } = useChat();

//   useEffect(() => {
//     cameraControls.current.setLookAt(0, 2, 5, 0, 1.5, 0);
//   }, []);

//   useEffect(() => {
//     if (cameraZoomed) {
//       cameraControls.current.setLookAt(0, 1.5, 2, 0, 1.0, 0, true);
//     } else {
//       cameraControls.current.setLookAt(0, 2.0, 4, 0, 1.0, 0, true);
//     }
//   }, [cameraZoomed]);
//   return (
//     <>
//       <CameraControls ref={cameraControls} />
//       <Environment preset="sunset" />
//       {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
//       <Suspense>
//         <Dots position-y={1.75} position-x={-0.02} />
//       </Suspense>
//       <Avatar />
//       <ContactShadows opacity={0.7} />
//     </>
//   );
// };
// src/components/Experience.jsx
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