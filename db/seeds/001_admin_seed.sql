-- Replace hash using scripts/create-admin.js or manual bcrypt hash
INSERT INTO usuarios_admin (email, password_hash, role, is_active)
VALUES ('admin@fondo-cano.local', '$2b$10$4EBO2DlD2PzXuE7Y3WWN5Ob7s4Z6eKfToTKM6.Xnxsx6A8fQ4VQSO', 'admin', TRUE)
ON CONFLICT (email) DO NOTHING;
