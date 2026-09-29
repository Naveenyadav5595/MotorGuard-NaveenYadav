# ⚙️ MotorGuard — Industrial Motor Monitoring & Control System

> A full-stack MERN application for monitoring, controlling, and managing industrial motors in real time.

**MotorGuard** is an industrial motor monitoring and management platform built using the **MERN stack**. It provides a centralized dashboard to manage industrial motors, monitor real-time sensor parameters, detect abnormal conditions, generate alerts, maintain activity logs, and control motor power states.

The system is designed around the idea of connecting industrial motor data with a modern web-based monitoring interface, making it easier to observe motor health and respond to abnormal operating conditions.

---

## 🚀 Live Demo

### Frontend

**https://motorguard-frontend.onrender.com**

### Backend API

**https://motorguard-backend.onrender.com**

> The backend API is deployed separately from the React frontend.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Key Features](#-key-features)
* [How MotorGuard Works](#-how-motorguard-works)
* [System Architecture](#-system-architecture)
* [Technology Stack](#-technology-stack)
* [User Roles](#-user-roles)
* [Motor Monitoring](#-motor-monitoring)
* [Threshold-Based Monitoring](#-threshold-based-monitoring)
* [Alert System](#-alert-system)
* [Real-Time Updates](#-real-time-updates)
* [Motor Control](#-motor-control)
* [Activity Logs](#-activity-logs)
* [Authentication & Authorization](#-authentication--authorization)
* [Project Structure](#-project-structure)
* [Database Models](#-database-models)
* [API Overview](#-api-overview)
* [Environment Variables](#-environment-variables)
* [Local Installation](#-local-installation)
* [Running the Project](#-running-the-project)
* [Production Deployment](#-production-deployment)
* [Monitoring Logic](#-monitoring-logic)
* [Example Sensor Data](#-example-sensor-data)
* [Future Improvements](#-future-improvements)
* [Security Notes](#-security-notes)
* [Author](#-author)
* [License](#-license)

---

# 📖 Overview

Industrial motors need continuous monitoring because abnormal temperature, vibration, or rotational speed can indicate potentially unsafe or inefficient operating conditions.

MotorGuard provides a web-based interface where authorized users can:

* Register and authenticate securely
* Manage industrial motors
* Configure motor-specific safety thresholds
* Monitor temperature, RPM, and vibration
* Automatically determine motor health status
* Generate alerts when abnormal conditions occur
* Acknowledge and delete alerts
* Turn motors ON/OFF from the control interface
* View motor configuration and sensor readings
* Monitor activities through an audit log
* Receive new alerts in real time using Socket.IO

The project combines **industrial monitoring concepts with full-stack web development**.

---

# ✨ Key Features

## 🔐 Authentication

* User registration
* User login
* Password hashing using bcrypt
* JWT-based authentication
* Protected routes
* Persistent authentication using browser local storage
* Automatic role assignment for the first registered user

---

## 👥 Role-Based Access

MotorGuard supports two roles:

### Manager

Managers have access to administrative motor-management functionality such as:

* Adding motors
* Updating motor configuration
* Deleting motors
* Controlling motors
* Viewing monitoring information
* Managing alerts
* Viewing activity logs

### Operator

Operators can work with the monitoring and operational functionality permitted by the application.

Role-based authorization is implemented through backend middleware.

---

# 🏭 Motor Management

MotorGuard allows managers to create and manage industrial motors.

Each motor contains information such as:

* Motor ID
* Motor name
* Location
* Device ID
* Motor status
* Power state
* Temperature thresholds
* RPM thresholds
* Vibration thresholds
* Automatic shutdown configuration

### Example Motor

```text
Motor ID: MTR002
Motor Name: Cooling Pump Motor
Location: Cooling System - Unit A
Device ID: ESP32_002

Status: Critical
Power State: OFF
Auto Shutdown: Enabled
```

---

# 📊 Motor Monitoring

MotorGuard monitors three primary sensor parameters:

### 🌡️ Temperature

Tracks the motor's operating temperature.

### ⚙️ RPM

Tracks the rotational speed of the motor.

### 📳 Vibration

Tracks vibration levels that may indicate abnormal motor operation.

These readings are associated with a specific:

* Motor ID
* Device ID
* Timestamp

---

# 🚦 Threshold-Based Monitoring

Every motor can have its own monitoring thresholds.

For example:

```text
Temperature
Warning: 60°C
Critical: 75°C

RPM
Minimum: 1200
Maximum: 1800

Vibration
Warning: 4
Critical: 6
```

MotorGuard evaluates incoming sensor readings against these thresholds.

---

# 🧠 Motor Health Logic

Whenever a sensor reading is received, MotorGuard evaluates the current motor condition.

### Critical

The motor becomes **Critical** when:

```text
Temperature >= Critical Temperature
OR
Vibration >= Critical Vibration
OR
RPM < Minimum RPM
```

### Healthy

The motor becomes **Healthy** when:

```text
Temperature < Warning Temperature
AND
Vibration < Warning Vibration
AND
RPM > Minimum RPM
AND
RPM < Maximum RPM
```

### Warning

If the motor is neither Critical nor Healthy, its status becomes:

```text
Warning
```

This allows the motor's status to be recalculated whenever a new sensor reading arrives.

---

# 🚨 Alert System

MotorGuard automatically generates alerts when abnormal motor conditions are detected.

Alerts can be generated for:

* Critical temperature
* Warning temperature
* Critical vibration
* Warning vibration
* RPM below minimum
* RPM above maximum

Each alert contains information such as:

```text
Motor ID
Device ID
Severity
Message
Acknowledgement status
Timestamp
```

### Alert Severity

MotorGuard currently supports:

```text
Warning
Critical
```

---

# 🔔 Real-Time Alert Updates

MotorGuard uses **Socket.IO** for real-time communication between the backend and frontend.

When a new alert is generated:

```text
Sensor Reading
      ↓
Backend evaluates reading
      ↓
Alert generated
      ↓
MongoDB
      ↓
Socket.IO
      ↓
Connected frontend clients
      ↓
Alert appears automatically
```

The frontend listens for events such as:

```javascript
newAlert
```

Additional Socket.IO events are used for alert acknowledgement and deletion.

This means users do not need to manually refresh the page to receive newly generated alerts while connected to the application.

---

# 🎛️ Motor Control

Authorized users can control the motor power state from the application.

Supported operations:

```text
Turn ON
Turn OFF
```

The backend updates:

```text
powerState
```

of the selected motor.

The system also creates an activity log for these operations.

### Future Hardware Integration

The backend contains a planned integration point for sending commands to physical motor controllers such as ESP32-based devices.

Example command structure:

```json
{
  "motorId": "MTR002",
  "command": "TURN_ON"
}
```

---

# 📝 Activity Logs

MotorGuard maintains an audit trail of important system operations.

Logged operations include:

```text
Motor_Created
Motor_Updated
Motor_Deleted
Motor_TurnedOn
Motor_TurnedOff
Alert_Acknowledged
Alert_Deleted
```

Each log records information such as:

* User ID
* Username
* Action
* Motor ID
* Description
* Timestamp

Example:

```text
User: naveen
Action: Motor_Created
Motor: MTR002

New Motor with MTR002 was created by user naveen
```

This provides traceability for important operational actions.

---

# 🔐 Authentication & Authorization

MotorGuard uses **JWT (JSON Web Tokens)** for authentication.

During login, the backend generates a token containing information such as:

```json
{
  "userId": "USER_ID",
  "role": "manager"
}
```

The token is then used by the frontend when communicating with protected backend endpoints.

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

The backend authentication middleware validates the token before allowing access to protected routes.

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │       User          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │      + Tailwind     │
                         └──────────┬──────────┘
                                    │
                       HTTP REST API │ Socket.IO
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Express Backend   │
                         │       + Node.js     │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
      │ Controllers │       │ Middleware  │       │  Socket.IO  │
      └──────┬──────┘       └─────────────┘       └─────────────┘
             │
             ▼
      ┌─────────────┐
      │   Mongoose  │
      └──────┬──────┘
             │
             ▼
      ┌─────────────────┐
      │   MongoDB Atlas │
      └─────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology       | Purpose                   |
| ---------------- | ------------------------- |
| React            | User interface            |
| React Router     | Client-side routing       |
| Tailwind CSS     | UI styling                |
| Lucide React     | Icons                     |
| Recharts         | Sensor data visualization |
| Socket.IO Client | Real-time communication   |
| Vite             | Frontend build tool       |

## Backend

| Technology | Purpose                   |
| ---------- | ------------------------- |
| Node.js    | Runtime                   |
| Express.js | REST API                  |
| MongoDB    | Database                  |
| Mongoose   | ODM                       |
| JWT        | Authentication            |
| bcrypt     | Password hashing          |
| Socket.IO  | Real-time communication   |
| dotenv     | Environment configuration |

## Deployment

```text
Frontend → Render
Backend  → Render
Database → MongoDB Atlas
```

---

# 👤 User Roles

MotorGuard currently supports:

| Role     | Purpose                                      |
| -------- | -------------------------------------------- |
| Manager  | Motor administration and control             |
| Operator | Operational monitoring and permitted actions |

The first registered user is automatically assigned the `manager` role.

Subsequent users are registered as `operator` by default.

---

# 📁 Project Structure

```text
MotorGuard-NaveenYadav/
│
├── backend/
│   │
│   ├── app.js
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   │
│   └── src/
│       │
│       ├── controllers/
│       │   ├── alertController.js
│       │   ├── logController.js
│       │   ├── motorController.js
│       │   ├── sensorController.js
│       │   └── userController.js
│       │
│       ├── db/
│       │   └── connectDb.js
│       │
│       ├── middlewares/
│       │   ├── authMiddleware.js
│       │   └── roleMiddleware.js
│       │
│       ├── models/
│       │   ├── alertModel.js
│       │   ├── logModel.js
│       │   ├── motorModel.js
│       │   ├── sensorReadingModel.js
│       │   └── userModel.js
│       │
│       └── routes/
│           ├── alertRoutes.js
│           ├── logRoutes.js
│           ├── motorRoutes.js
│           ├── sensorRoutes.js
│           └── userRoutes.js
│
├── frontend/
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── .gitignore
│   │
│   └── src/
│       │
│       ├── assets/
│       │
│       ├── components/
│       │   ├── protectedRoute.jsx
│       │   └── viewdetails.jsx
│       │
│       ├── pages/
│       │   ├── alert.jsx
│       │   ├── dashboard.jsx
│       │   ├── home.jsx
│       │   ├── log.jsx
│       │   ├── login.jsx
│       │   ├── motorcontrol.jsx
│       │   ├── motordetails.jsx
│       │   ├── motormanagement.jsx
│       │   └── register.jsx
│       │
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
└── README.md
```

---

# 🗄️ Database Models

MotorGuard uses MongoDB with Mongoose.

## User

Stores:

```text
username
email
password
role
createdAt
updatedAt
```

Passwords are stored as bcrypt hashes rather than plain text.

---

## Motor

Stores:

```text
motorId
motorName
location
deviceId
status
powerState
autoShutdownEnabled

temperatureThreshold
rpmThreshold
vibrationThreshold

createdAt
updatedAt
```

---

## Sensor Reading

Stores:

```text
motorId
deviceId
temperature
rpm
vibration
timestamp
createdAt
updatedAt
```

---

## Alert

Stores information about abnormal motor conditions and their acknowledgement status.

---

## Log

Stores the audit history of important system actions.

---

# 🔌 API Overview

## Authentication

### Register

```http
POST /users/register
```

### Login

```http
POST /users/login
```

---

## Motors

### Create Motor

```http
POST /motors
```

### Get All Motors

```http
GET /motors
```

### Get Motor

```http
GET /motors/:motorId
```

### Update Motor

```http
PUT /motors/:motorId
```

### Delete Motor

```http
DELETE /motors/:motorId
```

### Turn Motor ON

```http
PATCH /motors/:motorId/on
```

### Turn Motor OFF

```http
PATCH /motors/:motorId/off
```

---

## Sensor Readings

Sensor readings can be submitted through the sensor API.

The backend verifies:

1. Motor exists
2. Device ID matches the motor
3. Sensor values are evaluated against thresholds
4. Motor status is updated
5. Alerts are generated when required
6. Socket.IO broadcasts new alerts

---

## Alerts

```http
GET /alerts
```

```http
PATCH /alerts/:alertId/acknowledge
```

```http
DELETE /alerts/:alertId/delete
```

---

## Logs

Logs can be retrieved through the log API to provide an audit history of system activity.

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=8000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

JWT_EXPIRES_IN=1d
```

For the frontend, create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:8000
```

For production:

```env
VITE_API_URL=https://motorguard-backend.onrender.com
```

> Never commit `.env` files or database credentials to GitHub.

---

# 💻 Local Installation

## 1. Clone the repository

```bash
git clone https://github.com/Naveenyadav5595/MotorGuard-NaveenYadav.git
```

```bash
cd MotorGuard-NaveenYadav
```

---

# ⚙️ Backend Setup

Open a terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
backend/.env
```

Add your environment variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

Start the backend:

```bash
npm start
```

The backend should run on:

```text
http://localhost:8000
```

---

# 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔄 Running the Complete Application

Start the backend:

```bash
cd backend
npm install
npm start
```

Then start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Application flow:

```text
Browser
   ↓
React Frontend
   ↓
Express REST API
   ↓
MongoDB Atlas
```

For real-time alerts:

```text
Sensor Reading
      ↓
Backend
      ↓
Alert Generated
      ↓
Socket.IO
      ↓
React Alert Dashboard
```

---

# 🧪 Example Sensor Data

Example healthy reading:

```json
{
  "motorId": "MTR002",
  "deviceId": "ESP32_002",
  "temperature": 45,
  "rpm": 1500,
  "vibration": 2,
  "timestamp": "2026-09-29T09:20:00.000Z"
}
```

For a motor configured with:

```text
Temperature Warning: 60°C
Temperature Critical: 75°C

RPM Minimum: 1200
RPM Maximum: 1800

Vibration Warning: 4
Vibration Critical: 6
```

this reading should result in:

```text
Temperature → Healthy
RPM         → Healthy
Vibration   → Healthy

Motor Status → Healthy
```

---

# 🧠 Monitoring Workflow

The complete sensor-processing workflow is:

```text
              Sensor Reading
                    │
                    ▼
            Find Motor by ID
                    │
                    ▼
       Verify Motor + Device ID
                    │
                    ▼
       Read Motor Thresholds
                    │
                    ▼
        Evaluate Sensor Values
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Critical   Warning   Healthy
          │         │         │
          └─────────┼─────────┘
                    ▼
            Update Motor Status
                    │
                    ▼
             Save Motor
                    │
                    ▼
       Status != Healthy?
              /          \
            Yes           No
             │             │
             ▼             ▼
        Create Alert    No Alert
             │
             ▼
        Socket.IO Event
             │
             ▼
      Frontend Alert UI
```

---

# 📱 Main Application Pages

MotorGuard includes multiple frontend pages.

### 🏠 Home

Provides an overview of the MotorGuard system.

### 📊 Dashboard

Provides a centralized view of motor monitoring information.

### 🏭 Motor Management

Used to:

* Add motors
* View motors
* Update motor configuration
* Delete motors

### 🎛️ Motor Control

Used to:

* Turn motors ON
* Turn motors OFF
* View motor power state

### 📈 Motor Details

Displays:

* Motor configuration
* Temperature readings
* RPM readings
* Vibration readings
* Monitoring information

### 🚨 Alerts

Displays:

* Warning alerts
* Critical alerts
* Acknowledgement state
* Alert messages

### 📝 Logs

Displays the audit trail of important system actions.

---

# 🌐 Production Deployment

MotorGuard is deployed using:

```text
Frontend
   ↓
Render
   ↓
motorguard-frontend.onrender.com

Backend
   ↓
Render
   ↓
motorguard-backend.onrender.com

Database
   ↓
MongoDB Atlas
```

### Production Frontend API Configuration

```env
VITE_API_URL=https://motorguard-backend.onrender.com
```

The backend uses the Render-provided port through:

```javascript
process.env.PORT
```

---

# 🔌 Real-Time Communication

Socket.IO is used to maintain a real-time connection between the frontend and backend.

The frontend connects to:

```javascript
io(API_URL)
```

The backend can emit events such as:

```javascript
io.emit("newAlert", newAlert);
```

The frontend listens for:

```javascript
socket.on("newAlert", (newAlert) => {
    // update alert state
});
```

This allows newly generated alerts to appear without manually refreshing the page.

---

# 🛡️ Security

MotorGuard includes several security mechanisms:

* Password hashing with bcrypt
* JWT authentication
* Protected backend routes
* Role-based authorization
* Environment variables for secrets
* Server-side validation
* Motor/device ID verification
* MongoDB validation through Mongoose

### Important

Never expose:

```text
MONGO_URI
JWT_SECRET
Database credentials
Private API keys
```

in the frontend or public GitHub repository.

---

# 🔮 Future Improvements

Planned improvements include:

* [ ] ESP32 hardware integration
* [ ] Live sensor streaming from physical motors
* [ ] Automatic motor shutdown on critical conditions
* [ ] Advanced real-time charts
* [ ] Historical sensor analytics
* [ ] Email notifications
* [ ] SMS notifications
* [ ] More detailed reporting
* [ ] Export monitoring reports
* [ ] Improved role and permission management
* [ ] Predictive maintenance
* [ ] Anomaly detection
* [ ] Motor maintenance scheduling
* [ ] Improved mobile responsiveness
* [ ] Docker support
* [ ] Automated testing
* [ ] CI/CD pipeline

---

# 🎯 Project Goals

The main goals of MotorGuard are:

1. **Centralized motor monitoring**
2. **Real-time abnormal-condition detection**
3. **Threshold-based motor health classification**
4. **Fast alert generation**
5. **Remote motor control**
6. **Operational traceability**
7. **Scalable industrial monitoring architecture**
8. **Future integration with IoT hardware**

---

# 📚 Learning Outcomes

This project demonstrates practical experience with:

### Frontend Development

* React
* React Router
* State management
* API integration
* Protected routes
* Real-time Socket.IO communication
* Data visualization
* Responsive UI development

### Backend Development

* Node.js
* Express.js
* REST APIs
* Middleware
* Authentication
* Authorization
* Error handling
* Server-side validation

### Database

* MongoDB
* MongoDB Atlas
* Mongoose
* Schema design
* Data relationships
* CRUD operations

### Authentication

* bcrypt
* JWT
* Role-based authorization
* Protected APIs

### Real-Time Systems

* Socket.IO
* Event-driven communication
* Real-time alert updates

### Deployment

* Git
* GitHub
* Render
* MongoDB Atlas
* Environment configuration

---

# 🤝 Contributing

Contributions and suggestions are welcome.

To contribute:

```bash
git clone https://github.com/Naveenyadav5595/MotorGuard-NaveenYadav.git
```

Create a new branch:

```bash
git checkout -b feature/your-feature
```

Make your changes and commit:

```bash
git add .
git commit -m "Add your feature"
```

Push the branch:

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 🐛 Issues & Feedback

If you find a bug or have an improvement suggestion, please open an issue in the GitHub repository.

When reporting a bug, include:

* Description of the problem
* Steps to reproduce
* Expected behavior
* Actual behavior
* Relevant console/server logs
* Screenshots when applicable

---

# 👨‍💻 Author

## Naveen Yadav

**B.Tech — Instrumentation and Control Engineering**

MotorGuard was developed as an academic/engineering project combining:

* Industrial instrumentation
* Motor monitoring
* IoT concepts
* Full-stack web development
* Real-time communication
* Database systems

---

# 📄 License

This project is intended primarily for educational and portfolio purposes.

If you plan to reuse or distribute the project, please contact the author regarding licensing and attribution.

---

# ⭐ Support

If you found MotorGuard useful or interesting, consider giving the repository a ⭐ on GitHub.

**Repository:**

https://github.com/Naveenyadav5595/MotorGuard-NaveenYadav

---

## ⚙️ MotorGuard

**Monitor. Detect. Alert. Control.**

A full-stack industrial motor monitoring platform built with the MERN stack and real-time communication.
