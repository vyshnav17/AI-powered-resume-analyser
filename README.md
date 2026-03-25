# Anveshan-Hackathon
AUTOMATED RESUME GRADER
To run this project on your local device, follow these steps:

Prerequisites
Make sure you have these installed:

Node.js (version 18 or higher)
npm (comes with Node.js)
Setup Steps
Download the project files to your computer

Open terminal/command prompt and navigate to the project folder

Install dependencies:

npm install
Start the development server:

npm run dev
Open your browser and go to http://localhost:5000

What the commands do:
npm install - Downloads all the required packages
npm run dev - Starts both the backend server and frontend development server
If you get port conflicts:
The app runs on port 5000 by default. If something else is using that port, you can:

Stop other applications using port 5000, or
Modify the port in server/index.ts (line 62)
For production deployment:
npm run build
npm start
The project includes a resume analysis tool that lets you upload PDF files and get detailed feedback on formatting, content, keywords, and ATS compatibility.
