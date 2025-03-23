// // import { useParams } from "react-router-dom";
// // import "./choices.css";

// // // Placeholder Dashboard component - you'll want to create a proper file for this
// // function Dashboard() {
// //     const { agentType } = useParams();
// //     return (
// //       <div>
// //         <h1>{agentType}</h1>
  
// //       </div>
// //     );
// //   }A
// // export default Dashboard;
// import { Loader } from "@react-three/drei";
// import { Canvas } from "@react-three/fiber";
// import { Leva } from "leva";
// import { Experience } from "./components/Experience.jsx";
// import { UI } from "./components/UI.jsx";

// function Agent() {
//   return (
//     <>
//       <Loader />
//       <Leva hidden/>
//       <UI/>
//       <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
//         <Experience />
//       </Canvas>
//     </>
//   );
// }

// export default Agent;
// src/Agent.js
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience.jsx";
import UI from "./components/UI.jsx";
import { ChatProvider } from "/Users/parth/Downloads/GenAI/genAI-Hacks/clean-genai-hacks/Frontend/genai-hacks/src/components/hooks/useChat.jsx";
import { useEffect } from "react";
import "./therapistUI.css";

function Agent() {
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

export default Agent;
