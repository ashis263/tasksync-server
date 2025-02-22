# TaskSync Server - MERN Todo App with Real-Time Collaboration and Drag & Drop

TaskSync is a modern, collaborative todo application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with real-time updates via Socket.IO and interactive drag-and-drop functionality powered by React DnD.

## Features

-   **Real-time Collaboration:** Tasks are synchronized across all connected clients instantly using Socket.IO, allowing for seamless teamwork.
-   **Drag and Drop:** Reorder tasks within lists and move them between lists effortlessly using React DnD.
-   **User Authentication:** Secure user authentication with Firebase.
-   **Task Management:** Create, edit, and delete tasks with detailed descriptions and due dates.
-   **List Management:** Create, edit, and delete task lists.
-   **Responsive Design:** Works seamlessly on various devices.
-   **Modern UI:** Clean and intuitive user interface built with Tailwind CSS and DaisyUI.
-   **Form Validation:** Robust form validation using React Hook Form.
-   **Notifications:** User friendly sweet alert for notifications.
-   **Date handling:** Using Moment.js for date formatting.

## Technologies Used

-   **Frontend:**
    -   React.js
    -   React DnD (Drag and Drop)
    -   Socket.IO Client
    -   React Router DOM
    -   Axios (HTTP requests)
    -   React Hook Form
    -   Tailwind CSS
    -   DaisyUI
    -   React Icons
    -   React Responsive Modal
    -   Firebase Authentication
    -   Moment.js
    -   Sweetalert2
-   **Backend:**
    -   Node.js
    -   Express.js
    -   MongoDB
    -   Socket.IO Server

## Getting Started

### Prerequisites

-   Node.js (>=18)
-   npm or yarn
-   MongoDB
-   Firebase project with authentication enabled

<h2>🛠️ Installation & Running Locally</h2>
<p>Follow these steps to set up <strong>CareCamps</strong> on your local machine:</p>

<h3>1️⃣ Clone the Repository</h3>
<pre><code>git clone https://github.com/ashis263/tasksync-server</code></pre>

<h3>2️⃣ Install Dependencies</h3>
<pre><code>npm install</code></pre>

<h3>3️⃣ Set Up Environment Variables</h3>
<p>Create a <code>.env</code> file and add the following:</p>
<pre><code>PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
STRIPE_SECRET=YOUR_STRIPE_SECRET_KEY</code></pre>
<p><em>(Replace with your actual credentials.)</em></p>

<h3>4️⃣ Start the Development Server</h3>
<pre><code>npm start</code></pre>
<p>The backend will run at <code>http://localhost:5000/</code> by default.</p>
<hr>

8.  **Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).**

### Live link
<ul>
  <li>🚀 <a href="https://task-flow-c8b5e.web.app/">Firebase Deployment</a></li>
</ul>