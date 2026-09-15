-- EduLab PostgreSQL Schema Definition
-- Automatically applied on startup or can be executed directly

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'STUDENT',
    school VARCHAR(255),
    provider VARCHAR(50) DEFAULT 'LOCAL'
);

CREATE TABLE IF NOT EXISTS labs (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    subject VARCHAR(100) DEFAULT 'Vật lý',
    domain VARCHAR(100),
    grade VARCHAR(50),
    difficulty VARCHAR(50) DEFAULT 'MEDIUM',
    route VARCHAR(255),
    simulation_type VARCHAR(50) DEFAULT 'CUSTOM_CANVAS',
    thumbnail_url VARCHAR(500),
    tags VARCHAR(500),
    status VARCHAR(50) DEFAULT 'PUBLISHED',
    created_by VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classrooms (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    code VARCHAR(50) UNIQUE,
    teacher_id VARCHAR(255),
    teacher_name VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_enrollments (
    id VARCHAR(255) PRIMARY KEY,
    class_id VARCHAR(255),
    class_name VARCHAR(255),
    class_code VARCHAR(50),
    teacher_name VARCHAR(255),
    student_id VARCHAR(255),
    student_name VARCHAR(255),
    student_email VARCHAR(255),
    enrolled_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(255) PRIMARY KEY,
    class_id VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    lab_type VARCHAR(100),
    param_bounds_json VARCHAR(1000),
    target_formula VARCHAR(255),
    tolerance_percent DOUBLE PRECISION DEFAULT 3.0,
    teacher_id VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
    id VARCHAR(255) PRIMARY KEY,
    instance_id VARCHAR(255),
    assignment_id VARCHAR(255),
    student_id VARCHAR(255),
    student_name VARCHAR(255),
    submitted_answers_json VARCHAR(1000),
    explanation VARCHAR(3000),
    math_score DOUBLE PRECISION DEFAULT 0.0,
    ai_reasoning_score DOUBLE PRECISION DEFAULT 0.0,
    total_score DOUBLE PRECISION DEFAULT 0.0,
    ai_feedback_json VARCHAR(4000),
    submitted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_assignment_instances (
    id VARCHAR(255) PRIMARY KEY,
    assignment_id VARCHAR(255),
    student_id VARCHAR(255),
    generated_params_json VARCHAR(1000),
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_lab_snapshots (
    id VARCHAR(255) PRIMARY KEY,
    student_id VARCHAR(255),
    lab_id VARCHAR(255),
    lab_title VARCHAR(255),
    screenshot_url VARCHAR(500),
    cloudinary_public_id VARCHAR(255),
    caption VARCHAR(2000),
    difficulty VARCHAR(50) DEFAULT 'MEDIUM',
    score DOUBLE PRECISION,
    created_at TIMESTAMP
);
