# Vibarua Marketplace

**A School Project by Open University of Kenya**

## Overview

Vibarua Marketplace is a web-based platform designed to address the challenge casual workers in Kenya face in finding daily employment, despite the abundance of blue-collar job opportunities across the country. This project aims to bridge the gap between skilled casual workers and clients seeking their services, creating a more efficient and accessible job marketplace.

## Problem Statement

In Kenya, thousands of casual workers struggle to find consistent daily work, even though there is significant demand for blue-collar services such as cleaning, plumbing, electrical work, construction, and more. Traditional methods of finding work are inefficient, unreliable, and often exploit workers. Vibarua Marketplace solves this by providing a digital platform where:

- Workers can create professional profiles showcasing their skills and experience
- Clients can easily find and hire skilled workers for their specific needs
- The platform facilitates secure communication and job management
- Location-based features help match workers with nearby job opportunities
- Reviews and ratings build trust within the community

## Features

### For Workers
- **Profile Creation**: Workers can create detailed profiles including profession, bio, location, skills, experience, and profile photos
- **Job Discovery**: Browse and filter job requests by profession, location, and experience level
- **Job Management**: Accept, reject, and manage job requests efficiently
- **Location Integration**: View job locations on Google Maps for easy navigation
- **Reviews & Ratings**: Build reputation through client reviews and ratings
- **Direct Communication**: Access client contact information for seamless coordination

### For Clients
- **Worker Discovery**: Search and filter workers by profession, location, skills, and ratings
- **Job Requests**: Send detailed job requests to specific workers
- **Location Specification**: Specify job locations with automatic geocoding for precise mapping
- **Job Management**: Track job status from pending to completion
- **Review System**: Rate and review workers based on their performance
- **Mobile-Optimized**: Fully responsive design for seamless mobile experience

### Platform Features
- **Modern UI/UX**: Clean, intuitive interface with glassmorphism design elements
- **Mobile Responsive**: Optimized for all screen sizes
- **Real-time Updates**: Dynamic status updates for job requests
- **Secure Authentication**: User registration and login system
- **Image Upload**: Cloudinary integration for profile photo uploads
- **Location Services**: Google Maps integration for precise location sharing
- **Contact Information**: Secure sharing of client contact details with workers

## Technology Stack

### Frontend
- **React**: Modern JavaScript library for building user interfaces
- **React Router**: Client-side routing for navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express**: Web application framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling tool

### Third-Party Services
- **Cloudinary**: Cloud image storage and management
- **OpenStreetMap/Nominatim**: Free geocoding service for location coordinates
- **Google Maps**: Location visualization and navigation

## Project Structure

```
capstone-project/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   └── Navbar.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── CreateProfilePage.jsx
│   │   │   ├── ViewProfilePage.jsx
│   │   │   ├── WorkerDiscoveryPage.jsx
│   │   │   ├── CreateJobRequestPage.jsx
│   │   │   ├── ClientJobsPage.jsx
│   │   │   ├── WorkerJobRequestsPage.jsx
│   │   │   └── LeaveReviewPage.jsx
│   │   └── assets/        # Images and static assets
│   └── package.json
├── server/                # Express backend application
│   ├── config/           # Configuration files
│   │   ├── db.js         # MongoDB connection
│   │   └── cloudinary.js # Cloudinary configuration
│   ├── controllers/      # Business logic
│   │   ├── authController.js
│   │   ├── workerProfileController.js
│   │   ├── jobRequestController.js
│   │   └── reviewController.js
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── WorkerProfile.js
│   │   ├── JobRequest.js
│   │   └── Review.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── workerProfileRoutes.js
│   │   ├── jobRequestRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── uploadRoutes.js
│   ├── server.js         # Main server file
│   └── package.json
└── README.md            # Project documentation
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### For Workers
1. Register as a worker on the platform
2. Create a detailed profile with skills, experience, and location
3. Browse incoming job requests from clients
4. Accept jobs that match your skills and availability
5. Use the Google Maps integration to navigate to job locations
6. Complete jobs and build your reputation through reviews

### For Clients
1. Register as a client on the platform
2. Browse workers by profession, location, and ratings
3. Send job requests with detailed descriptions and locations
4. Track job status from pending to completion
5. Rate and review workers based on their performance
6. Contact workers directly for coordination

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Worker Profiles
- `POST /api/profiles` - Create a worker profile
- `GET /api/profiles` - Get all worker profiles
- `GET /api/profiles/:id` - Get a specific worker profile
- `GET /api/profiles/me` - Get current user's profile
- `PUT /api/profiles` - Update worker profile

### Job Requests
- `POST /api/requests` - Create a job request
- `GET /api/requests/client/:clientId` - Get client's job requests
- `GET /api/requests/worker/:workerId` - Get worker's job requests
- `GET /api/requests/:id` - Get a specific job request
- `PUT /api/requests/:id/status` - Update job request status

### Reviews
- `POST /api/reviews` - Create a review
- `GET /api/reviews/worker/:workerId` - Get reviews for a worker
- `GET /api/reviews/job/:jobId` - Get review for a specific job

### Image Upload
- `POST /api/upload/image` - Upload an image to Cloudinary

## Contributing

This is a school project for Open University of Kenya. Contributions are welcome from students and faculty members interested in improving the platform.

## License

This project is developed as part of academic coursework at Open University of Kenya.

## Acknowledgments

- **Open University of Kenya** - Academic institution supporting this project
- **Instructors and Mentors** - Guidance and support throughout development
- **Casual Workers of Kenya** - Inspiration for addressing this important social challenge

## Contact

For questions or feedback about this project, please contact the development team through the repository issues section.

---

**Note**: This project is a demonstration of modern web development practices and aims to create a positive social impact by improving job opportunities for casual workers in Kenya.
