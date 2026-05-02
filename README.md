# HelpDesk Ticketing System

A full-stack help desk ticketing system built with React, Node.js, Express, Prisma, and JWT authentication. The application supports ticket management, role-based access control, admin user management, audit logs, persistent login, advanced ticket filtering, and a searchable knowledge base.

## Project Overview

This project was built as a realistic internal IT help desk application. It allows users to log in, create and manage support tickets, assign tickets to technicians, track ticket status, manage users, review audit logs, and maintain a knowledge base for common troubleshooting issues.

The project demonstrates full-stack development using a React frontend, Express backend, Prisma ORM, JSON Web Token authentication, role-based access control, protected backend routes, and environment-based configuration.

## Portfolio Highlights

- Built a full-stack React and Node.js help desk application
- Implemented JWT authentication with persistent login
- Added role-based access control for admin and technician users
- Created ticket CRUD functionality with status updates and assignment tools
- Built admin user management with role editing
- Added audit logging for important system actions
- Created a searchable knowledge base with admin CRUD controls
- Used environment variables for production-ready configuration
- Refactored major UI sections into reusable React components

## Features

### Authentication and Authorization

- JWT-based login
- Persistent login using localStorage
- Protected backend routes
- Admin and technician roles
- Role-based access control for admin-only pages and actions

### Ticket Management

- Create support tickets
- View all tickets
- Search tickets
- Filter tickets by status, priority, category, and assigned technician
- Update ticket status
- Edit ticket details in a modal
- Delete tickets as an admin
- Assign tickets to technicians

### Admin User Management

- View registered users
- Add new users
- Change user roles
- Prevent accidental removal of own admin access
- Admin-only access to user management tools

### Audit Logs

The system tracks key activity, including:

- Ticket creation
- Ticket updates
- Ticket deletion
- Unauthorized ticket update attempts
- User creation
- User role changes
- Knowledge base article creation
- Knowledge base article updates
- Knowledge base article deletion

### Knowledge Base

- Create knowledge base articles as an admin
- Search articles
- Filter articles by category
- View articles as any logged-in user
- Edit and delete articles as an admin

### Frontend UI

- Sidebar navigation layout
- Dashboard stats cards
- Ticket cards
- Modal editing
- Search and filter controls
- Admin-only views
- Responsive layout
- Clean help desk style interface

## Screenshots

### Login

![Login Screen](screenshots/login.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Tickets

![Tickets](screenshots/tickets.png)

### Ticket Edit Modal

![Ticket Edit Modal](screenshots/ticket-modal.png)

### Users Admin Page

![Users Admin Page](screenshots/users.png)

### Audit Logs

![Audit Logs](screenshots/audit-logs.png)

### Knowledge Base

![Knowledge Base](screenshots/knowledge-base.png)

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Axios
- CSS

### Backend

- Node.js
- Express
- Prisma ORM
- JSON Web Tokens
- bcryptjs
- CORS
- dotenv

### Database

- PostgreSQL through Prisma ORM

## Project Structure

```txt
helpdesk-ticketing-system/
  backend/
    prisma/
      schema.prisma
      migrations/
    src/
      server.js
    .env.example
    package.json

  frontend/
    public/
    src/
      components/
        Sidebar.jsx
        TicketModal.jsx
        ArticleModal.jsx
        TicketCard.jsx
        KnowledgeArticleCard.jsx
      App.jsx
      App.css
    .env.example
    package.json

  screenshots/
    Login.png
    Dashboard.png
    Tickets.png
    Ticket-Modal.png
    Users.png
    Audit-Logs.png
    Knowledge-Base.png

  README.md