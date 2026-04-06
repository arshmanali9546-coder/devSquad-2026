import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, LayoutList } from 'lucide-react';
import type { Task } from './types';
import { TaskItem } from './components/TaskItem';
import './App.css';

const API_URL = 'https://week04day02backend.vercel.app/api/tasks';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Could not load tasks from the server.');
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setError('Task title is required.');
      return;
    }
    setError(null);

    try {
      const response = await axios.post(API_URL, { title: newTaskTitle });
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
    } catch (err: any) {
      console.error('Failed to add task:', err);
      setError(err.response?.data?.error || 'Could not add task.');
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`);
      setTasks(tasks.map(t => (t.id === id ? response.data : t)));
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="app-container">
      <div className="todo-wrapper">
        <header className="header">
          <h1>
            <LayoutList className="header-icon" />
            Todo List
          </h1>
          <p className="subtitle">Manage your daily tasks</p>
        </header>

        <main>
          <div className="stats-container">
            <div className="stat-box origin-pending">
              <span className="stat-number">{pendingCount}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-box origin-completed">
              <span className="stat-number">{completedCount}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <form className="add-task-form" onSubmit={addTask}>
            <input
              type="text"
              className="task-input"
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button type="submit" className="add-btn" aria-label="Add task">
              <PlusCircle className="add-icon" />
              Add
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}

          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks found. Add a new one to get started!</p>
              </div>
            ) : (
              tasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTask} 
                  onDelete={deleteTask} 
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
