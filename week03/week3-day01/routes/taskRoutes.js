const express = require('express');
const router = express.Router();
const validateTask = require('../middlewares/validateTask');
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
} = require('../controllers/taskController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated UUID of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         completed:
 *           type: boolean
 *           description: The status of the task
 *       example:
 *         id: "d5fE_asz"
 *         title: "Learn Express"
 *         completed: false
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: The tasks managing API
 */

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get task statistics
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Task statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     completed:
 *                       type: integer
 *                     pending:
 *                       type: integer
 *                 message:
 *                   type: string
 */
router.get('/stats', getTaskStats);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Returns the list of all the tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter tasks by title
 *     responses:
 *       200:
 *         description: The list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 */
router.get('/tasks', getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get the task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task description by id
 *       404:
 *         description: The task was not found
 */
router.get('/tasks/:id', getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *             example:
 *               title: "New Task"
 *               completed: false
 *     responses:
 *       201:
 *         description: The task was successfully created
 *       400:
 *         description: Validation error
 */
router.post('/tasks', validateTask, createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update the task by the id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *             example:
 *               title: "Updated Task Title"
 *               completed: true
 *     responses:
 *       200:
 *         description: The task was updated
 *       404:
 *         description: The task was not found
 *       400:
 *         description: Validation error
 */
router.put('/tasks/:id', validateTask, updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Remove the task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task was deleted
 *       404:
 *         description: The task was not found
 */
router.delete('/tasks/:id', deleteTask);

module.exports = router;
