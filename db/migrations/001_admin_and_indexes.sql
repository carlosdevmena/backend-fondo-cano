BEGIN;

CREATE TABLE IF NOT EXISTS usuarios_admin (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  refresh_token_hash TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_obras_anio ON obras(anio);
CREATE INDEX IF NOT EXISTS idx_obras_tecnica_id ON obras(tecnica_id);
CREATE INDEX IF NOT EXISTS idx_obras_autor_id ON obras(autor_id);
CREATE INDEX IF NOT EXISTS idx_obras_titulo_search ON obras USING GIN (to_tsvector('spanish', COALESCE(titulo, '')));
CREATE INDEX IF NOT EXISTS idx_obras_notas_search ON obras USING GIN (to_tsvector('spanish', COALESCE(notas, '')));

COMMIT;
