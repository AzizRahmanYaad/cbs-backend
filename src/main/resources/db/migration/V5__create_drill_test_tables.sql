-- Drill Test Module

-- Drill Types table
CREATE TABLE drill_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    passing_score INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Drill Schedules table
CREATE TABLE drill_schedules (
    id BIGSERIAL PRIMARY KEY,
    drill_type_id BIGINT NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    location VARCHAR(200),
    max_participants INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drill_type_id) REFERENCES drill_types(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Drill Participants table
CREATE TABLE drill_participants (
    id BIGSERIAL PRIMARY KEY,
    drill_schedule_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    attendance_status VARCHAR(20) NOT NULL DEFAULT 'REGISTERED',
    score INTEGER,
    passed BOOLEAN,
    notes TEXT,
    checked_in_at TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (drill_schedule_id) REFERENCES drill_schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (drill_schedule_id, user_id)
);

-- Drill Results table (detailed performance tracking)
CREATE TABLE drill_results (
    id BIGSERIAL PRIMARY KEY,
    drill_schedule_id BIGINT NOT NULL,
    overall_score INTEGER,
    total_participants INTEGER,
    passed_count INTEGER,
    failed_count INTEGER,
    absent_count INTEGER,
    summary TEXT,
    areas_for_improvement TEXT,
    completed_at TIMESTAMP,
    reviewed_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drill_schedule_id) REFERENCES drill_schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_drill_schedules_type ON drill_schedules(drill_type_id);
CREATE INDEX idx_drill_schedules_date ON drill_schedules(scheduled_date);
CREATE INDEX idx_drill_schedules_status ON drill_schedules(status);
CREATE INDEX idx_drill_participants_schedule ON drill_participants(drill_schedule_id);
CREATE INDEX idx_drill_participants_user ON drill_participants(user_id);
CREATE INDEX idx_drill_results_schedule ON drill_results(drill_schedule_id);

-- Insert default drill types
INSERT INTO drill_types (name, description, duration_minutes, passing_score) VALUES
    ('Fire Safety Drill', 'Fire emergency evacuation drill', 30, 80),
    ('Security Response Drill', 'Security incident response drill', 45, 75),
    ('First Aid Drill', 'Basic first aid and CPR drill', 60, 85);
