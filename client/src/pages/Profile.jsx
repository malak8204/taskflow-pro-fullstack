import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

   setSuccessMessage("");
    setError("");

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("All password fields are required.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.put("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccessMessage("Your password has been changed successfully.");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setTimeout(() => {
  setShowPasswordForm(false);
}, 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="page">
        <div className="page-header">
          <h1>Edit Profile</h1>
          <p>Manage your account information and security settings.</p>
        </div>

        <div className="profile-layout">
          <section className="profile-card">
            <div className="profile-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <h2>{user?.name || "User"}</h2>
            <p>{user?.email}</p>

            <button
              className="profile-action-btn"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Change Password
            </button>
          </section>

          {showPasswordForm && (
            <form className="profile-form" onSubmit={handlePasswordChange}>
              <h2>Change Password</h2>

              {successMessage && (
  <div className="success-message success-box">
    <span className="success-icon">✓</span>
    <div>
      <strong>Password Updated</strong>
      <p>{successMessage}</p>
    </div>
  </div>
)}
              {error && <div className="error-message">{error}</div>}

              <input
                type="password"
                name="currentPassword"
                placeholder="Current password"
                value={formData.currentPassword}
                onChange={handleChange}
              />

              <input
                type="password"
                name="newPassword"
                placeholder="New password"
                value={formData.newPassword}
                onChange={handleChange}
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Changing..." : "Save New Password"}
                </button>

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

export default Profile;