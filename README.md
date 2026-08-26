<div align="center">

# 🏫 Joseph Vidya Kshetra
### Integrated School Attendance & Academic Management System

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Security](https://img.shields.io/badge/Auth-JWT%20%26%20Argon2-red?style=for-the-badge)](https://jwt.io/)

<p align="center">
  A secure, modern, full-stack application engineered for school administration, real-time student attendance tracking, mark management, and role-based access control.
</p>

</div>

---

## 📌 Key Features

* **📋 Attendance Management:** Daily attendance recording, defaulter tracking, and automated summaries.
* **📊 Academic Performance:** Subject-wise mark registration, grade calculation, and report generation.
* **👥 Student & Class Records:** Centralized database for class directories, sections, and student profiles.
* **🔐 Enterprise-Grade Security:** Role-based access control secured via JWT (JSON Web Tokens) and Rust-powered Argon2 hashing.
* **🎨 Modern UI/UX:** Responsive, fast React interface powered by Vite.

---

## 🛠️ Architecture & Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Modern CSS / Tailwind |
| **Backend API** | Java 17+, Spring Boot, Spring Data JPA, Spring Security |
| **Security Layer** | Rust-based Argon2 Security Module |
| **Database** | Relational SQL Database (H2 / MySQL / PostgreSQL) |
| **Build Tools** | Maven, npm |

---

## 📋 System Requirements

### Global Prerequisites
- **Git:** v2.20 or higher - [Download](https://git-scm.com/)
- **Java Development Kit (JDK):** v17 or higher - [Download](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- **Node.js & npm:** v18 or higher - [Download](https://nodejs.org/)

### Platform-Specific Requirements

#### **Windows**
- Windows 10/11 (Build 19041+)
- 4GB RAM minimum (8GB recommended)
- Maven 3.8+ (comes with Spring Boot wrapper)

#### **macOS**
- macOS 11.0+ (Big Sur or newer)
- Xcode Command Line Tools
- Homebrew (optional but recommended)
- 4GB RAM minimum (8GB recommended)

#### **Linux (Ubuntu/Debian/RHEL)**
- Ubuntu 20.04 LTS+ / Debian 10+ / RHEL 8+
- Build essentials installed
- 4GB RAM minimum (8GB recommended)
- 2GB free disk space

---

## 🚀 Getting Started & Setup

### Step 1: Verify Prerequisites

#### **Windows (PowerShell as Administrator)**
```powershell
# Check Java installation
java -version
# Expected: java version "17" or higher

# Check Node.js installation
node --version
npm --version
# Expected: v18.x.x or higher

# Check Git installation
git --version
```

#### **macOS & Linux (Terminal)**
```bash
# Check Java installation
java -version
# Expected: java version "17" or higher

# Check Node.js installation
node --version
npm --version
# Expected: v18.x.x or higher

# Check Git installation
git --version
```

---

## 💻 Installation & Running Instructions

### 🪟 **Windows**

#### 1️⃣ Clone the Repository
```powershell
# Open PowerShell as Administrator
git clone https://github.com/kavithashanmugavel2010-jpg/school-attendance-system.git
cd school-attendance-system
```

#### 2️⃣ Setup Backend (Spring Boot)
```powershell
# Navigate to backend directory
cd backend

# Build the backend (first time only)
mvnw.cmd clean install

# Run the backend
mvnw.cmd spring-boot:run

# The backend will start on: http://localhost:8080
# Keep this terminal window open
```

#### 3️⃣ Setup Frontend (React + Vite) - **New Terminal/PowerShell**
```powershell
# Navigate back to project root
cd ..

# Install frontend dependencies
npm install

# Start the development server
npm run dev

# The frontend will be available at: http://localhost:5173
```

#### 📦 Build for Production
```powershell
# Frontend production build
npm run build

# Backend production build (in backend directory)
cd backend
mvnw.cmd clean package -DskipTests
```

---

### 🍎 **macOS**

#### 1️⃣ Clone the Repository
```bash
# Using Terminal
git clone https://github.com/kavithashanmugavel2010-jpg/school-attendance-system.git
cd school-attendance-system
```

#### 2️⃣ Install Xcode Command Line Tools (if not already installed)
```bash
xcode-select --install
```

#### 3️⃣ Setup Backend (Spring Boot)
```bash
# Navigate to backend directory
cd backend

# Give execute permission to Maven wrapper
chmod +x mvnw

# Build the backend (first time only)
./mvnw clean install

# Run the backend
./mvnw spring-boot:run

# The backend will start on: http://localhost:8080
# Keep this terminal window open
```

#### 4️⃣ Setup Frontend (React + Vite) - **New Terminal Window**
```bash
# Navigate back to project root
cd ..

# Install frontend dependencies
npm install

# Start the development server
npm run dev

# The frontend will be available at: http://localhost:5173
```

#### 📦 Build for Production
```bash
# Frontend production build
npm run build

# Backend production build (in backend directory)
cd backend
./mvnw clean package -DskipTests
```

#### 🔨 Optional: Using Homebrew
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Maven (optional, uses wrapper by default)
brew install maven

# Install Node.js
brew install node

# Install Java
brew install openjdk@17
```

---

### 🐧 **Linux (Ubuntu/Debian/RHEL)**

#### 1️⃣ Install Prerequisites

**Ubuntu/Debian:**
```bash
# Update package manager
sudo apt update
sudo apt upgrade -y

# Install Git
sudo apt install -y git

# Install JDK 17
sudo apt install -y openjdk-17-jdk

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install build essentials
sudo apt install -y build-essential
```

**RHEL/CentOS/Fedora:**
```bash
# Update package manager
sudo yum update -y

# Install Git
sudo yum install -y git

# Install JDK 17
sudo yum install -y java-17-openjdk java-17-openjdk-devel

# Install Node.js and npm
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install build essentials
sudo yum groupinstall -y "Development Tools"
```

#### 2️⃣ Clone the Repository
```bash
git clone https://github.com/kavithashanmugavel2010-jpg/school-attendance-system.git
cd school-attendance-system
```

#### 3️⃣ Setup Backend (Spring Boot)
```bash
# Navigate to backend directory
cd backend

# Give execute permission to Maven wrapper
chmod +x mvnw

# Build the backend (first time only)
./mvnw clean install

# Run the backend
./mvnw spring-boot:run

# The backend will start on: http://localhost:8080
# Keep this terminal open (Ctrl+C to stop)
```

#### 4️⃣ Setup Frontend (React + Vite) - **New Terminal**
```bash
# Navigate back to project root
cd ..

# Install frontend dependencies
npm install

# Start the development server
npm run dev

# The frontend will be available at: http://localhost:5173
```

#### 📦 Build for Production
```bash
# Frontend production build
npm run build

# Backend production build (in backend directory)
cd backend
./mvnw clean package -DskipTests
```

#### 🔨 Using Package Managers (Alternative)
```bash
# For Debian/Ubuntu - using apt
sudo apt install -y maven

# For RHEL/CentOS - using yum
sudo yum install -y maven
```

---

## ✅ Verification Checklist

After installation, verify everything is working:

```bash
# 1. Check Java version
java -version
# Should output: openjdk version "17.x.x"

# 2. Check Node.js and npm versions
node --version    # v18.x.x or higher
npm --version     # 9.x.x or higher

# 3. Test Maven wrapper
cd backend
# Windows: mvnw.cmd --version
# macOS/Linux: ./mvnw --version

# 4. Backend URL
# Open browser: http://localhost:8080

# 5. Frontend URL
# Open browser: http://localhost:5173
```

---

## 📂 Project Structure

```
school-attendance-system/
├── backend/                 # Spring Boot API
│   ├── src/
│   ├── pom.xml             # Maven configuration
│   ├── mvnw                # Maven wrapper (Linux/macOS)
│   └── mvnw.cmd            # Maven wrapper (Windows)
├── src/                     # React frontend source code
│   ├── components/
│   ├── pages/
│   └── styles/
├── public/                  # Static assets
├── package.json            # npm dependencies
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

---

## 🌐 Access the Application

### Development Mode
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080
- **API Documentation:** http://localhost:8080/swagger-ui.html (if enabled)

### Production Mode
1. Build both frontend and backend using production commands above
2. Deploy backend WAR/JAR to application server
3. Serve frontend build files through web server or CDN

---

## 🔧 Available Scripts

### Frontend (npm)
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build locally
npm run lint        # Run ESLint
```

### Backend (Maven)
```bash
# In backend directory
./mvnw clean install        # Build project
./mvnw spring-boot:run      # Run development server
./mvnw clean package        # Create production JAR
./mvnw test                 # Run unit tests
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# macOS/Linux - Find process using port 8080
lsof -i :8080
kill -9 <PID>

# Windows - Find process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Maven Wrapper Permission Denied (macOS/Linux)
```bash
cd backend
chmod +x mvnw
./mvnw spring-boot:run
```

### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Java Version Mismatch
```bash
# Verify Java version
java -version

# If wrong version, set JAVA_HOME
# macOS/Linux:
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Windows (PowerShell):
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17.x.x"
```

---

## 📝 Environment Variables

Create `.env` file in the root directory:

```env
# Frontend Configuration
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Joseph Vidya Kshetra

# Backend Configuration (application.properties)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
```

---

## 🔐 Security Notes

- **JWT Tokens:** Used for API authentication
- **Password Hashing:** Rust-based Argon2 implementation
- **CORS:** Configure in Spring Security for production
- **SSL/TLS:** Enable HTTPS in production deployment

---

## 📞 Support & Contact

For issues, questions, or contributions:
- Create an issue on GitHub
- Check existing documentation
- Review the tech stack documentation links

---

## 📄 License

This project is provided as-is for educational purposes.

---

**Last Updated:** 2026-08-26
