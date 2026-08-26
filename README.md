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

## 🚀 Getting Started & Setup

Follow the instructions below for your specific operating system to clone, build, and run the system.

### Prerequisites
* **Java:** JDK 17 or higher
* **Node.js:** v18 or higher (with npm)
* **Git:** Installed on your system

---

### 🐧 Linux (Ubuntu / Debian / RHEL)

```bash
# 1. Clone repository
git clone [https://github.com/kavithashanmugavel2010-jpg/school-attendance-system.git](https://github.com/kavithashanmugavel2010-jpg/school-attendance-system.git)
cd school-attendance-system

# 2. Run Backend (Spring Boot)
cd backend
chmod +x mvnw
./mvnw clean spring-boot:run &

# 3. Run Frontend (React + Vite)
cd ..
npm install
npm run dev
