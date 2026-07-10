import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const projectsRes = await API.get("/projects");
      const tasksRes = await API.get("/tasks");

      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.log("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;

  return (
    <>
      <Navbar />

      <main className="page">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Overview of your projects and tasks.</p>
        </div>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Projects</h3>
              <p>{projects.length}</p>
            </div>

            <div className="stat-card">
              <h3>Total Tasks</h3>
              <p>{tasks.length}</p>
            </div>

            <div className="stat-card">
              <h3>Completed</h3>
              <p>{completedTasks}</p>
            </div>

            <div className="stat-card">
              <h3>In Progress</h3>
              <p>{inProgressTasks}</p>
            </div>

            <div className="stat-card">
              <h3>Pending</h3>
              <p>{pendingTasks}</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Dashboard;