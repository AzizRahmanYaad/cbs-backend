-- Training Module

-- Training Courses table
CREATE TABLE training_courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    duration_hours INTEGER,
    difficulty_level VARCHAR(20) DEFAULT 'BEGINNER',
    max_participants INTEGER,
    is_mandatory BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Training Sessions table
CREATE TABLE training_sessions (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    session_name VARCHAR(200) NOT NULL,
    instructor_id BIGINT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    location VARCHAR(200),
    max_participants INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Training Enrollments table
CREATE TABLE training_enrollments (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    enrollment_status VARCHAR(20) NOT NULL DEFAULT 'ENROLLED',
    attendance_percentage DECIMAL(5, 2),
    completion_status VARCHAR(20) DEFAULT 'NOT_STARTED',
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_issued_at TIMESTAMP,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES training_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (session_id, user_id)
);

-- Training Assessments table
CREATE TABLE training_assessments (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    score INTEGER,
    max_score INTEGER DEFAULT 100,
    passed BOOLEAN,
    feedback TEXT,
    assessed_by BIGINT,
    assessed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES training_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assessed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Training Materials table
CREATE TABLE training_materials (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_type VARCHAR(50),
    file_size BIGINT,
    is_public BOOLEAN DEFAULT FALSE,
    uploaded_by BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_training_sessions_course ON training_sessions(course_id);
CREATE INDEX idx_training_sessions_instructor ON training_sessions(instructor_id);
CREATE INDEX idx_training_sessions_date ON training_sessions(start_date);
CREATE INDEX idx_training_sessions_status ON training_sessions(status);
CREATE INDEX idx_training_enrollments_session ON training_enrollments(session_id);
CREATE INDEX idx_training_enrollments_user ON training_enrollments(user_id);
CREATE INDEX idx_training_enrollments_status ON training_enrollments(enrollment_status);
CREATE INDEX idx_training_assessments_session ON training_assessments(session_id);
CREATE INDEX idx_training_assessments_user ON training_assessments(user_id);
CREATE INDEX idx_training_materials_course ON training_materials(course_id);

-- Insert sample training courses
INSERT INTO training_courses (title, description, category, duration_hours, difficulty_level, is_mandatory) VALUES
    ('Safety Procedures', 'Workplace safety and emergency procedures training', 'Safety', 8, 'BEGINNER', TRUE),
    ('Leadership Development', 'Leadership skills and team management', 'Professional Development', 16, 'INTERMEDIATE', FALSE),
    ('Technical Skills Workshop', 'Advanced technical skills workshop', 'Technical', 24, 'ADVANCED', FALSE);
