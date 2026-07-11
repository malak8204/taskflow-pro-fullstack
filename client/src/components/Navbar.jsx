import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [openMenu, setOpenMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const showComingSoon = (feature) => {
    alert(`${feature} page will be added soon.`);
    setOpenMenu(false);
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        <span className="logo-icon">✓</span>
        TaskFlow Pro
      </NavLink>

      <div className="nav-links">
        {token ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-link active-tab" : "nav-link"
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? "nav-link active-tab" : "nav-link"
              }
            >
              Projects
            </NavLink>

            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                isActive ? "nav-link active-tab" : "nav-link"
              }
            >
              Tasks
            </NavLink>

            <div className="account-menu">
              <button
                type="button"
                className="account-button"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <span className="avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>

                <span className="account-name">
                  {user?.name || "User"}
                </span>
              </button>

              {openMenu && (
                <div className="account-dropdown">
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
  setOpenMenu(false);
  navigate("/profile");
}}
                  >
                    <span>✏️</span>
                    Edit Profile
                  </button>

                  

                  <button
                    type="button"
                    className="dropdown-item logout-option"
                    onClick={logout}
                  >
                    <span>🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link active-tab" : "nav-link"
              }
            >
              Login
            </NavLink>

            <NavLink to="/register" className="nav-button">
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;