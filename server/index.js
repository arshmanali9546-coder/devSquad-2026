const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

let tasks = [
  { id: '1', title: 'Setup Project', description: 'Initialize the project structure', status: 'done' },
  { id: '2', title: 'Implement RTK Query', description: 'Create API slice and hooks', status: 'in-progress' },
  { id: '3', title: 'Implement Socket.IO', description: 'Enable real-time updates', status: 'todo' },
];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const newTask = { id: Date.now().toString(), ...req.body };
  tasks.push(newTask);
  io.emit('task-added', newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const updatedTask = req.body;
  tasks = tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task));
  io.emit('task-updated', { id, ...updatedTask });
  res.json({ id, ...updatedTask });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== id);
  io.emit('task-deleted', id);
  res.status(204).end();
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
