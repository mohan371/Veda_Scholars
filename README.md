# Veda Scholars - Full Stack Application

A modern full-stack application built with Next.js (frontend) and Node.js/Express with GraphQL (backend), using MongoDB as the database.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Git Workflow](#git-workflow)
- [Main Commands](#main-commands)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- MongoDB (running locally or MongoDB Atlas connection string)
- Git

### Clone the Repository

```bash
# Clone the repository
git clone https://github.com/SayedJamil/veda-scholars.git

# Navigate to the project directory
cd veda-scholars

# Install all dependencies (root, backend, and frontend)
npm run install:all
```

### Environment Setup

1. **Backend Environment Variables**

Create a `.env` file in the `backend` directory:

```env
PORT=8483
MONGODB_URI=mongodb://localhost:27017/veda-scholars
```

For MongoDB Atlas (if using not, not required otherwise), use:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/veda-scholars
```

2. **Frontend Configuration**

The frontend is configured to connect to the backend at `http://localhost:8483/graphql` by default. Update this in `frontend/lib/apollo-client.ts` if needed.

## 🌿 Git Workflow

### Creating a New Branch

```bash
# Make sure you're on the main branch and it's up to date
git checkout main
git pull origin main

# Create a new branch for your feature
git checkout -b feature/[your-feature-name]

# Or for bug fixes
git checkout -b fix/bug-description
```

### Working on a Branch

```bash
# Check which branch you're on
git branch

# See all branches (local and remote)
git branch -a

# Switch to your branch (if not already on it)
git checkout feature/[your-feature-name]

# Make your changes, then stage them
git add .

# Commit your changes
git commit -m "add: description of your changes"

# Push your branch to remote
git push -u origin feature/[your-feature-name]
```

### Branch Naming Conventions

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Adding or updating tests

### Creating a Pull Request

1. Push your branch to GitHub
2. Go to the repository on GitHub
3. Click "Compare & pull request"
4. Fill in the description and submit

## 📜 Main Commands

### Root Directory Commands

```bash
# Install all dependencies (root, backend, frontend)
npm run install:all

# Run both backend and frontend concurrently
npm run dev

# Run only frontend
yarn client
# or
npm run dev:frontend

# Run only backend
yarn server
# or
npm run dev:backend

# Build both backend and frontend
npm run build

# Build only backend
npm run build:backend

# Build only frontend
npm run build:frontend
```

### Backend Commands

```bash
cd backend

# Development mode (with auto-reload)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start
```

### Frontend Commands

```bash
cd frontend

# Development mode
npm run dev
# or
yarn dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🏗️ Backend Architecture

### Overview

The backend is built with **Node.js**, **Express**, **Apollo Server**, and **MongoDB** using **TypeScript**.

```
┌─────────────────────────────────────────────────┐
│                   Client Request                  │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│              Express Server (Port 8483)          │
│  ┌──────────────────────────────────────────┐   │
│  │         Apollo Server (GraphQL)          │   │
│  │  ┌────────────────────────────────────┐ │   │
│  │  │   GraphQL Schema (typeDefs)        │ │   │
│  │  │   - Todo type                       │ │   │
│  │  │   - Query operations               │ │   │
│  │  │   - Mutation operations            │ │   │
│  │  └────────────────────────────────────┘ │   │
│  │  ┌────────────────────────────────────┐ │   │
│  │  │   Resolvers                           │ │   │
│  │  │   - Query resolvers                  │ │   │
│  │  │   - Mutation resolvers               │ │   │
│  │  └────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│              MongoDB Database                    │
│  ┌──────────────────────────────────────────┐   │
│  │         Mongoose ODM                      │   │
│  │  ┌────────────────────────────────────┐ │   │
│  │  │   Todo Model                        │ │   │
│  │  │   - text: String                    │ │   │
│  │  │   - createdAt: Date                │ │   │
│  │  │   - updatedAt: Date                │ │   │
│  │  └────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main server entry point
│   ├── models/
│   │   └── Todo.ts            # MongoDB Todo model
│   └── graphql/
│       ├── typeDefs.ts        # GraphQL schema definitions
│       └── resolvers.ts       # GraphQL resolvers
├── tsconfig.json              # TypeScript configuration
├── nodemon.json               # Nodemon configuration
├── package.json               # Dependencies and scripts
└── .env                       # Environment variables
```

### How Backend Works

1. **Server Initialization** (`src/server.ts`)

   - Sets up Express server
   - Connects to MongoDB using Mongoose
   - Configures Apollo Server with GraphQL schema
   - Mounts GraphQL endpoint at `/graphql`

2. **GraphQL Schema** (`src/graphql/typeDefs.ts`)

   - Defines the `Todo` type with fields: `id`, `text`, `createdAt`, `updatedAt`
   - Defines queries: `todos`, `todo(id)`
   - Defines mutations: `createTodo(text)`, `deleteTodo(id)`

3. **Resolvers** (`src/graphql/resolvers.ts`)

   - **Query Resolvers**:
     - `todos`: Fetches all todos from MongoDB, sorted by creation date
     - `todo(id)`: Fetches a single todo by ID
   - **Mutation Resolvers**:
     - `createTodo(text)`: Creates a new todo in MongoDB
     - `deleteTodo(id)`: Deletes a todo from MongoDB

4. **Data Model** (`src/models/Todo.ts`)
   - Mongoose schema for Todo documents
   - Includes validation and timestamps

### GraphQL API Endpoints

**GraphQL Playground**: `http://localhost:8483/graphql`

**Example Query**:

```graphql
query GetTodos {
  todos {
    id
    text
    createdAt
    updatedAt
  }
}
```

**Example Mutation**:

```graphql
mutation CreateTodo($text: String!) {
  createTodo(text: $text) {
    id
    text
    createdAt
  }
}
```

## 🎨 Frontend Architecture

### Overview

The frontend is built with **Next.js 16** (App Router), **React 19**, **Apollo Client**, and **Tailwind CSS**.

```
┌─────────────────────────────────────────────────┐
│              Browser (User)                      │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│           Next.js App (Port 3000)                │
│  ┌──────────────────────────────────────────┐   │
│  │         App Router                        │   │
│  │  ┌────────────────────────────────────┐   │   │
│  │  │   Layout (Root)                   │   │   │
│  │  │   ┌────────────────────────────┐  │   │   │
│  │  │   │  Apollo Provider           │  │   │   │
│  │  │   │  ┌──────────────────────┐  │  │   │   │
│  │  │   │  │  Page Components    │  │  │   │   │
│  │  │   │  │  - TodoForm         │  │  │   │   │
│  │  │   │  │  - TodoList         │  │  │   │   │
│  │  │   │  └──────────────────────┘  │  │   │   │
│  │  │   └────────────────────────────┘  │   │   │
│  │  └────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│         Apollo Client (GraphQL)                 │
│  ┌──────────────────────────────────────────┐ │
│  │   HTTP Link                               │ │
│  │   - URI: http://localhost:8483/graphql  │ │
│  └──────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────┐ │
│  │   InMemoryCache                           │ │
│  │   - Query caching                         │ │
│  │   - Normalized cache                     │ │
│  └──────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│         Backend GraphQL API                      │
└─────────────────────────────────────────────────┘
```

### Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with Apollo Provider
│   ├── page.tsx                # Main page component
│   ├── providers.tsx           # Apollo Provider wrapper
│   ├── components/
│   │   ├── TodoForm.tsx        # Todo input form component
│   │   └── TodoList.tsx        # Todo list display component
│   └── globals.css             # Global styles
├── lib/
│   └── apollo-client.ts       # Apollo Client configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

### How Frontend Works

1. **Apollo Client Setup** (`lib/apollo-client.ts`)

   - Configures Apollo Client with HTTP link pointing to GraphQL endpoint
   - Sets up InMemoryCache for query caching
   - Exports client instance

2. **Apollo Provider** (`app/providers.tsx`)

   - Wraps the application with ApolloProvider
   - Makes Apollo Client available to all components

3. **Todo Form Component** (`app/components/TodoForm.tsx`)

   - Uses `useMutation` hook to create todos
   - Handles form submission
   - Refetches todos list after successful creation
   - Manages loading and error states

4. **Todo List Component** (`app/components/TodoList.tsx`)
   - Uses `useQuery` hook to fetch todos
   - Displays todos in a list
   - Uses `useMutation` hook to delete todos
   - Handles loading, error, and empty states

### Data Flow

```
User Input (TodoForm)
    │
    ▼
useMutation Hook
    │
    ▼
Apollo Client
    │
    ▼
GraphQL API (Backend)
    │
    ▼
MongoDB
    │
    ▼
Response
    │
    ▼
Cache Update
    │
    ▼
UI Update (TodoList)
```

## 📁 Project Structure

```
veda-scholars/
├── backend/                    # Backend application
│   ├── src/
│   │   ├── server.ts
│   │   ├── models/
│   │   └── graphql/
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # Frontend application
│   ├── app/
│   │   ├── components/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   ├── package.json
│   └── next.config.ts
├── package.json                # Root package.json
├── .gitignore
└── README.md
```

## 🛠️ Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Apollo Server** - GraphQL server
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **TypeScript** - Type-safe JavaScript
- **GraphQL** - Query language for APIs

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Apollo Client** - GraphQL client
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

## 🔧 Development Tips

1. **Hot Reload**: Both backend and frontend support hot reload during development
2. **GraphQL Playground**: Visit `http://localhost:8483/graphql` to test GraphQL queries
3. **Type Safety**: Both projects use TypeScript for type safety
4. **Environment Variables**: Always use `.env` files for sensitive configuration

## 📝 License

This project is private and proprietary.

## 👥 Contributors

- Initial setup and development

---

For more information or issues, please contact the development team.
