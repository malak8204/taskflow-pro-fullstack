import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <div>
          <p className="tag">Full-Stack Project Management App</p>
          <h1>Organize your projects and tasks in one place.</h1>
          <p className="hero-text">
            TaskFlow Pro helps users create projects, manage tasks, track progress,
            and stay productive using a secure full-stack web application.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="primary-btn">Get Started</Link>
            <Link to="/login" className="secondary-btn">Login</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Secure Authentication</h3>
          <p>Register and login using JWT-based authentication.</p>
        </div>

        <div className="feature-card">
          <h3>Project CRUD</h3>
          <p>Create, view, update, and delete your projects.</p>
        </div>

        <div className="feature-card">
          <h3>Task Tracking</h3>
          <p>Manage task status, priority, and project progress.</p>
        </div>
      </section>
    </>
  );
}

export default Home;