# 🖥️ Government Performance Monitoring HQ System

A comprehensive role-based project management and performance monitoring system designed for government organizations. The system provides secure, scalable solutions for HQ administrators, managers, and employees to collaborate on projects, track performance, and manage assignments efficiently.

## Protoype Demo -> https://youtu.be/lNuFMxR63es

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with 12-hour token expiry
- **Role-based access control (RBAC)** with three distinct user roles:
  - **HQ Admin**: System-wide oversight and management
  - **Manager**: Project and team management
  - **Employee**: Task execution and reporting
- **Secure password hashing** using bcryptjs
- **Token blacklisting** for secure logout

### 📊 Project Management
- **Project lifecycle management** with status tracking (Ongoing, Completed, Delayed)
- **Budget tracking** with total and spent budget monitoring
- **Deadline management** with automatic status updates
- **Project member assignment** with unique constraints
- **Project analytics** and reporting for HQ administrators

### 📋 Assignment System
- **Task creation and assignment** with detailed descriptions
- **Status workflow**: Pending → Completed → Verified
- **Automatic overdue detection** (Pending tasks become Delayed)
- **Progress tracking** with employee updates and notes
- **Assignment history** for completed and verified tasks
- **Manager review system** for task verification

### 🎯 Performance Monitoring
- **Employee rating system** (1-5 scale) with detailed feedback
- **Performance analytics** with filtering capabilities
- **Team performance dashboards** for managers
- **Historical performance tracking**

### 🚨 Alert & Notification System
- **Multi-type alerts**: Delay, Performance, Ticket Escalation
- **Project-scoped notifications** for relevant team members
- **Alert history** and management
- **Real-time notification system** (ready for Socket.io integration)

### 🎫 Ticket Management
- **Employee ticket creation** for assignment issues
- **Escalation workflow**: Employee → Manager → HQ Admin
- **Ticket resolution tracking** with notes
- **Status management**: Escalated, Resolved
- **Manager ticket oversight** for team members

### 📈 Analytics & Reporting
- **Project performance metrics**
- **Team productivity analytics**
- **Budget utilization reports**
- **Assignment completion statistics**
- **Manager and employee performance insights**

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **Redis** for caching and session management
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **morgan** for request logging
- **CORS** for cross-origin resource sharing

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **Axios** for API communication
- **React Hook Form** for form management
- **TanStack Query** for data fetching
- **Recharts** for data visualization
- **Lucide React** for icons

### Database & Caching
- **MongoDB** with optimized schemas and indexing
- **Redis** for caching frequently accessed data
- **Mongoose** with lean queries for performance
- **Strategic indexing** for query optimization

## 📁 Project Structure

```
Govt_Performance_monitoring-hq-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection
│   │   │   └── redis.js             # Redis configuration
│   │   ├── controllers/
│   │   │   ├── authController.js     # Authentication logic
│   │   │   ├── managerController.js  # Manager operations
│   │   │   ├── employeeController.js # Employee operations
│   │   │   └── hqAdminController.js  # HQ Admin operations
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication
│   │   │   └── roleCheck.js         # Role-based access control
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   ├── Project.js           # Project schema
│   │   │   ├── Assignment.js        # Assignment schema
│   │   │   ├── Alert.js             # Alert schema
│   │   │   ├── Ticket.js            # Ticket schema
│   │   │   ├── Rating.js            # Rating schema
│   │   │   └── ProjectMember.js     # Project membership schema
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication routes
│   │   │   ├── manager.js           # Manager routes
│   │   │   ├── employee.js          # Employee routes
│   │   │   ├── hqAdmin.js           # HQ Admin routes
│   │   │   └── alerts.js            # Alert routes
│   │   ├── seed/                    # Database seeding scripts
│   │   └── server.js                # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Dashboard.tsx        # Main dashboard
│   │   │   ├── ManagerDashboard.tsx # Manager interface
│   │   │   └── EmployeeDashboard.tsx # Employee interface
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx         # Authentication page
│   │   │   ├── ManagerDashboard.tsx # Manager dashboard
│   │   │   └── EmployeeDashboard.tsx # Employee dashboard
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── hooks/                   # Custom React hooks
│   │   └── lib/                     # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Redis (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Govt_Performance_monitoring-hq-system.git
   cd Govt_Performance_monitoring-hq-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/performance-monitoring
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

5. **Database Setup**
   ```bash
   # Start MongoDB and Redis services
   # Then run the seeding scripts
   cd backend
   npm run seed:admin      # Create HQ Admin user
   npm run seed:manager    # Create sample managers
   npm run seed:sample     # Create sample data
   ```

6. **Start the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register-manager` - Register manager (HQ Admin only)
- `POST /api/v1/auth/register-employee` - Register employee (Manager only)
- `GET /api/v1/auth/me` - Get current user profile

### Manager Endpoints
- `GET /api/v1/manager/projects` - Get manager's projects
- `GET /api/v1/manager/employees` - Get manager's employees
- `GET /api/v1/manager/assignments` - Get assignments with status filtering
- `POST /api/v1/manager/assignments` - Create new assignment
- `POST /api/v1/manager/assignments/:id/verify` - Verify completed assignment
- `POST /api/v1/manager/assignments/:id/status` - Update assignment status
- `POST /api/v1/manager/alerts` - Create project alert
- `POST /api/v1/manager/ratings` - Rate employee performance

### Employee Endpoints
- `GET /api/v1/employee/assignments` - Get employee's assignments
- `POST /api/v1/employee/assignments/:id/update` - Update assignment progress
- `GET /api/v1/employee/projects` - Get employee's projects
- `GET /api/v1/employee/alerts` - Get relevant alerts
- `POST /api/v1/employee/assignments/:id/ticket` - Create support ticket

### HQ Admin Endpoints
- `GET /api/v1/hq/projects` - Get all projects
- `POST /api/v1/hq/projects` - Create new project
- `GET /api/v1/hq/managers` - Get all managers
- `GET /api/v1/hq/alerts` - Get all alerts
- `GET /api/v1/hq/performance` - Get performance analytics

## 🔒 Security Features

- **JWT Authentication** with secure token management
- **Role-based access control** preventing unauthorized access
- **Input validation** using express-validator
- **Password hashing** with bcryptjs
- **CORS protection** for cross-origin requests
- **Request logging** with morgan for audit trails
- **Redis-based session management** for token blacklisting

## 📊 Performance Optimizations

- **Redis caching** for frequently accessed data
- **Mongoose lean queries** for reduced memory usage
- **Strategic database indexing** for query optimization
- **Connection pooling** for database efficiency
- **Request/response compression** ready for production

## 🔮 Future Enhancements

- **Real-time notifications** with Socket.io integration
- **Email notifications** with Nodemailer
- **File upload system** with Multer for PDF documents
- **Advanced analytics** with data visualization
- **Mobile application** with React Native
- **API rate limiting** for enhanced security
- **Automated testing** with Jest and Cypress

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- MongoDB for the excellent database solution
- Express.js team for the robust web framework
- React team for the amazing frontend library
- All open-source contributors who made this project possible

---

**Note**: This system is designed for government organizations and includes role-based access control, audit trails, and security features suitable for sensitive data handling.
