# Quick Start Guide

## 🚀 One-Command Setup

### Windows

```bash
setup.bat
```

### Linux/macOS

```bash
chmod +x setup.sh
./setup.sh
```

## 📋 Manual Setup (if scripts don't work)

### 1. Database Setup

```sql
CREATE DATABASE library_db;
```

### 2. Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔑 Login Credentials

- **Email**: admin@library.com
- **Password**: admin123

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080

## ⚠️ Prerequisites

- Java 21
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

## 🚨 Common Issues

1. **Port 8080 in use**: Change `server.port=8081` in `backend/src/main/resources/application.properties`
2. **MySQL connection**: Update credentials in `application.properties`
3. **Build errors**: Run `mvn clean compile` for backend, `npm install` for frontend
