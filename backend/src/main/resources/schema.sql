-- PostgreSQL Schema for St. Joseph Vidya Kshetra (JVK)

CREATE TABLE IF NOT EXISTS app_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_ADMIN'
);

CREATE TABLE IF NOT EXISTS school_classes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    section VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    class_id VARCHAR(100) NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    class_id VARCHAR(100) NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id SERIAL PRIMARY KEY,
    class_id VARCHAR(100) NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE,
    attendance_date VARCHAR(20) NOT NULL,
    student_id VARCHAR(100) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT unique_attendance_per_student UNIQUE (class_id, attendance_date, student_id)
);

CREATE TABLE IF NOT EXISTS mark_records (
    id SERIAL PRIMARY KEY,
    class_id VARCHAR(100) NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE,
    exam_type VARCHAR(100) NOT NULL,
    subject_id VARCHAR(100) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    student_id VARCHAR(100) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    score NUMERIC(5,2),
    CONSTRAINT unique_mark_per_student UNIQUE (class_id, exam_type, subject_id, student_id)
);
