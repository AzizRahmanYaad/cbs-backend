-- Daily Reporting Module

-- Report Templates table
CREATE TABLE report_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    fields JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Daily Reports table
CREATE TABLE daily_reports (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT,
    report_date DATE NOT NULL,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    data JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    submitted_at TIMESTAMP,
    reviewed_by BIGINT,
    reviewed_at TIMESTAMP,
    review_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES report_templates(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Report Metrics table (for tracking KPIs)
CREATE TABLE report_metrics (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15, 2),
    unit VARCHAR(50),
    target_value DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES daily_reports(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_daily_reports_date ON daily_reports(report_date);
CREATE INDEX idx_daily_reports_user ON daily_reports(user_id);
CREATE INDEX idx_daily_reports_status ON daily_reports(status);
CREATE INDEX idx_daily_reports_template ON daily_reports(template_id);
CREATE INDEX idx_report_metrics_report ON report_metrics(report_id);
CREATE UNIQUE INDEX idx_daily_reports_user_date ON daily_reports(user_id, report_date);

-- Insert default report template
INSERT INTO report_templates (name, description, fields, created_by) VALUES
    ('Standard Daily Report', 'Default daily report template', 
     '{"sections": [{"name": "Tasks Completed", "type": "list"}, {"name": "Hours Worked", "type": "number"}, {"name": "Notes", "type": "text"}]}',
     NULL);
