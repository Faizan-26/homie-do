# Homie-Do Backend API Documentation

This document outlines all available API endpoints for the Homie-Do backend system.

## Base URL

All API endpoints are prefixed with: `/api`
Base URL: `http://localhost:5000`

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
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "name": "Web Development",
    "description": "Learn HTML, CSS, JavaScript",
    "instructor": "Jane Smith"
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error`

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
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
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
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

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
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "name": "Advanced Web Development",
    "description": "Learn React, Node.js, MongoDB",
    "instructor": "John Smith"
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

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
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

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

## Unit API

### Add Unit to Subject

- **URL**: `/api/subjects/:id/units`
- **Method**: `POST`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "name": "Unit 1: Introduction",
    "description": "Getting started with the basics"
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/subjects/${subjectId}/units`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: "Unit 1: Introduction",
    description: "Getting started with the basics",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get Units for Subject

- **URL**: `/api/subjects/:id/units`
- **Method**: `GET`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/subjects/${subjectId}/units`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Update Unit

- **URL**: `/api/subjects/:id/units/:unitId`
- **Method**: `PUT`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "name": "Unit 1: Advanced Introduction",
    "description": "Updated content for this unit"
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
const unitId = "60b2c3d4e5f6a7b8c9d0e1f";
fetch(`http://localhost:5000/api/subjects/${subjectId}/units/${unitId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: "Unit 1: Advanced Introduction",
    description: "Updated content for this unit",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Delete Unit

- **URL**: `/api/subjects/:id/units/:unitId`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
const unitId = "60b2c3d4e5f6a7b8c9d0e1f";
fetch(`http://localhost:5000/api/subjects/${subjectId}/units/${unitId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## Chapter API

### Add Chapter to Unit

- **URL**: `/api/subjects/:id/units/:unitId/chapters`
- **Method**: `POST`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "name": "Chapter 1: Getting Started",
    "description": "Introduction to the chapter",
    "content": "Chapter content goes here..."
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
const unitId = "60b2c3d4e5f6a7b8c9d0e1f";
fetch(
  `http://localhost:5000/api/subjects/${subjectId}/units/${unitId}/chapters`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: "Chapter 1: Getting Started",
      description: "Introduction to the chapter",
      content: "Chapter content goes here...",
    }),
  }
)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get Chapters for Unit

