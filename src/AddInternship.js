
import { useState } from "react";
import api from "./api";
import "./AddInternship.css";

const initialForm = {
  companyName: "",
  role: "",
  location: "",
  applicationLink: "",
  applicationDate: "",
  deadline: "",
  interviewDate: "",
  followUpDate: "",
  status: "Applied",
  notes: ""
};

function AddInternship({ onSaved, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!form.companyName.trim() || !form.role.trim()) {
      setMessage("Company name and role are required.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/internships", form);
      setForm(initialForm);
      onSaved();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Could not save internship. Check that the backend is running."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="internship-form-card">
      <h2>Add Internship</h2>
      <p>Record an opportunity and the dates you want to remember.</p>

      <form onSubmit={handleSubmit} className="internship-form">
        <label>
          Company name *
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="e.g. Infosys"
            required
          />
        </label>

        <label>
          Internship role *
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="e.g. Java Developer Intern"
            required
          />
        </label>

        <label>
          Location
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Hyderabad or Remote"
          />
        </label>

        <label>
          Application link
          <input
            type="url"
            name="applicationLink"
            value={form.applicationLink}
            onChange={handleChange}
            placeholder="https://..."
          />
        </label>

        <label>
          Application date
          <input
            type="date"
            name="applicationDate"
            value={form.applicationDate}
            onChange={handleChange}
          />
        </label>

        <label>
          Application deadline
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </label>

        <label>
          Interview date
          <input
            type="date"
            name="interviewDate"
            value={form.interviewDate}
            onChange={handleChange}
          />
        </label>

        <label>
          Follow-up date
          <input
            type="date"
            name="followUpDate"
            value={form.followUpDate}
            onChange={handleChange}
          />
        </label>

        <label>
          Application status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Planning">Planning</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </label>

        <label className="full-width">
          Notes
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Add preparation notes or follow-up details..."
            rows="3"
          />
        </label>

        {message && (
          <p className="form-message full-width">{message}</p>
        )}

        <div className="form-actions full-width">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Internship"}
          </button>

          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddInternship;