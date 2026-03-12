/**
 * Middleware to validate task creation and update requests.
 */
const validateTask = (req, res, next) => {
    // We only need to validate POST and PUT requests
    if (req.method === 'POST' || req.method === 'PUT') {
        const { title, completed } = req.body;

        // If it's a POST request or if title is provided in a PUT request, validate it
        if (req.method === 'POST') {
            if (!title) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "Title is required"
                });
            }
        }

        if (title !== undefined && typeof title !== 'string') {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Title must be a string"
            });
        }

        if (title !== undefined && title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Title cannot be empty"
            });
        }

        // Validate completed if it's provided
        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Completed must be a boolean"
            });
        }
    }

    // Pass control to the next middleware or route handler
    next();
};

module.exports = validateTask;