- **URL**: `/api/subjects/:id/units/:unitId/chapters`
- **Method**: `GET`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
const unitId = "60b2c3d4e5f6a7b8c9d0e1f";
fetch(
  `http://localhost:5000/api/subjects/${subjectId}/units/${unitId}/chapters`,
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

### Update Chapter

- **URL**: `/api/subjects/:id/units/:unitId/chapters/:chapterId`
- **Method**: `PUT`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "name": "Chapter 1: Updated Title",
    "description": "Updated description",
    "content": "Updated content for this chapter"
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
const unitId = "60b2c3d4e5f6a7b8c9d0e1f";
const chapterId = "60c3d4e5f6a7b8c9d0e1f2";
fetch(
  `http://localhost:5000/api/subjects/${subjectId}/units/${unitId}/chapters/${chapterId}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: "Chapter 1: Updated Title",
      description: "Updated description",
      content: "Updated content for this chapter",
    }),
  }
)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Delete Chapter

- **URL**: `/api/subjects/:id/units/:unitId/chapters/:chapterId`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
const unitId = "60b2c3d4e5f6a7b8c9d0e1f";
const chapterId = "60c3d4e5f6a7b8c9d0e1f2";
fetch(
  `http://localhost:5000/api/subjects/${subjectId}/units/${unitId}/chapters/${chapterId}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## Lecture API

### Add Lecture to Subject

- **URL**: `/api/subjects/:id/lectures`
- **Method**: `POST`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "title": "Introduction to Web Development",
    "date": "2023-04-15T10:00:00Z",
    "description": "First lecture covering basics",
    "notes": "Lecture notes here..."
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/subjects/${subjectId}/lectures`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Introduction to Web Development",
    date: "2023-04-15T10:00:00Z",
    description: "First lecture covering basics",
    notes: "Lecture notes here...",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get Lectures for Subject

- **URL**: `/api/subjects/:id/lectures`
- **Method**: `GET`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/subjects/${subjectId}/lectures`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Update Lecture

- **URL**: `/api/subjects/:id/lectures/:lectureId`
- **Method**: `PUT`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "title": "Updated Lecture Title",
    "date": "2023-04-16T10:00:00Z",
    "description": "Updated description",
    "notes": "Updated lecture notes"
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
const lectureId = "60d4e5f6a7b8c9d0e1f2g3";
fetch(`http://localhost:5000/api/subjects/${subjectId}/lectures/${lectureId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Updated Lecture Title",
    date: "2023-04-16T10:00:00Z",
    description: "Updated description",
    notes: "Updated lecture notes",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Delete Lecture

- **URL**: `/api/subjects/:id/lectures/:lectureId`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
const lectureId = "60d4e5f6a7b8c9d0e1f2g3";
fetch(`http://localhost:5000/api/subjects/${subjectId}/lectures/${lectureId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## Reading API

### Add Reading to Subject

- **URL**: `/api/subjects/:id/readings`
- **Method**: `POST`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "title": "HTML & CSS: Design and Build Websites",
    "author": "Jon Duckett",
    "description": "Essential reading for web development",
    "url": "https://example.com/book-link",
    "pages": "Chapters 1-3"
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/subjects/${subjectId}/readings`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "HTML & CSS: Design and Build Websites",
    author: "Jon Duckett",
    description: "Essential reading for web development",
    url: "https://example.com/book-link",
    pages: "Chapters 1-3",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get Readings for Subject

- **URL**: `/api/subjects/:id/readings`
- **Method**: `GET`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/subjects/${subjectId}/readings`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Update Reading

- **URL**: `/api/subjects/:id/readings/:readingId`
- **Method**: `PUT`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "title": "Updated Reading Title",
    "author": "Updated Author Name",
    "description": "Updated description",
    "url": "https://example.com/updated-link",
    "pages": "Chapters 1-5"
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
const readingId = "60e5f6a7b8c9d0e1f2g3h4";
fetch(`http://localhost:5000/api/subjects/${subjectId}/readings/${readingId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Updated Reading Title",
    author: "Updated Author Name",
    description: "Updated description",
    url: "https://example.com/updated-link",
    pages: "Chapters 1-5",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Delete Reading

- **URL**: `/api/subjects/:id/readings/:readingId`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
const readingId = "60e5f6a7b8c9d0e1f2g3h4";
fetch(`http://localhost:5000/api/subjects/${subjectId}/readings/${readingId}`, {
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

### Add Assignment to Subject

- **URL**: `/api/subjects/:id/assignments`
- **Method**: `POST`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "title": "Assignment 1: Web Page Design",
    "description": "Create a simple HTML/CSS page",
    "dueDate": "2023-04-30T23:59:59Z",
    "points": 100,
    "instructions": "Detailed instructions here..."
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/subjects/${subjectId}/assignments`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Assignment 1: Web Page Design",
    description: "Create a simple HTML/CSS page",
    dueDate: "2023-04-30T23:59:59Z",
    points: 100,
    instructions: "Detailed instructions here...",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Get Assignments for Subject

- **URL**: `/api/subjects/:id/assignments`
- **Method**: `GET`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
fetch(`http://localhost:5000/api/subjects/${subjectId}/assignments`, {
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

- **URL**: `/api/subjects/:id/assignments/:assignmentId`
- **Method**: `PUT`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "title": "Updated Assignment Title",
    "description": "Updated description",
    "dueDate": "2023-05-15T23:59:59Z",
    "points": 150,
    "instructions": "Updated detailed instructions..."
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
const assignmentId = "60f6a7b8c9d0e1f2g3h4i5";
fetch(
  `http://localhost:5000/api/subjects/${subjectId}/assignments/${assignmentId}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: "Updated Assignment Title",
      description: "Updated description",
      dueDate: "2023-05-15T23:59:59Z",
      points: 150,
      instructions: "Updated detailed instructions...",
    }),
  }
)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Delete Assignment

- **URL**: `/api/subjects/:id/assignments/:assignmentId`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
- **Error Response**: `401 Unauthorized`, `500 Internal Server Error`

**Example Request (JavaScript):**

```javascript
const token = localStorage.getItem("token");
const subjectId = "60a1b2c3d4e5f6a7b8c9d0e1";
const assignmentId = "60f6a7b8c9d0e1f2g3h4i5";
fetch(
  `http://localhost:5000/api/subjects/${subjectId}/assignments/${assignmentId}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)
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
