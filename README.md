# Library Management System

A full-stack Library Management System built with Spring Boot backend and React frontend, featuring book management, member management, borrowing system, waitlist functionality, and detailed analytics.

## 🚀 Quick Start

### Prerequisites

Before running this project, ensure you have the following installed:

- **Java 21** (JDK)
- **Node.js 18+** and npm
- **MySQL 8.0+**
- **Maven 3.6+**

### System Requirements

- **RAM**: Minimum 4GB, Recommended 8GB
- **Storage**: At least 2GB free space
- **OS**: Windows, macOS, or Linux

## 📋 Installation Steps

### 1. Database Setup

First, set up the MySQL database:

```sql
-- Create the database
CREATE DATABASE library_db;
USE library_db;

-- The tables will be created automatically by Hibernate
```

### 2. Backend Setup

Navigate to the backend directory and run:

```bash
# Navigate to backend
cd backend

# Clean and install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

In a new terminal, navigate to the frontend directory:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 Configuration

### Database Configuration

Edit `backend/src/main/resources/application.properties` to match your MySQL setup:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### JWT Configuration

The JWT secret is configured in `application.properties`. For production, change the secret:

```properties
jwt.secret=your-secure-secret-key-here
```

## 📦 Deployment Commands

### For Development

```bash
# Backend (Terminal 1)
cd backend
mvn spring-boot:run

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### For Production

```bash
# Build backend
cd backend
mvn clean package -DskipTests

# Run backend JAR
java -jar target/library-management-system-1.0.0.jar

# Build frontend
cd frontend
npm run build

# Serve frontend (using any static server)
npx serve -s dist
```

## 🗂️ Project Structure

```
library/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/example/backend/
│   │       ├── controllers/    # REST API endpoints
│   │       ├── services/       # Business logic
│   │       ├── model/          # Entity classes
│   │       ├── repository/     # Data access layer
│   │       ├── dto/           # Data transfer objects
│   │       └── config/        # Security and configuration
│   └── src/main/resources/
│       └── application.properties
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── Pages/          # Page components
│   │   ├── context/        # React context
│   │   └── api/           # API integration
│   └── package.json
└── README.md
```

## 🔑 Default Credentials

The system creates a default admin user on first run:

- **Email**: admin@library.com
- **Password**: admin123

## 🚨 Troubleshooting

### Common Issues

1. **Port 8080 already in use**

   ```bash
   # Change port in application.properties
   server.port=8081
   ```

2. **MySQL connection failed**

   - Ensure MySQL is running
   - Check credentials in `application.properties`
   - Verify database exists

3. **Frontend build errors**

   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Backend compilation errors**
   ```bash
   # Clean and rebuild
   mvn clean compile
   ```

### Logs

- **Backend logs**: Check console output or `logs/` directory
- **Frontend logs**: Check browser console and terminal output

## 📊 Features

- **Book Management**: Add, edit, delete, and search books
- **Member Management**: User registration, profile management
- **Borrowing System**: Issue and return books with due dates
- **Waitlist System**: Priority-based waitlist for popular books
- **Analytics Dashboard**: Real-time statistics and reports
- **Security**: JWT-based authentication and authorization

## 🛠️ Development

### Adding New Features

1. **Backend**: Add controllers, services, and models in respective packages
2. **Frontend**: Create components in `src/components/` and pages in `src/Pages/`
3. **Database**: Use JPA entities for automatic table creation

### Code Style

- **Backend**: Follow Spring Boot conventions
- **Frontend**: Use functional components with hooks
- **Database**: Use JPA annotations for entity mapping

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review logs for error messages
3. Ensure all prerequisites are installed correctly

## 🔄 Updates

To update the project:

```bash
# Backend
cd backend
git pull
mvn clean install

# Frontend
cd frontend
git pull
npm install
```

---

**Note**: This system uses H2 database for testing and MySQL for production. The database schema is automatically created by Hibernate on first run.
