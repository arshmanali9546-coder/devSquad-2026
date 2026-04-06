/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error stack trace for debugging

    // Handle JSON parsing errors specifically
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            data: null,
            message: "Invalid JSON format in request body"
        });
    }

    // Default error response for unexpected errors
    res.status(500).json({
        success: false,
        data: null,
        message: "Internal Server Error"
    });
};

module.exports = errorHandler;
