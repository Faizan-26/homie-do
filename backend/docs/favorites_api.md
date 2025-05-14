# Favorite API Documentation

This document outlines the API endpoints for toggling the "favorite" status of various course content items in the Homie-Do application.

## Overview

The application provides a simple way to mark or unmark course content as favorites. Each content type (lectures, readings, assignments, and notes) has its own dedicated endpoint for toggling favorite status.

## Authentication

All endpoints require authentication using a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Toggle Lecture Favorite

```
PATCH /api/subjectsV2/:subjectId/lecture/:lectureId/favorite
```

**Description:** Toggles the favorite status of a lecture (true becomes false, false becomes true)

**URL Parameters:**
- `subjectId`: ID of the subject
- `lectureId`: ID of the lecture

**Response:** Returns the updated subject object

**Example Request:**
```
PATCH /api/subjectsV2/682226088f6c77be94edd83d/lecture/6822283f8f6c77be94edd873/favorite
```

**Example Response:**
```json
{
  "id": "682226088f6c77be94edd83d",
  "name": "Mathematics",
  "courseMaterials": {
    "lectures": [
      {
        "id": "6822283f8f6c77be94edd873",
        "title": "Intro to Calculus",
        "date": "2025-05-12T16:47:27.510Z",
        "content": "Introduction to calculus concepts",
        "isFavorite": true,
        "attachments": []
      }
    ],
    "readings": [],
    "assignments": []
  },
  "notes": []
}
```

### Toggle Reading Favorite

```
PATCH /api/subjectsV2/:subjectId/reading/:readingId/favorite
```

**Description:** Toggles the favorite status of a reading 

**URL Parameters:**
- `subjectId`: ID of the subject
- `readingId`: ID of the reading

**Response:** Returns the updated subject object

### Toggle Assignment Favorite

```
PATCH /api/subjectsV2/:subjectId/assignment/:assignmentId/favorite
```

**Description:** Toggles the favorite status of an assignment

**URL Parameters:**
- `subjectId`: ID of the subject
- `assignmentId`: ID of the assignment

**Response:** Returns the updated subject object

### Toggle Note Favorite

```
PATCH /api/subjectsV2/:subjectId/note/:noteId/favorite
```

**Description:** Toggles the favorite status of a note

**URL Parameters:**
- `subjectId`: ID of the subject
- `noteId`: ID of the note

**Response:** Returns the updated subject object

## Error Handling

All endpoints return standard HTTP status codes:
- `200 OK`: Operation successful
- `404 Not Found`: Subject or content item not found
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Server-side error

Error responses return a JSON object with an error message:

```json
{
  "error": "Subject or lecture not found or not authorized"
}
``` 