import { useState } from "react";

function EditModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc]   = useState(task.description);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>✏️ Edit Task</h2>
        <div className="field-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="field-group">
          <label>Description</label>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={() => onSave(task.id, { title, description: desc })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TaskList({ tasks, onDelete, onToggle, onEdit }) {
  const [editing, setEditing] = useState(null);

  const handleSave = (id, data) => {
    onEdit(id, data);
    setEditing(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="task-list-section">
        <h2>📋 Your Tasks</h2>
        <div className="task-empty">
          <span>📝</span>
          No tasks yet — add your first task above!
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-section">
      <h2>📋 Your Tasks ({tasks.length})</h2>

      {tasks.map((task) => (
        <div key={task.id} className={`task-card ${task.completed ? "completed" : ""}`}>
          {/* Checkbox */}
          <div
            className={`task-check ${task.completed ? "checked" : ""}`}
            onClick={() => onToggle(task.id, !task.completed)}
            title={task.completed ? "Mark as pending" : "Mark as complete"}
          />

          {/* Body */}
          <div className="task-body">
            <div className={`task-title ${task.completed ? "done" : ""}`}>{task.title}</div>
            {task.description && <div className="task-desc">{task.description}</div>}
            <div className="task-meta">
              {new Date(task.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </div>
            <span className={`task-badge ${task.completed ? "badge-done" : "badge-pending"}`}>
              {task.completed ? "✅ Completed" : "🕐 Pending"}
            </span>
          </div>

          {/* Actions */}
          <div className="task-actions">
            <button
              className="btn-icon"
              title="Edit task"
              onClick={() => setEditing(task)}
            >✏️</button>
            <button
              className="btn-icon delete"
              title="Delete task"
              onClick={() => onDelete(task.id)}
            >🗑️</button>
          </div>
        </div>
      ))}

      {editing && (
        <EditModal
          task={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
