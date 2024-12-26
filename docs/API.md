# Delilah Agentic API Documentation

## Overview
This document describes the REST API endpoints provided by Delilah Agentic.

## Authentication
All API requests require authentication using Bearer tokens.

```http
Authorization: Bearer <your_token>
```

## Endpoints

### Assessment API

#### Create Assessment
```http
POST /api/v1/assessments
```

**Request Body:**
```json
{
  "patientId": "string",
  "assessmentType": "string",
  "notes": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "status": "pending",
  "createdAt": "string"
}
```

### Analysis API

#### Process Assessment
```http
POST /api/v1/analysis/process
```

**Request Body:**
```json
{
  "assessmentId": "string",
  "parameters": {
    "depth": "string",
    "focus": "string"
  }
}
```

### Report API

#### Generate Report
```http
POST /api/v1/reports/generate
```

**Request Body:**
```json
{
  "analysisId": "string",
  "format": "string",
  "template": "string"
}
```

## Error Handling
All endpoints follow standard HTTP status codes and include detailed error messages.

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```