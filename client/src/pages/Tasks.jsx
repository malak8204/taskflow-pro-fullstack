import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
  project: ""
});

  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const projectsRes = await API.get("/projects");
      const tasksRes = await API.get("/tasks");

      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.project) {
      setError("Task title and project are required.");
      return;
    }

    try {
      if (editingId) {
        await API.put(`/tasks/${editingId}`, formData);
        setEditingId(null);
      } else {
        await API.post("/tasks", formData);
      }

      setFormData({
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
  project: ""
});

      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task.");
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);

    setFormData({
  title: task.title,
  description: task.description || "",
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
  project: task.project?._id || task.project
});
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
  project: ""
});
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/tasks/${id}`);
      fetchData();
    } catch (err) {
      setError("Failed to delete task.");
    }
  };

 const filteredTasks = tasks.filter((task) => {
  const matchesStatus = filter === "all" || task.status === filter;

  const search = searchTerm.toLowerCase();

  const matchesSearch =
    task.title.toLowerCase().includes(search) ||
    (task.description || "").toLowerCase().includes(search) ||
    (task.project?.title || "").toLowerCase().includes(search);

  return matchesStatus && matchesSearch;
});

  return (
    <>
      <Navbar />

      <main className="page">
        <div className="page-header">
          <h1>Tasks</h1>
          <p>Create, update, filter, and track your project tasks.</p>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Task" : "Add New Task"}</h2>

          {error && <div className="error-message">{error}</div>}

          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={formData.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Task description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>

          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
          >
            <option value="">Select Project</option>

            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <input
  type="date"
  name="dueDate"
  value={formData.dueDate}
  onChange={handleChange}
/>
          </select>

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Task" : "Create Task"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-action"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
<div className="search-box search-box-tasks">
  <span className="search-icon">🔎</span>

  <input
    type="text"
    placeholder="Search tasks by title, description, or project..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  {searchTerm && (
    <button
      type="button"
      className="clear-search-btn"
      onClick={() => setSearchTerm("")}
    >
      ×
    </button>
  )}
</div>
        <div className="filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
          <button onClick={() => setFilter("in-progress")}>In Progress</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <div className="cards-grid">
            {filteredTasks.length === 0 ? (
              <p>No tasks found.</p>
            ) : (
              filteredTasks.map((task) => (
                <div className="item-card" key={task._id}>
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description provided."}</p>

                  <p>
                    <strong>Project:</strong>{" "}
                    {task.project?.title || "Unknown project"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status-badge ${task.status}`}>
                      {task.status}
                    </span>
                  </p>

                  <p>
  <strong>Priority:</strong>{" "}
  <span className={`priority-badge ${task.priority}`}>
    {task.priority}
  </span>
</p>

<p>
  <strong>Due Date:</strong>{" "}
  {task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date"}
</p>

                  <div className="card-actions">
                    <button onClick={() => handleEdit(task)}>Edit</button>
                    <button
                      className="danger-btn"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default Tasks;