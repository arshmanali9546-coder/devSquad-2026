# Task Manager API

A simple, fast, and beginner-friendly RESTful API for managing tasks, built with Node.js and Express.

## Features
* **In-memory CRUD:** Create, Read, Update, and Delete tasks.
* **Filtering and Statistics:** Filter tasks by search term or get overall completion statistics.
* **UUID Implementation:** Uses unique string IDs instead of basic numbers.
* **Standardized Responses:** Every endpoint follows a consistent `{ success, data, message }` structure.
* **Error Handling:** Centralized global error middleware and request body validation.
* **API Documentation:** Interactive Swagger UI right out of the box.

## Requirements
* Node.js installed on your machine.

## Installation & Setup

1. **Install dependencies:**
    ```bash
    npm install
    ```

2. **Start the server in development mode:**
    ```bash
    npm run devStart
    ```

    The server will start on `http://localhost:3000`. 
    You should see:
    ```
    Server is running on port 3000
    Swagger docs available at http://localhost:3000/api-docs
    ```

## Swagger API Documentation
To explore and test all available endpoints through the browser, visit:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Sample Endpoints & Request Formats

### 1. Get All Tasks
**GET** `/api/tasks`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "e2f8c5b9-1234-abcd-5678-abcdef123456",
      "title": "Learn Express",
      "completed": false
    }
  ],
  "message": "Tasks retrieved successfully"
}
```

### 2. Create a Task
**POST** `/api/tasks`

**Request Body:**
```json
{
  "title": "Build a REST API",
  "completed": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "abc12345-...",
    "title": "Build a REST API",
    "completed": false
  },
  "message": "Task created successfully"
}
```

### 3. Update a Task
**PUT** `/api/tasks/:id`

**Request Body:**
```json
{
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "abc12345-...",
    "title": "Build a REST API",
    "completed": true
  },
  "message": "Task updated successfully"
}
```

### 4. Delete a Task
**DELETE** `/api/tasks/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Task deleted successfully"
}
```

### 5. Filter Tasks (Stretch Goal)
**GET** `/api/tasks?title=REST`
Filters and returns tasks containing the word "REST".

### 6. Get Task Statistics (Stretch Goal)
**GET** `/api/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "completed": 2,
    "pending": 3
  },
  "message": "Task statistics retrieved successfully"
}
```

## Postman Testing
At the root of the project, you will find a `Task_Manager_API.postman_collection.json` file.
1. Open Postman.
2. Click **Import** at the top left.
3. Select this JSON file.
4. Test all the pre-configured endpoints directly!
