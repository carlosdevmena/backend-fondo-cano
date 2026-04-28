# Backend Fondo Cano

Backend del proyecto para consultar y administrar el fondo artístico de Francisco Cano.

La idea es simple:
- visitante: solo consulta obras y filtros
- admin: puede crear, editar y eliminar información

## Tecnologías
- Node.js + Express + TypeScript
- PostgreSQL
- JWT para autenticación admin
- Zod para validación

## Arranque rápido (local)

1) Instalar dependencias

```bash
npm install
```

2) Crear variables de entorno

```bash
copy .env.example .env
```

3) Restaurar el dump base

```bash
psql -U postgres -d fondo_cano -f "C:/Users/carlo/Downloads/dump_fondo_cano.sql"
```

4) Compilar TypeScript (necesario para `migrate`, `seed`, `create-admin` y `npm start` en producción)

```bash
npm run build
```

5) Ejecutar migraciones y seed

```bash
npm run migrate
npm run seed
```

En desarrollo puedes usar los mismos scripts vía TypeScript sin compilar: `npm run migrate:dev`, `npm run seed:dev`, `npm run create-admin:dev`.

6) Crear o actualizar usuario admin

```bash
npm run create-admin -- admin@fondo-cano.local TuPasswordSegura123
```

7) Levantar API

```bash
npm run dev
```

8) Compilar y ejecutar build de producción (otra vez si hubo cambios)

```bash
npm run build
npm start
```

Healthcheck:

```bash
GET http://localhost:3000/health
```

## Endpoints principales

### Públicos
- `GET /api/v1/obras`
- `GET /api/v1/obras/:id`
- `GET /api/v1/obras/facets`
- `GET /api/v1/autores`
- `GET /api/v1/tecnicas`
- `GET /api/v1/imagenes/obra/:obraId`

### Admin (requiere Bearer token)
- `POST/PUT/PATCH/DELETE /api/v1/obras`
- `POST/PUT/PATCH/DELETE /api/v1/autores`
- `POST/PUT/PATCH/DELETE /api/v1/tecnicas`
- `POST/PUT/PATCH/DELETE /api/v1/imagenes`

### Auth
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`

## Pruebas

```bash
npm test
```

## Notas de TypeScript

- El código fuente vive en `src/**/*.ts`, `scripts/**/*.ts` y `tests/**/*.ts`.
- `npm run dev` ejecuta la API con `tsx` en modo watch.
- `npm run build` compila TypeScript a `dist/`.
- `npm start` ejecuta `dist/src/server.js` (salida real de `tsc` con la estructura actual del repo).

## Despliegue en Render / PaaS (Node)

- **Build**: `npm install && npm run build` (debe existir `dist/` antes de `npm start`).
- **Start**: `npm start` (equivale a `node dist/src/server.js`).
- **Migraciones** (opcional, una vez por despliegue o cuando cambien SQL): en el mismo entorno, tras el build, `npm run migrate`. En local sin compilar puedes usar `npm run migrate:dev`.

## Despliegue con Podman

Desde la carpeta `podman/`:

```bash
podman compose up -d --build
```

## Estructura rápida
- `src/modules/`: módulos por dominio (`obras`, `autores`, `tecnicas`, `imagenes`, `auth`)
- `db/migrations/`: cambios SQL versionados
- `db/seeds/`: datos iniciales
- `scripts/`: utilidades (`migrate`, `seed`, `create-admin`)

## Listo para GitHub

Si todavía no has subido el proyecto:

```bash
git init
git add .
git commit -m "Initial backend for Fondo Cano"
git branch -M main
git remote add origin <URL_DEL_REPO>
git push -u origin main
```
