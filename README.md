# Auth + PostgreSQL + Prisma — Teaching Project

JWT authentication + **user tasks** with **Express**, **PostgreSQL**, and **Prisma ORM**.

Students learn: register/login → then logged-in users **create and manage their own tasks** stored in PostgreSQL.

---

## Quick start

### 1. Install PostgreSQL + pgAdmin

Download from [postgresql.org/download](https://www.postgresql.org/download/)  
Default port: **5432**

### 2. Create database (pgAdmin)

```sql
CREATE DATABASE auth_db;
```

### 3. Setup project

```powershell
cd auth-postgres
npm install
copy .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/auth_db?schema=public"
JWT_ACCESS_SECRET=your-long-random-secret
```

### 4. Run migrations

```powershell
npm run db:generate
npm run db:migrate:init
npm run db:migrate:tasks
```

### 5. Start server

```powershell
npm start
```

Server: **http://localhost:4001**

---

## API endpoints

### Auth (public + profile)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Create user |
| POST | `/api/auth/login` | No | Login + tokens |
| POST | `/api/auth/refresh` | No | New accessToken |
| POST | `/api/auth/logout` | No | Revoke refreshToken |
| GET | `/api/auth/me` | Bearer accessToken | Profile |

### Tasks (logged-in users only)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/tasks` | Bearer accessToken | List **my** tasks |
| POST | `/api/tasks` | Bearer accessToken | Create task |
| GET | `/api/tasks/:id` | Bearer accessToken | Get one task |
| PUT | `/api/tasks/:id` | Bearer accessToken | Update task |
| DELETE | `/api/tasks/:id` | Bearer accessToken | Delete task |

**Create task body:**
```json
{ "title": "Learn Prisma", "description": "Optional" }
```

**Update task body:**
```json
{ "title": "Done", "completed": true }
```

---

## Postman flow for class

1. **Register** → copy `accessToken`
2. **POST /api/tasks** with Bearer token → create task
3. **GET /api/tasks** → list tasks
4. Open **pgAdmin** → `SELECT * FROM tasks;` → show `user_id` link
5. **PUT /api/tasks/1** → `{ "completed": true }`

---

## Database schema diagram

See **[docs/DATABASE-SCHEMA.md](docs/DATABASE-SCHEMA.md)** — ER diagram + table explanations.

---

## Teaching docs (for your class)

| Document | Content |
|----------|---------|
| [DATABASE-SCHEMA.md](docs/DATABASE-SCHEMA.md) | ER diagram, tables, relationships |
| [TEACHING-FULL-GUIDE.md](docs/TEACHING-FULL-GUIDE.md) | PostgreSQL, pgAdmin, Prisma, migrations (deep) |
| [TEACHING-POSTGRES-PRISMA.md](docs/TEACHING-POSTGRES-PRISMA.md) | Shorter Prisma intro |

---

## How backend connects to PostgreSQL

```
.env (DATABASE_URL)
    ↓
prisma/schema.prisma
    ↓
npm run db:migrate:init / db:migrate:tasks
    ↓
src/lib/prisma.js (PrismaClient)
    ↓
authService.js / taskService.js
    ↓
PostgreSQL (auth_db)
```

---

## Prisma commands

| Command | What it does |
|---------|--------------|
| `npm run db:generate` | Regenerate Prisma Client |
| `npm run db:migrate:init` | First migration (users, refresh_tokens) |
| `npm run db:migrate:tasks` | Add tasks table |
| `npm run db:studio` | Visual DB browser |
| pgAdmin | GUI for PostgreSQL |

---

## Troubleshooting

**Disk full (`ENOSPC`):** free space on C: drive before `npm run db:generate`

**Migration lock (`P1002`):** restart PostgreSQL service, then retry migrate

**Corrupted Prisma:** delete `node_modules`, kill `node.exe`, `npm install` again

---

## Compare with `auth` project

| | `auth` (array) | `auth-postgres` |
|--|----------------|-----------------|
| Storage | JavaScript array | PostgreSQL |
| User features | Auth only | Auth + **Tasks** |
| ORM | None | Prisma |
| Survives restart | No | Yes |
| Port | 4000 | 4001 |

## Folder structure

```
auth-postgres/
├── prisma/
│   ├── schema.prisma      ← Database design (blueprint)
│   └── migrations/        ← History of DB changes
├── src/
│   ├── server.js          ← Start server + connect DB
│   ├── app.js             ← Express setup
│   ├── lib/prisma.js      ← Database connection
│   ├── routes/            ← URLs (auth, tasks)
│   ├── controllers/       ← HTTP in/out
│   ├── services/          ← Business logic + DB queries
│   ├── middleware/        ← Auth check, validation
│   └── utils/             ← JWT helpers
├── .env                   ← Secrets + DATABASE_URL
└── docs/                  ← Teaching guides
```

