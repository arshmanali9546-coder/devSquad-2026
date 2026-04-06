import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <button 
        className="toggle-btn" 
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed ? (
          <CheckCircle2 className="icon checked" />
        ) : (
          <Circle className="icon" />
        )}
      </button>
      
      <span className="task-title">{task.title}</span>
      
      <button 
        className="delete-btn" 
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        <Trash2 className="icon" />
      </button>
    </div>
  );
}
