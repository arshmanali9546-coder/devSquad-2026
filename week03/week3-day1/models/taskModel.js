const { v4: uuidv4 } = require('uuid');

// In-memory array to store tasks
let tasks = [
    {
        id: uuidv4(),
        title: "Learn Express",
        completed: false
    }
];

// Model functions
const TaskModel = {
    // Get all tasks (can be filtered by title)
    getAll: (titleFilter) => {
        if (titleFilter) {
            return tasks.filter(task =>
                task.title.toLowerCase().includes(titleFilter.toLowerCase())
            );
        }
        return tasks;
    },

    // Get a single task by ID
    getById: (id) => {
        return tasks.find(task => task.id === id);
    },

    // Create a new task
    create: (title, completed = false) => {
        const newTask = {
            id: uuidv4(),
            title,
            completed
        };
        tasks.push(newTask);
        return newTask;
    },

    // Update an existing task
    update: (id, updates) => {
        const taskIndex = tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            return null; // Task not found
        }

        // Update the task properties
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        return tasks[taskIndex];
    },

    // Delete a task
    delete: (id) => {
        const initialLength = tasks.length;
        tasks = tasks.filter(task => task.id !== id);

        // Return true if an item was deleted, false otherwise
        return initialLength > tasks.length;
    },

    // Get statistics
    getStats: () => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;

        return { total, completed, pending };
    }
};

module.exports = TaskModel;
