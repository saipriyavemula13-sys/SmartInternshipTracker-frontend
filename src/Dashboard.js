
import { useEffect, useMemo, useState } from "react";
import api from "./api";
import "./Dashboard.css";

const STATUSES = [
"Applied",
"Assessment",
"Shortlisted",
"Interview",
"Offered",
"Rejected",
"Withdrawn"
];



const EMPTY_FORM = {
  companyName: "",
  role: "",
  location: "",
  applicationLink: "",
  applicationDate: new Date().toISOString().slice(0, 10),
  deadline: "",
  interviewDate: "",
  followUpDate: "",
  status: "Applied",
  notes: "",
};
function Dashboard({ user, onLogout }) {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadInternships() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/internships");
      const records = Array.isArray(response.data)
        ? response.data
        : response.data.internships ?? [];

      setInternships(records);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not load internships. Check the backend API."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInternships();
  }, []);

  const filteredInternships = useMemo(() => {
    const query = search.trim().toLowerCase();

    return internships.filter((item) => {
      const matchesSearch = [
        item.companyName,
        item.role,
        item.location,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [internships, search, statusFilter]);

  const countByStatus = (status) =>
    internships.filter((item) => item.status === status).length;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }
  
function handleEdit(item) {
  setEditingId(item.id);

  setForm({
    companyName: item.companyName || "",
    role: item.role || "",
    location: item.location || "",
    applicationLink: item.applicationLink || "",
    applicationDate: item.applicationDate || "",
    deadline: item.deadline || "",
    interviewDate: item.interviewDate || "",
    followUpDate: item.followUpDate || "",
    status: item.status || "Applied",
    notes: item.notes || "",
  });

  setMessage("");
  setShowForm(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

async function handleDelete(item) {
  const confirmed = window.confirm(
    `Are you sure you want to delete the internship at ${item.companyName}?`
  );

  if (!confirmed) {
    return;
  }

  setMessage("");

  try {
    await api.delete(`/internships/${item.id}`);

    setMessage("Internship deleted successfully!");

    await loadInternships();
  } catch (err) {
    setMessage(
      err.response?.data?.message ||
        "Could not delete internship. Please try again."
    );
  }
}
  
async function handleSubmit(event) {
  event.preventDefault();
  setSaving(true);
  setMessage("");

  try {
    if (editingId !== null) {
      await api.put(`/internships/${editingId}`, form);
      setMessage("Internship updated successfully!");
    } else {
      await api.post("/internships", form);
      setMessage("Internship added successfully!");
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);

    await loadInternships();
  } catch (err) {
    setMessage(
      err.response?.data?.message ||
        "Could not save internship. Check your backend API."
    );
  } finally {
    setSaving(false);
  }
}

  return (
    <div className="tracker-layout">
      <aside className="tracker-sidebar">
        <div className="tracker-brand">
          <span className="tracker-logo">✦</span>
          <div>
            <strong>Smart Tracker</strong>
            <small>Internship Manager</small>
          </div>
        </div>

        <p className="sidebar-heading">WORKSPACE</p>

        <button className="nav-item active" type="button">
          <span>▦</span> Dashboard
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={() => {
            setShowForm(false);
            document.getElementById("internship-list")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span>▤</span> My Internships
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={() => setShowForm(true)}
        >
          <span>＋</span> Add Internship
        </button>

        <div className="sidebar-bottom">
          <div className="profile-mini">
            <div className="avatar">
              {(user?.fullName || "U").charAt(0).toUpperCase()}
            </div>
            <div className="profile-text">
              <strong>{user?.fullName || "Student"}</strong>
              <small>{user?.email || ""}</small>
            </div>
          </div>

          <button className="logout-button" onClick={onLogout}>
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="tracker-main">
        <header className="tracker-topbar">
          <div>
            <p className="dashboard-eyebrow">YOUR CAREER JOURNEY</p>
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">
              Keep track of every opportunity and move closer to your goals.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              setMessage("");
              setForm(EMPTY_FORM);
              setShowForm(true);
            }}
          >
            + Add Internship
          </button>
        </header>

        {message && (
          <div className="dashboard-message" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="dashboard-error" role="alert">
            {error}
            <button type="button" onClick={loadInternships}>
              Retry
            </button>
          </div>
        )}

        <section className="stats-grid">
          <StatCard
            title="Total Applications"
            value={internships.length}
            icon="▦"
            color="purple"
          />
          <StatCard
            title="Applied"
            value={countByStatus("Applied")}
            icon="↗"
            color="blue"
          />
          <StatCard
            title="Interviews"
            value={countByStatus("Interview")}
            icon="◷"
            color="orange"
          />
          <StatCard
            title="Offers"
            value={countByStatus("Offered")}
            icon="✓"
            color="green"
          />
          <StatCard
            title="Rejected"
            value={countByStatus("Rejected")}
            icon="–"
            color="red"
          />
        </section>

        {showForm && (
          <section className="form-panel">
            <div className="panel-heading">
              <div>
                <h2>{editingId !== null ? "Edit internship" : "Add an internship"}</h2>
                <p>Record a new opportunity in your tracker.</p>
              </div>
              <button
                className="close-button"
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="internship-form-grid">
              <div className="field">
                <label htmlFor="companyName">Company name *</label>
                <input
                  id="companyName"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Microsoft"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="role">Role *</label>
                <input
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer Intern"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad / Remote"
                />
              </div>

              <div className="field">
                <label htmlFor="applicationDate">Application date *</label>
                <input
                  id="applicationDate"
                  name="applicationDate"
                  type="date"
                  value={form.applicationDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
<div className="field">
  <label htmlFor="applicationLink">Application link</label>
  <input
    id="applicationLink"
    name="applicationLink"
    type="url"
    value={form.applicationLink}
    onChange={handleChange}
    placeholder="https://company-careers-page..."
  />
</div>

<div className="field">
  <label htmlFor="deadline">Application deadline</label>
  <input
    id="deadline"
    name="deadline"
    type="date"
    value={form.deadline}
    onChange={handleChange}
  />
</div>

<div className="field">
  <label htmlFor="interviewDate">Interview date</label>
  <input
    id="interviewDate"
    name="interviewDate"
    type="date"
    value={form.interviewDate}
    onChange={handleChange}
  />
</div>

<div className="field">
  <label htmlFor="followUpDate">Follow-up date</label>
  <input
    id="followUpDate"
    name="followUpDate"
    type="date"
    value={form.followUpDate}
    onChange={handleChange}
  />
</div>

              <div className="field">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field field-wide">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Recruiter details, deadlines, or next steps..."
                  rows="3"
                />
              </div>

              <div className="form-actions field-wide">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
  setShowForm(false);
  setEditingId(null);
  setForm(EMPTY_FORM);
}}
>
                </button>
                <button
                  className="primary-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving
  ? "Saving..."
  : editingId !== null
    ? "Update Internship"
    : "Save Internship"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="table-panel" id="internship-list">
          <div className="panel-heading">
            <div>
              <h2>My Internships</h2>
              <p>Review and track your applications.</p>
            </div>
            <span className="record-count">
              {filteredInternships.length} records
            </span>
          </div>

          <div className="table-controls">
            <input
              aria-label="Search internships"
              className="search-input"
              type="search"
              placeholder="Search company, role, location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              aria-label="Filter by status"
              className="filter-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="table-scroll">
            <table className="internship-table">
              <thead>
                <tr>
                  <th>Company / Role</th>
<th>Location</th>
<th>Applied on</th>
<th>Status</th>
<th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      Loading internships...
                    </td>
                  </tr>
                ) : filteredInternships.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No internships found. Add your first opportunity!
                    </td>
                  </tr>
                ) : (
                  filteredInternships.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.companyName}</strong>
                        <small className="role-label">{item.role}</small>
                      </td>
                      <td>{item.location || "—"}</td>
                      <td>{item.applicationDate || "—"}</td>
                      <td>
                        <span
                          className={
                            "status-pill " +
                            String(item.status || "Applied").toLowerCase()
                          }
                        >
                          {item.status || "Applied"}
                        </span>
                      </td>
                      
<td>
  <div className="form-actions">
    <button
      type="button"
      className="secondary-button"
      onClick={() => handleEdit(item)}
    >
      Edit
    </button>

    <button
      type="button"
      className="secondary-button"
      onClick={() => handleDelete(item)}
    >
      Delete
    </button>
  </div>
</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="dashboard-footer">
          Smart Internship Tracker · Stay organized. Keep progressing.
        </footer>
      </main>
    </div>
    
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <article className="stat-card">
      <div className={"stat-icon " + color}>{icon}</div>
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  );
}

export default Dashboard;