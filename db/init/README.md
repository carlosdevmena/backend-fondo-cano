Coloca aqui scripts SQL opcionales para inicializar PostgreSQL al crear el contenedor.

Ejemplo:
- `00_dump.sql` (copia del dump original)
- `01_post_init.sql` (ajustes adicionales)

El `podman-compose.yml` monta esta carpeta en `/docker-entrypoint-initdb.d`.
