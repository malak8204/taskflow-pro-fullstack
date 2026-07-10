import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
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

    if (!formData.title) {
      setError("Project title is required.");
      return;
    }

    try {
      if (editingId) {
        await API.put(`/projects/${editingId}`, formData);
        setEditingId(null);
      } else {
        await API.post("/projects", formData);
      }

      setFormData({
        title: "",
        description: ""
      });

      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save project.");
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);

    setFormData({
      title: project.title,
      description: project.description || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      title: "",
      description: ""
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? Related tasks will also be deleted."
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      setError("Failed to delete project.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="page">
        <div className="page-header">
          <h1>Projects</h1>
          <p>Create, edit, and manage your project workspace.</p>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Project" : "Add New Project"}</h2>

          {error && <div className="error-message">{error}</div>}

          <input
            type="text"
            name="title"
            placeholder="Project title"
            value={formData.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Project description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Project" : "Create Project"}
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

        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="cards-grid">
            {projects.length === 0 ? (
              <p>No projects yet. Create your first project.</p>
            ) : (
              projects.map((project) => (
                <div className="item-card" key={project._id}>
                  <h3>{project.title}</h3>
                  <p>{project.description || "No description provided."}</p>

                  <div className="card-actions">
                    <button onClick={() => handleEdit(project)}>Edit</button>
                    <button
                      className="danger-btn"
                      onClick={() => handleDelete(project._id)}
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

export default Projects;