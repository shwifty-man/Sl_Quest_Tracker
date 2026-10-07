DROP TABLE IF EXISTS blocked_apps CASCADE;

CREATE TABLE blocked_apps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    app_package TEXT NOT NULL

    UNIQUE (user_id, app_package)
);