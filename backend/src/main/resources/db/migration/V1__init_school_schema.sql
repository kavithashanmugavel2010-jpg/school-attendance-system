-- PostgreSQL Schema for St. Joseph Vidya Kshetra (JVK)
-- Migration: V1__init_school_schema.sql

-- 1. App Users Table
CREATE TABLE IF NOT EXISTS app_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_ADMIN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    last_modified_by VARCHAR(100)
);

-- 2. Refresh Tokens Table for JWT Rotation & Revocation
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expiry_date TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. School Classes Table
CREATE TABLE IF NOT EXISTS school_classes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    section VARCHAR(100) NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    last_modified_by VARCHAR(100)
);

-- 4. Students Table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    class_id VARCHAR(100) NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    last_modified_by VARCHAR(100)
);

-- 5. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    class_id VARCHAR(100) NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    last_modified_by VARCHAR(100)
);

-- 6. Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records (
    id BIGSERIAL PRIMARY KEY,
    class_id VARCHAR(100) NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE,
    attendance_date VARCHAR(20) NOT NULL,
    student_id VARCHAR(100) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    last_modified_by VARCHAR(100),
    CONSTRAINT unique_attendance_per_student UNIQUE (class_id, attendance_date, student_id)
);

-- 7. Mark Records Table
CREATE TABLE IF NOT EXISTS mark_records (
    id BIGSERIAL PRIMARY KEY,
    class_id VARCHAR(100) NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE,
    exam_type VARCHAR(100) NOT NULL,
    subject_id VARCHAR(100) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    student_id VARCHAR(100) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    score NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    last_modified_by VARCHAR(100),
    CONSTRAINT unique_mark_per_student UNIQUE (class_id, exam_type, subject_id, student_id)
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON app_users(username);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_deleted ON students(deleted);
CREATE INDEX IF NOT EXISTS idx_subjects_class_id ON subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_subjects_deleted ON subjects(deleted);
CREATE INDEX IF NOT EXISTS idx_school_classes_deleted ON school_classes(deleted);
CREATE INDEX IF NOT EXISTS idx_attendance_lookup ON attendance_records(class_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_marks_lookup ON mark_records(class_id, exam_type, subject_id);
CREATE INDEX IF NOT EXISTS idx_marks_student ON mark_records(student_id);
