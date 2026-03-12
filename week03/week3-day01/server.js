const express = require("express");
const swaggerUi = require("swagger-ui-express");
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
                url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${PORT}`,
            },
        ],
    },
    apis: [require('path').join(__dirname, "routes", "*.js")], // Path to the API docs
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customSiteTitle: "Project Team & Project Management Portal API Docs",
        swaggerOptions: { persistAuthorization: true },
        customCssUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css",
        customJs: [
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-bundle.js",
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-standalone-preset.js",
        ],
    }),
);

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
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
}

module.exports = app;
