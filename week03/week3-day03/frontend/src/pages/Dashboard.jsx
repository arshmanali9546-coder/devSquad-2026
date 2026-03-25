import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  const navigate = useNavigate();
  const userRaw  = localStorage.getItem("user");
  const user     = userRaw ? JSON.parse(userRaw) : null;

  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding,  setAdding]  = useState(false);

  // ── Fetch tasks ──────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get("/api/tasks");
      setTasks(data);
    } catch {
      // Token likely invalid → redirect
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Logout ───────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ── Add task ─────────────────────────────────────────────────
  const handleAdd = async ({ title, description }) => {
    setAdding(true);
    try {
      const { data } = await api.post("/api/tasks", { title, description });
      setTasks((prev) => [data, ...prev]);
      return true;
    } catch {
      return false;
    } finally {
      setAdding(false);
    }
  };

  // ── Toggle complete ──────────────────────────────────────────
  const handleToggle = async (id, completed) => {
    try {
      const { data } = await api.put(`/api/tasks/${id}`, { completed });
      setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    } catch { /* silent */ }
  };

  // ── Edit task ────────────────────────────────────────────────
  const handleEdit = async (id, updates) => {
    try {
      const { data } = await api.put(`/api/tasks/${id}`, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    } catch { /* silent */ }
  };

  // ── Delete task ──────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch { /* silent */ }
  };

  // Stats
  const done    = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - done;

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <span className="navbar-brand">Netixsol — Task Manager</span>
        <div className="navbar-right">
          <span className="navbar-user">👤 {user?.name || user?.email}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* ── Main ── */}
      <div className="dashboard">
        <div className="dash-container">
          <div className="dash-header">
            <h1>My Tasks</h1>
            <p>Welcome back, {user?.name || "there"}! Here's your task overview.</p>
          </div>

          {/* Stats row */}
          <div className="dash-stats">
            <div className="stat-card">
              <div className="stat-num">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card done">
              <div className="stat-num">{done}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card pending">
              <div className="stat-num">{pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          {/* Add task form */}
          <TaskForm onAdd={handleAdd} loading={adding} />

          {/* Task list */}
          {loading ? (
            <div className="spinner-wrap">
              <div className="spinner" />
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </>
  );
}
