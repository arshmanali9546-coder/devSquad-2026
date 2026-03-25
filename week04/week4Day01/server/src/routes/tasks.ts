import { Router, Request, Response } from 'express';
import { Task } from '../types';

const router = Router();

// In-memory data store
let tasks: Task[] = [];
let nextId = 1;

// GET /api/tasks -> return all tasks
router.get('/', async (req: Request, res: Response): Promise<void> => {
  res.json(tasks);
});

// POST /api/tasks -> add task (validate required fields)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ error: 'Task title is required and must be a non-empty string.' });
    return;
  }

  const newTask: Task = {
    id: nextId.toString(),
    title: title.trim(),
    completed: false,
  };

  tasks.push(newTask);
  nextId++;

  res.status(201).json(newTask);
});

// PUT /api/tasks/:id -> update task (mark complete/incomplete)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  // Toggle completion status
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  
  res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id -> delete task
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

export default router;
