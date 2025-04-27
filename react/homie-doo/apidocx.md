# Homie-Do Backend API Documentation

This document outlines all available API endpoints for the Homie-Do backend system.

## Base URL

All API endpoints are prefixed with: `/api`

## Authentication Endpoints

### Register User

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `400 Bad Request`

**Example Request (JavaScript):**

```javascript
fetch("http://localhost:5000/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Login User

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK` with JWT token
- **Error Response**: `401 Unauthorized`

**Example Request (JavaScript):**

```javascript
fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "john.doe@example.com",
    password: "password123",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    // Store the token
    localStorage.setItem("token", data.token);
    console.log(data);
  })
  .catch((error) => console.error("Error:", error));
```

### Forgot Password

- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**: `404 Not Found`

**Example Request (JavaScript):**

```javascript
fetch("http://localhost:5000/api/auth/forgot-password", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "john.doe@example.com",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Reset Password

- **URL**: `/api/auth/reset-password/:token`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "password": "newpassword123"
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**: `400 Bad Request`

**Example Request (JavaScript):**

```javascript
const token = "reset_token_received_via_email";
fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    password: "newpassword123",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## Subject API

### Create Subject

- **URL**: `/api/subjects`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "name": "Web Development",
    "description": "Learn HTML, CSS, JavaScript",
    "instructor": "Jane Smith",
    "userId": "60a1b2c3d4e5f6a7b8c9d0e1"
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `400 Bad Request`, `401 Unauthorized`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/subjects", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: "Web Development",
    description: "Learn HTML, CSS, JavaScript",
    instructor: "Jane Smith",
    userId: "60a1b2c3d4e5f6a7b8c9d0e1",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get All Subjects

- **URL**: `/api/subjects`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/subjects", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get Subject by ID

