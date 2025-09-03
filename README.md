# Backend Courier

API REST en Node.js + Express + PostgreSQL.

## Requisitos
- Node.js 18+
- Docker (opcional para BD)

## Pasos rápidos
1) Clonar este proyecto o descargar el zip.
2) `cp .env.example .env` y ajustar `DATABASE_URL` y `JWT_SECRET`.
3) Levantar Postgres con Docker: `docker compose up -d`
4) Instalar deps: `npm i`
5) Migrar BD: `npm run migrate`
6) Crear admin: `npm run seed:admin` (variables ADMIN_* opcionales en .env)
7) Iniciar: `npm run dev`

## Endpoints principales
- `POST /api/auth/login` { email, contrasena }
- `GET /api/auth/me` (Bearer token)
- `GET /api/usuarios` (admin)
- `POST /api/usuarios` (admin)
- `GET /api/envios` (query: q, estado)
- `POST /api/envios`
- `GET /api/envios/:id`
- `PUT /api/envios/:id`
- `PATCH /api/envios/:id/estado`
- `GET /api/incidentes`
- `POST /api/incidentes`
- `PATCH /api/incidentes/:id/resolver`
- `POST /api/pagos`
- `GET /api/pagos`
- `POST /api/entregas`
- `GET /api/rutas` / `POST /api/rutas`
- `GET /api/historial/envio/:id`

## Notas
- JWT expira en 12h.
- Soft delete de usuarios (activo=false).
- Historial guarda cada cambio de estado de envío.
