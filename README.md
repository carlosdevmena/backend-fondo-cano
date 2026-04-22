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

4) Ejecutar migraciones y seed

```bash
npm run migrate
npm run seed
```

5) Crear o actualizar usuario admin

```bash
npm run create-admin -- admin@fondo-cano.local TuPasswordSegura123
```

6) Levantar API

```bash
npm run dev
```

7) Compilar y ejecutar build de producción

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
- `npm start` ejecuta `dist/server.js`.

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
