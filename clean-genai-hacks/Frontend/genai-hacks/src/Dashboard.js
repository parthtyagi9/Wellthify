import { useParams } from "react-router-dom";

// Placeholder Dashboard component - you'll want to create a proper file for this
function Dashboard() {
    const { agentType } = useParams();
    return (
      <div>
        <h1>Dashboard for {agentType}</h1>
  
      </div>
    );
  }
export default Dashboard;