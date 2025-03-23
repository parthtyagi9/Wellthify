// import './App.css';
// import Dashboard from './Dashboard.js';
// import Agent from './Agent.js'
// import Home from './home.js';
// import { Routes, Route } from 'react-router-dom';
// import Choices from './choices.js';
// import Dietitian from './Dietitian';

// function App() {
//   return (
//     // React app
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/choices" element={<Choices />} />
//       <Route path="/agent/Dietitian" element={<Dietitian />} />
//       {/* <Route path="/agent/:agentType" element={<Agent />} /> */}
//     </Routes>
//   );
// }


// export default App;
import './App.css';
import Dashboard from './Dashboard.js';
import Agent from './Agent.js';  // Our 3D therapist scene
import Home from './home.js';
import { Routes, Route } from 'react-router-dom';
import Choices from './choices.js';
import Dietitian from './Dietitian';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/choices" element={<Choices />} />
      <Route path="/agent/Dietitian" element={<Dietitian />} />

      {/* The 3D therapist route */}
      <Route path="/agent/Therapist" element={<Agent />} />
    </Routes>
  );
}

export default App;
