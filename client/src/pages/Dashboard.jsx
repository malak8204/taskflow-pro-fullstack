import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const completionRate =
    tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  const recentTasks = tasks.slice(0, 3);

  return (
    <>
      <Navbar />

      <main className="page">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Track your projects, tasks, and productivity overview.</p>
        </div>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            <div className="dashboard-hero">
              <div>
                <p className="tag">Productivity Overview</p>
                <h2>{completionRate}% of your tasks are completed</h2>
                <p>
                  You currently have {projects.length} projects and {tasks.length} tasks
                  in your workspace.
                </p>
              </div>

              <div className="quick-actions">
                <Link to="/projects">Manage Projects</Link>
                <Link to="/tasks">Manage Tasks</Link>
              </div>
            </div>

            <div className="progress-box">
              <div className="progress-info">
                <span>Overall Progress</span>
                <strong>{completionRate}%</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>

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

            <section className="recent-section">
              <h2>Recent Tasks</h2>

              {recentTasks.length === 0 ? (
                <div className="empty-state">No recent tasks yet.</div>
              ) : (
                <div className="cards-grid">
                  {recentTasks.map((task) => (
                    <div className="item-card" key={task._id}>
                      <h3>{task.title}</h3>
                      <p>{task.description || "No description provided."}</p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className={`status-badge ${task.status}`}>
                          {task.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default Dashboard;