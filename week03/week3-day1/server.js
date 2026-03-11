const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Swagger documentation setup
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Manager API",
            version: "1.0.0",
            description: "A simple RESTful API to manage tasks, built with Node.js and Express.",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

// Mount Task API Routes
app.use("/api", taskRoutes);

// Base route for testing
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Task Manager API! Visit /api-docs for documentation." });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Fallback route for undefined endpoints (Express 5 requires named param for wildcard)
app.all("/{*splat}", (req, res) => {
    res.status(404).json({
        success: false,
        data: null,
        message: "Endpoint not found"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
