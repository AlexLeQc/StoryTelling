# StoryTelling - Interactive Storytelling Application

A web application that allows users to create, save, and share interactive stories with custom backgrounds.

## Features

- User authentication (Email/Password + OAuth with Google and GitHub)
- Create interactive stories with multiple pages and choices
- Upload custom background images for each page
- Visual and JSON editing modes
- Share stories via unique URLs (no account required to read)
- Dashboard to manage all your stories
- Duplicate and delete stories

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios
- React JSON View
- React Dropzone

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Passport.js (OAuth)
- GridFS for image storage

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Project Structure

```
StoryTelling/
├── backend/              # Backend API
│   ├── src/
│   │   ├── config/      # Database and Passport config
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth and upload middleware
│   │   └── server.js    # Express server
│   └── package.json
├── story_telling/        # Frontend React app
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── utils/       # Utilities
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:

4. Fill in your environment variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A random secret string for JWT tokens
- `PORT`: Server port (default: 5000)
- `FRONTEND_URL`: Your frontend URL
- OAuth credentials (Google and GitHub)

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd story_telling
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env`

4. Set your API URL:
```
REACT_APP_API_URL=http://localhost:5000
```

5. Start the development server:
```bash
npm start
```

## Deployment

### Backend on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables

### Frontend on Vercel

1. Import your GitHub repository to Vercel
2. Set the root directory to `story_telling`
3. Framework preset: Create React App
4. Add environment variables:
   - `REACT_APP_API_URL`: Your Render backend URL
   - OAuth client IDs (if using OAuth)

### MongoDB Atlas

1. Create a free cluster on MongoDB Atlas
2. Create a database user
3. Whitelist your IP addresses (or 0.0.0.0/0 for Render)
4. Get your connection string and add it to backend `.env`

## Usage

1. Register a new account or login
2. Click "Create New Story" on the dashboard
3. Add pages with text, choices, and background images
4. Save your story
5. Share the unique URL with others (no account needed to read)

## License

MIT

