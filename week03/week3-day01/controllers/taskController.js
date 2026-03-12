const TaskModel = require('../models/taskModel');

// @desc    Get all tasks
// @route   GET /api/tasks
const getTasks = (req, res) => {
    const { title } = req.query; // For optional search by title
    const tasks = TaskModel.getAll(title);

    res.status(200).json({
        success: true,
        data: tasks,
        message: "Tasks retrieved successfully"
    });
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
const getTaskById = (req, res) => {
    const { id } = req.params;
    const task = TaskModel.getById(id);

    if (!task) {
        return res.status(404).json({
            success: false,
            data: null,
            message: `Task with id ${id} not found`
        });
    }

    res.status(200).json({
        success: true,
        data: task,
        message: "Task retrieved successfully"
    });
};

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = (req, res) => {
    const { title, completed } = req.body;

    const newTask = TaskModel.create(title, completed);

    res.status(201).json({
        success: true,
        data: newTask,
        message: "Task created successfully"
    });
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
const updateTask = (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const updatedTask = TaskModel.update(id, updates);

    if (!updatedTask) {
        return res.status(404).json({
            success: false,
            data: null,
            message: `Task with id ${id} not found`
        });
    }

    res.status(200).json({
        success: true,
        data: updatedTask,
        message: "Task updated successfully"
    });
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = (req, res) => {
    const { id } = req.params;

    const isDeleted = TaskModel.delete(id);

    if (!isDeleted) {
        return res.status(404).json({
            success: false,
            data: null,
            message: `Task with id ${id} not found`
        });
    }

    res.status(200).json({
        success: true,
        data: null,
        message: "Task deleted successfully"
    });
};

// @desc    Get task statistics
// @route   GET /api/stats
const getTaskStats = (req, res) => {
    const stats = TaskModel.getStats();

    res.status(200).json({
        success: true,
        data: stats,
        message: "Task statistics retrieved successfully"
    });
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
};
