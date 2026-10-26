# Event Registration Admin Panel

A MERN app for managing events and viewing registration totals.

## Features

- Dashboard showing event ID, name, date, venue, and registration total
- Add, update, and delete events
- Responsive dashboard and event form
- MongoDB Atlas connection
- Express API for events and registrations

## Project structure

- `frontend` — React app built with Vite
- `backend` — Express API and Mongoose event model

## Run locally

Create `backend/.env` with your exam test database connection string:

    PORT=5000
    MONGO_URI=your_exam_test_atlas_connection_string

### Backend

    cd backend
    npm install
    npm run dev

### Frontend

Open a second terminal:

    cd frontend
    npm install
    npm run dev

Open the local address printed by Vite.

## API routes

- `GET /api/events` — list events
- `GET /api/events/:id` — get one event
- `POST /api/events` — add an event
- `PUT /api/events/:id` — update an event
- `DELETE /api/events/:id` — delete an event
- `POST /api/events/:id/registrations` — add a registration