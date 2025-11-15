-- Test data initialization script
-- Runs automatically on application startup if database is empty

-- Insert test users
INSERT INTO users (id, username, password, name, email, phone, address, department, created_at, updated_at)
VALUES
    (1, 'admin', 'admin123', 'Admin User', 'admin@company.com', '+34 600 111 111', 'Madrid, Spain', 'IT', CURRENT_TIMESTAMP, NULL),
    (2, 'john', 'password123', 'John Doe', 'john@company.com', '+34 600 222 222', 'Barcelona, Spain', 'Development', CURRENT_TIMESTAMP, NULL),
    (3, 'jane', 'password123', 'Jane Smith', 'jane@company.com', '+34 600 333 333', 'Valencia, Spain', 'QA', CURRENT_TIMESTAMP, NULL),
    (4, 'bob', 'password123', 'Bob Johnson', 'bob@company.com', '+34 600 444 444', 'Seville, Spain', 'Support', CURRENT_TIMESTAMP, NULL),
    (5, 'alice', 'password123', 'Alice Williams', 'alice@company.com', '+34 600 555 555', 'Bilbao, Spain', 'Operations', CURRENT_TIMESTAMP, NULL);

-- Insert test issues with requester and priority
INSERT INTO issues (id, title, description, requester, status, priority, assigned_user_id, created_at, updated_at)
VALUES
    (1, 'User login error', 'Users cannot login after the latest update. Error 500 when attempting to authenticate.', 'Admin User', 'OPEN', 'URGENT', NULL, CURRENT_TIMESTAMP - INTERVAL '2 days', NULL),

    (2, 'Dashboard improvements', 'Add real-time statistics charts to the main dashboard.', 'Jane Smith', 'IN_PROGRESS', 'HIGH', 2, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),

    (3, 'Report export bug', 'Exported PDF reports are corrupted or empty.', 'Bob Johnson', 'IN_PROGRESS', 'HIGH', 3, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '6 hours'),

    (4, 'Update API documentation', 'API REST documentation is outdated and missing information about new endpoints.', 'John Doe', 'RESOLVED', 'NORMAL', 4, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),

    (5, 'Optimize database queries', 'Database queries are slow in production. Need to optimize indexes.', 'Alice Williams', 'OPEN', 'HIGH', NULL, CURRENT_TIMESTAMP - INTERVAL '4 days', NULL),

    (6, 'Implement push notifications', 'Add push notification system for important alerts.', 'Admin User', 'OPEN', 'NORMAL', NULL, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL),

    (7, 'Price calculation error', 'System is incorrectly calculating discounts in some specific cases.', 'Jane Smith', 'IN_PROGRESS', 'URGENT', 5, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '12 hours'),

    (8, 'Improve security', 'Implement two-factor authentication (2FA) for admin users.', 'Bob Johnson', 'CLOSED', 'NORMAL', 1, CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '5 days');

-- Insert tags for issues
INSERT INTO issue_tags (issue_id, tag)
VALUES
    (1, 'authentication'),
    (1, 'critical'),
    (2, 'frontend'),
    (2, 'dashboard'),
    (3, 'reports'),
    (3, 'pdf'),
    (4, 'documentation'),
    (5, 'performance'),
    (5, 'database'),
    (6, 'notifications'),
    (6, 'feature'),
    (7, 'pricing'),
    (7, 'calculations'),
    (8, 'security'),
    (8, 'authentication');

-- Reset sequences for PostgreSQL
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('issues_id_seq', (SELECT MAX(id) FROM issues));
