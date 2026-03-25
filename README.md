🧠 Automated Resume Grader
Anveshan Hackathon Project

A smart, web-based AI-powered Resume Grader that evaluates resumes instantly and provides actionable feedback. Users upload a PDF resume, and the system analyzes it for:

Contact Information

Education

Skills

Experience

Formatting Quality

ATS Compatibility

Keywords & Structure

It assigns a score out of 100 and highlights areas of improvement, such as missing sections, unclear formatting, or low keyword relevance. The tool also suggests enhancements like adding bullet points, improving section headers, and refining skill lists.

🚀 Features

Upload PDF resumes

Automated extraction using pdfplumber

Scoring based on structure, skills, formatting, and content

Detailed improvement suggestions

Fast and simple UI built for non-technical users

End-to-end system powered by Python, Flask, and Node.js

🛠️ Tech Stack
Component	Technology
Backend	Python, Flask
PDF Parsing	pdfplumber
Frontend	Node.js, HTML/CSS/JS
Build Tools	npm, Vite
Deployment	Replit
📦 Installation & Setup (Local Machine)
Prerequisites

Ensure you have the following installed:

Node.js (v18 or above)

npm (comes with Node.js)

Steps to Run Locally

Download / Clone the project

git clone https://github.com/MayankSahu297/Anveshan-Hackathon

cd Anveshan-Hackathon


Install dependencies

npm install


Start the development server

npm run dev


Open your browser and visit:

http://localhost:5000

📘 What the Commands Do

npm install
Installs all project dependencies.

npm run dev
Starts both the backend Flask server and the frontend development server together.

⚠️ If You Get Port Conflicts

This project uses port 5000. If something else is on that port:

Stop the application using port 5000, or

Change the port in:

server/index.ts (line 62)

🚢 Production Build

To build for production:

npm run build


To start the production server:

npm start



🌐 Live Deployment

🔗 Live Demo:
https://94d88c9d-fbeb-41b5-9f38-dec071da3432-00-2qgqkztwnsk0o.spock.replit.dev/
