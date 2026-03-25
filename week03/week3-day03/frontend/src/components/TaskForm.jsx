import { useState } from "react";

export default function TaskForm({ onAdd, loading }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc]   = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Task title cannot be empty.");
    setError("");
    const ok = await onAdd({ title: title.trim(), description: desc.trim() });
    if (ok) { setTitle(""); setDesc(""); }
  };

  return (
    <div className="task-form-card">
      <h2>➕ Add New Task</h2>
      {error && <div className="alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="task-form-row">
          <input
            type="text"
            placeholder="Task title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="task-form-actions">
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Adding…" : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