- **URL**: `/api/subjects/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/subjects/${subjectId}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Update Subject

- **URL**: `/api/subjects/:id`
- **Method**: `PUT`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "name": "Advanced Web Development",
    "description": "Learn React, Node.js, MongoDB",
    "instructor": "John Smith"
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/subjects/${subjectId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: "Advanced Web Development",
    description: "Learn React, Node.js, MongoDB",
    instructor: "John Smith",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Delete Subject

- **URL**: `/api/subjects/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/subjects/${subjectId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get User's Subjects

- **URL**: `/api/subjects/user/:userId`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const userId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/subjects/user/${userId}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Enroll User in Subject

- **URL**: `/api/subjects/enroll`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "userId": "60a1b2c3d4e5f6a7b8c9d0e1",
    "subjectId": "60a1b2c3d4e5f6a7b8c9d0e2"
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/subjects/enroll", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    userId: "60a1b2c3d4e5f6a7b8c9d0e1",
    subjectId: "60a1b2c3d4e5f6a7b8c9d0e2",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Unenroll User from Subject

- **URL**: `/api/subjects/unenroll/:userId/:subjectId`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const userId = "60a1b2c3d4e5f6a7b8c9d0e1";
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e2";
fetch(`http://localhost:5000/api/subjects/unenroll/${userId}/${subjectId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## Assignment API

### Create Assignment

- **URL**: `/api/assignments`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "title": "Final Project",
    "description": "Build a full-stack web application",
    "dueDate": "2023-12-31T23:59:59Z",
    "points": 100,
    "subjectId": "60a1b2c3d4e5f6a7b8c9d0e1",
    "instructions": "Create a React app with Node.js backend"
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/assignments", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Final Project",
    description: "Build a full-stack web application",
    dueDate: "2023-12-31T23:59:59Z",
    points: 100,
    subjectId: "60a1b2c3d4e5f6a7b8c9d0e1",
    instructions: "Create a React app with Node.js backend",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get All Assignments

- **URL**: `/api/assignments`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/assignments", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get Assignments by Subject

- **URL**: `/api/assignments/subject/:subjectId`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/assignments/subject/${subjectId}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get Assignment by ID

- **URL**: `/api/assignments/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const assignmentId = "60a1b2c3d4e5f6a7b8c9d0e3";
fetch(`http://localhost:5000/api/assignments/${assignmentId}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Update Assignment

- **URL**: `/api/assignments/:id`
- **Method**: `PUT`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "title": "Updated Final Project",
    "description": "Build a full-stack web application with testing",
    "dueDate": "2024-01-15T23:59:59Z",
    "points": 120,
    "instructions": "Create a React app with Node.js backend and unit tests"
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const assignmentId = "60a1b2c3d4e5f6a7b8c9d0e3";
fetch(`http://localhost:5000/api/assignments/${assignmentId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Updated Final Project",
    description: "Build a full-stack web application with testing",
    dueDate: "2024-01-15T23:59:59Z",
    points: 120,
    instructions: "Create a React app with Node.js backend and unit tests",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Delete Assignment

- **URL**: `/api/assignments/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const assignmentId = "60a1b2c3d4e5f6a7b8c9d0e3";
fetch(`http://localhost:5000/api/assignments/${assignmentId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## Document File API

### Create Document File

- **URL**: `/api/document-files`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "name": "Lecture Notes.pdf",
    "fileUrl": "https://example.com/files/lecture-notes.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "userId": "60a1b2c3d4e5f6a7b8c9d0e1"
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `400 Bad Request`, `401 Unauthorized`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/document-files", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: "Lecture Notes.pdf",
    fileUrl: "https://example.com/files/lecture-notes.pdf",
    fileType: "application/pdf",
    fileSize: 1024000,
    userId: "60a1b2c3d4e5f6a7b8c9d0e1",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get All Document Files

- **URL**: `/api/document-files`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/document-files", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get Document Files by User

- **URL**: `/api/document-files/user/:userId`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const userId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/document-files/user/${userId}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get Document File by ID

- **URL**: `/api/document-files/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const fileId = "60a1b2c3d4e5f6a7b8c9d0e4";
fetch(`http://localhost:5000/api/document-files/${fileId}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Update Document File

- **URL**: `/api/document-files/:id`
- **Method**: `PUT`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "name": "Updated Lecture Notes.pdf",
    "fileUrl": "https://example.com/files/updated-lecture-notes.pdf",
    "fileType": "application/pdf",
    "fileSize": 2048000
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const fileId = "60a1b2c3d4e5f6a7b8c9d0e4";
fetch(`http://localhost:5000/api/document-files/${fileId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: "Updated Lecture Notes.pdf",
    fileUrl: "https://example.com/files/updated-lecture-notes.pdf",
    fileType: "application/pdf",
    fileSize: 2048000,
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Delete Document File

- **URL**: `/api/document-files/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const fileId = "60a1b2c3d4e5f6a7b8c9d0e4";
fetch(`http://localhost:5000/api/document-files/${fileId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## User Notes API

### Create User Note

- **URL**: `/api/user-notes`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "title": "Database Design Notes",
    "content": "Normalization is the process of...",
    "userId": "60a1b2c3d4e5f6a7b8c9d0e1",
    "subjectId": "60a1b2c3d4e5f6a7b8c9d0e1",
    "tags": ["database", "normalization", "SQL"]
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/user-notes", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Database Design Notes",
    content: "Normalization is the process of...",
    userId: "60a1b2c3d4e5f6a7b8c9d0e1",
    subjectId: "60a1b2c3d4e5f6a7b8c9d0e1",
    tags: ["database", "normalization", "SQL"],
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get All User Notes

- **URL**: `/api/user-notes`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/user-notes", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get User Notes by User

- **URL**: `/api/user-notes/user/:userId`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const userId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/user-notes/user/${userId}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get User Notes by Subject

- **URL**: `/api/user-notes/subject/:subjectId`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/user-notes/subject/${subjectId}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get User Notes by User and Subject

- **URL**: `/api/user-notes/user/:userId/subject/:subjectId`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const userId = "60a1b2c3d4e5f6a7b8c9d0e1";
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(
  `http://localhost:5000/api/user-notes/user/${userId}/subject/${subjectId}`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get User Note by ID

- **URL**: `/api/user-notes/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const noteId = "60a1b2c3d4e5f6a7b8c9d0e5";
fetch(`http://localhost:5000/api/user-notes/${noteId}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Update User Note

- **URL**: `/api/user-notes/:id`
- **Method**: `PUT`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "title": "Updated Database Design Notes",
    "content": "Normalization is the process of organizing data to reduce redundancy...",
    "tags": ["database", "normalization", "SQL", "RDBMS"]
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const noteId = "60a1b2c3d4e5f6a7b8c9d0e5";
fetch(`http://localhost:5000/api/user-notes/${noteId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Updated Database Design Notes",
    content:
      "Normalization is the process of organizing data to reduce redundancy...",
    tags: ["database", "normalization", "SQL", "RDBMS"],
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Delete User Note

- **URL**: `/api/user-notes/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const noteId = "60a1b2c3d4e5f6a7b8c9d0e5";
fetch(`http://localhost:5000/api/user-notes/${noteId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Response Format

```json
{
  "message": "Error message explaining what went wrong"
}
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token can be obtained from the login endpoint.

## Using Axios

If you prefer using Axios instead of fetch, here's an example:

```javascript
import axios from "axios";

// Set the base URL
axios.defaults.baseURL = "http://localhost:5000";

// Add a request interceptor to include the token in all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Example: Login
axios
  .post("/api/auth/login", {
    email: "john.doe@example.com",
    password: "password123",
  })
  .then((response) => {
    localStorage.setItem("token", response.data.token);
    console.log(response.data);
  })
  .catch((error) => console.error("Error:", error));

// Example: Get all subjects
axios
  .get("/api/subjects")
  .then((response) => console.log(response.data))
  .catch((error) => console.error("Error:", error));
```
