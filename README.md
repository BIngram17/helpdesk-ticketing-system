# HelpDesk Ticketing System

A full-stack help desk ticketing system built with React, Node.js, Express, Prisma, and JWT authentication. The application supports ticket management, role-based access control, admin user management, audit logs, persistent login, advanced ticket filtering, and a searchable knowledge base.

## Project Overview

This project was built as a realistic internal IT help desk application. It allows users to log in, create and manage support tickets, assign tickets to technicians, track ticket status, manage users, review audit logs, and maintain a knowledge base for common troubleshooting issues.

The project demonstrates full-stack development using a React frontend, Express backend, Prisma ORM, authentication with JSON Web Tokens, role-based access control, and environment-based configuration.

## Features

### Authentication and Authorization

- JWT-based login
- Persistent login using localStorage
- Role-based access control
- Admin and technician roles
- Protected backend routes

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
- Admin-only access to user management

### Audit Logs

- Track ticket creation
- Track ticket updates
- Track ticket deletion
- Track unauthorized update attempts
- Track user creation
- Track user role changes
- Track knowledge base article changes

### Knowledge Base

- Create knowledge base articles as an admin
- Search articles
- Filter articles by category
- View articles as any logged-in user
- Edit and delete articles as an admin

### Frontend UI

- Sidebar layout
- Dashboard stats cards
- Ticket cards
- Modal editing
- Search and filter controls
- Responsive layout
- Clean help desk style interface

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
- JWT
- bcryptjs
- CORS
- dotenv

### Database

- Prisma-supported database
- Local development can use SQLite or PostgreSQL depending on configuration

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

  README.md