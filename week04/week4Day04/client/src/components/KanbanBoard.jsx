import React, { useState } from 'react';
import { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from '../services/taskApi';
import { Plus, Trash2, CheckCircle, Clock, ListTodo } from 'lucide-react';

const KanbanBoard = () => {
  const { data: tasks = [], isLoading, isError } = useGetTasksQuery();
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const columns = [
    { id: 'todo', title: 'To Do', icon: <ListTodo size={20} /> },
    { id: 'in-progress', title: 'In Progress', icon: <Clock size={20} /> },
    { id: 'done', title: 'Done', icon: <CheckCircle size={20} /> },
  ];

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask({ title: newTaskTitle, status: 'todo', description: '' });
    setNewTaskTitle('');
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateTask({ id, status: newStatus });
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
  };

  if (isLoading) return <div className="loading">Loading Board...</div>;
  if (isError) return <div className="error">Error loading tasks.</div>;

  return (
    <div className="kanban-wrapper">
      <header className="header">
        <h1>Netixsol <span>Docs</span></h1>
        <form onSubmit={handleAddTask} className="add-task-form">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button type="submit">
            <Plus size={20} /> Add Task
          </button>
        </form>
      </header>

      <div className="board">
        {columns.map((column) => (
          <div key={column.id} className="column">
            <div className="column-header">
              {column.icon}
              <h2>{column.title}</h2>
              <span className="task-count">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>
            <div className="task-list">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-content">
                      <h3>{task.title}</h3>
                      <p>{task.description || 'No description'}</p>
                    </div>
                    <div className="task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        {columns.map((col) => (
                          <option key={col.id} value={col.id}>
                            {col.title}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => handleDelete(task.id)} className="delete-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
