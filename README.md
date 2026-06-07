PromptBase
PromptBase is a full-stack prompt management platform designed for office teams to organize, share, and reuse AI prompts efficiently.
The project was developed as the final project for the Software Technologies with AI course at SoftUni AI.

Live Demo
Web Application
https://promptbase-beige.vercel.app
Mobile Application (Expo)
https://promptbase-mobile--8r00bi1e5j.expo.app/
GitHub Repository
https://github.com/draganoval/promptbase

Project Overview
PromptBase allows teams to:
Store and manage reusable prompts
Organize prompts into categories
Mark prompts as favorites
Manage users and roles
Access prompts through both a web application and a mobile application
Scale efficiently through API pagination
The solution follows a client-server architecture with a centralized database and REST API.

Technologies Used
Frontend (Web)
Next.js
TypeScript
React
Tailwind CSS
Backend
Next.js API Routes
TypeScript
Database
PostgreSQL (Neon)
Drizzle ORM
Drizzle Migrations
Authentication
JWT Authentication
Password Hashing
Mobile Application
Expo
React Native
TypeScript
Deployment
Vercel (Web Application)
Expo Hosting (Mobile Application)

Architecture
PromptBase follows a modern full-stack architecture:
Web Client (Next.js)
↓
REST API
↓
Drizzle ORM
↓
Neon PostgreSQL Database
Mobile Client (Expo)
↓
REST API
↓
Neon PostgreSQL Database
Both clients consume the same backend API.

Features
Authentication
User Registration
User Login
User Logout
JWT-based Authentication
Prompt Management
Create Prompt
Read Prompt
Update Prompt
Delete Prompt
Categorize Prompts
Favorites
Add Prompt to Favorites
Remove Prompt from Favorites
View Favorite Prompts
User Management
User Roles
Admin Dashboard
User Administration
Mobile App
Login Screen
Prompt List Screen
Prompt Details Screen
Favorites Screen
Profile Screen

User Roles
Admin
Can:
View Admin Dashboard
Manage Users
Manage Categories
Create Prompts
Edit Prompts
Delete Prompts
User
Can:
Browse Prompts
View Prompt Details
Add Favorites
Manage Profile

Database Structure
The project contains multiple database tables:
Users
Stores:
User Information
Authentication Data
User Roles
Roles
Stores:
Role Definitions
Authorization Information
Categories
Stores:
Prompt Categories
Prompts
Stores:
Prompt Content
Metadata
Author Information
Favorites
Stores:
User Favorite Relationships

API Endpoints
Authentication
POST /api/auth/login
POST /api/auth/register
Prompts
GET /api/prompts
GET /api/prompts/[id]
POST /api/prompts
PATCH /api/prompts/[id]
DELETE /api/prompts/[id]
Categories
GET /api/categories
POST /api/categories
PATCH /api/categories/[id]
DELETE /api/categories/[id]
Favorites
GET /api/favorites
POST /api/favorites
DELETE /api/favorites/[id]
Users
GET /api/admin/users
PATCH /api/admin/users/[id]
DELETE /api/admin/users/[id]

Scalability
Pagination has been implemented in both:
API
User Interface
Large datasets were tested through database seeding.
Example:
GET /api/prompts?page=1&limit=20
This ensures efficient handling of large prompt collections.

Mobile Application
The Expo mobile application connects directly to the deployed backend API.
Implemented screens:
Login
Prompt List
Prompt Details
Favorites
Profile
The mobile application uses the same backend and database as the web application.

Deployment
Web
Hosted on Vercel:
https://promptbase-beige.vercel.app
Mobile
Hosted with Expo:
https://promptbase-mobile--83kdcmgdbf.expo.app

Local Installation
Clone Repository
git clone [repository-url]
cd promptbase

Install Dependencies
npm install

Configure Environment Variables
Create a .env.local file:
DATABASE_URL=your_database_url
JWT_SECRET=your_secret

Run Development Server
npm run dev

Run Mobile Application
cd mobile
npm install
npx expo start


Testing
The application was tested for:
Authentication
CRUD Operations
Authorization
API Communication
Responsive Design
Mobile Compatibility
Pagination
Deployment

Future Improvements
Advanced Search
Prompt Analytics
Team Workspaces
Prompt Version History
User Activity Tracking
Enhanced Mobile Features

Author
Liliana Draganova
Software Technologies with AI Final Project
SoftUni AI

