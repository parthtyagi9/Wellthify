// import { useParams } from "react-router-dom";
// import "./choices.css";

// // Placeholder Dashboard component - you'll want to create a proper file for this
// function Dashboard() {
//     const { agentType } = useParams();
//     return (
//       <div>
//         <h1>{agentType}</h1>
  
//       </div>
//     );
//   }
// export default Dashboard;
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience.jsx";
import { UI } from "./components/UI.jsx";

function Agent() {
  return (
    <>
      <Loader />
      <Leva hidden/>
      <UI/>
      <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
        <Experience />
      </Canvas>
    </>
  );
}

export default Agent;
