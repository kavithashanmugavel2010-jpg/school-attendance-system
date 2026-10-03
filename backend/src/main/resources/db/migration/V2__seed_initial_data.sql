-- Initial Seed Data for St. Joseph Vidya Kshetra (JVK)
-- Migration: V2__seed_initial_data.sql

-- 1. Default Admin User (Password: admin123)
-- BCrypt hash for 'admin123'
INSERT INTO app_users (username, password, role, created_at, updated_at, created_by, last_modified_by)
VALUES (
    'admin',
    '$2a$10$e88yvU3m4L5A3S7xJgE2xeH7mF3uK7D6s8C9j0Q1W2E3R4T5Y6U7I',
    'ROLE_ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'SYSTEM',
    'SYSTEM'
)
ON CONFLICT (username) DO NOTHING;

-- 2. Default School Classes
INSERT INTO school_classes (id, name, section, deleted, created_at, updated_at, created_by, last_modified_by)
VALUES
    ('class_6th_a', '6th A', 'Higher Secondary', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_6th_b', '6th B', 'Higher Secondary', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_6th_c', '6th C', 'Higher Secondary', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_6th_d', '6th D', 'Higher Secondary', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_7th_a', '7th A', 'Higher Secondary', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_7th_b', '7th B', 'Higher Secondary', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_7th_c', '7th C', 'Higher Secondary', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_7th_d', '7th D', 'Higher Secondary', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_8th_a', '8th A', 'Higher Secondary', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_8th_b', '8th B', 'Higher Secondary', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_8th_c', '8th C', 'Higher Secondary', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM')
ON CONFLICT (id) DO NOTHING;

-- 3. Default Subjects for Classes
INSERT INTO subjects (id, name, class_id, deleted, created_at, updated_at, created_by, last_modified_by)
VALUES
    ('class_6th_a_sub_0', 'L1', 'class_6th_a', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_6th_a_sub_1', 'L2', 'class_6th_a', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_6th_a_sub_2', 'L3', 'class_6th_a', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_6th_a_sub_3', 'Science', 'class_6th_a', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_6th_a_sub_4', 'Social', 'class_6th_a', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_6th_a_sub_5', 'Maths', 'class_6th_a', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('class_6th_a_sub_6', 'Computer', 'class_6th_a', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM')
ON CONFLICT (id) DO NOTHING;
