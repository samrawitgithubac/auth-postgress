# Complete teaching guide — PostgreSQL, pgAdmin, Prisma & migrations

Use this document to teach students step by step.

---

# PART 1 — What is PostgreSQL?

## Simple definition

**PostgreSQL** is software that **stores data permanently** on your computer or server.

Your Node.js app is the **brain** (logic).  
PostgreSQL is the **memory** (storage).

## Why not use arrays in JavaScript?

| Arrays in code | PostgreSQL |
|----------------|------------|
| Lost when server stops | Data stays |
| One server only | Many apps can connect |
| No structure enforcement | Tables, types, rules |
| Hard to search big data | Built for millions of rows |

## Key vocabulary

| Word | Meaning | Example |
|------|---------|---------|
| **Database** | Container for tables | `auth_db` |
| **Table** | Collection of rows | `users`, `tasks` |
| **Row** | One record | One user |
| **Column** | One field | `email`, `title` |
| **Primary Key (PK)** | Unique id per row | `id = 1` |
| **Foreign Key (FK)** | Link to another table | `tasks.user_id → users.id` |
| **SQL** | Language to query data | `SELECT * FROM users` |

## Real-world analogy

Think of PostgreSQL like a **library**:
- **Database** = the building
- **Table** = one shelf category (fiction, science)
- **Row** = one book
- **Column** = book properties (title, author, year)

---

# PART 2 — What is pgAdmin?

## Simple definition

**pgAdmin** is a **visual tool** to manage PostgreSQL without memorizing every command.

Download: comes with PostgreSQL installer, or [pgadmin.org](https://www.pgadmin.org/)

## What students use it for

1. Create databases
2. Run SQL queries
3. View table data (like Excel)
4. Check if register/login really saved data

## pgAdmin walkthrough (class demo)

### Step 1 — Connect to server

1. Open pgAdmin
2. Left panel: **Servers → PostgreSQL**
3. Enter password you set during install

### Step 2 — Create database

1. Right-click **Databases** → **Create → Database**
2. Name: `auth_db`
3. Save

Or SQL:
```sql
CREATE DATABASE auth_db;
```

### Step 3 — Open Query Tool

1. Click `auth_db`
2. **Tools → Query Tool**
3. Paste SQL and click **Execute (F5)**

```sql
SELECT * FROM users;
SELECT * FROM tasks;
```

### Step 4 — View tables visually

1. Expand: `auth_db → Schemas → public → Tables`
2. Right-click `users` → **View/Edit Data → All Rows**

**Teaching moment:** Register in Postman → refresh pgAdmin → new row appears!

### Step 5 — Useful pgAdmin features for class

| Feature | Use |
|---------|-----|
| Query Tool | Run SQL live |
| View Data | Show non-technical students the data |
| ERD Tool (optional) | Draw relationships |
| Dashboard | Check if PostgreSQL is running |

---

# PART 3 — What is Prisma?

## Simple definition

**Prisma** is a **bridge** between Node.js and PostgreSQL.

Instead of writing:
```sql
INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
```

You write:
```js
await prisma.user.create({
  data: { name, email, passwordHash }
});
```

## Prisma's 3 parts

```
┌──────────────────┐
│  schema.prisma   │  ← YOU write: models = tables
└────────┬─────────┘
         │ prisma migrate
         ▼
┌──────────────────┐
│   PostgreSQL     │  ← Real tables created
└────────┬─────────┘
         │ prisma generate
         ▼
┌──────────────────┐
│  Prisma Client   │  ← JS code: prisma.user.create()
└──────────────────┘
```

### 1. Schema (`prisma/schema.prisma`)

Blueprint of your database:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  tasks Task[]
}
```

### 2. Migrations

Prisma turns schema changes into SQL files and applies them.

### 3. Prisma Client

Generated JavaScript library used in your services:

```js
const prisma = require("./lib/prisma");
await prisma.task.findMany({ where: { userId: 1 } });
```

## Prisma vs raw SQL — when to teach what

| Teach SQL first | Then Prisma |
|-----------------|-------------|
| Students understand what's happening | Faster development |
| `SELECT`, `INSERT`, JOIN | `findMany`, `create`, `include` |

---

# PART 4 — What is a migration?

## Simple definition

A **migration** is a **saved change** to your database structure.

Examples:
- First migration: create `users` table
- Second migration: add `tasks` table
- Third migration: add `phone` column to users

## Why migrations matter

Without migrations:
- Student A has different tables than Student B
- Production server doesn't match your laptop
- Nobody knows what changed

With migrations:
- Every change is **written down** in `prisma/migrations/`
- Everyone runs same commands → same database shape

## Migration folder structure

```
prisma/
├── schema.prisma
└── migrations/
    ├── 20250819120000_init/
    │   └── migration.sql      ← CREATE TABLE users...
    └── 20250819130000_add_tasks/
        └── migration.sql      ← CREATE TABLE tasks...
```

## How to explain migration to students (script)

> "Our database design lives in `schema.prisma`. When we change it, we don't manually edit PostgreSQL. We run `npm run db:migrate:tasks`. Prisma compares the schema to the database, writes SQL for us, runs it, and saves history. That's a migration."

## Class demo — first migration

```powershell
npm run db:migrate:init
```

Show in pgAdmin: `users` and `refresh_tokens` tables appear.

## Class demo — second migration (tasks)

After adding `Task` model to schema:

```powershell
npm run db:generate
npm run db:migrate:tasks
```

Show in pgAdmin: `tasks` table appears.

## Common migration commands

| Command | When |
|---------|------|
| `npm run db:migrate:init` | First time setup |
| `npm run db:migrate:tasks` | After adding tasks model |
| `npm run db:generate` | After schema edit (regenerate client) |
| `npm run db:studio` | Visual browser for data |
| `npm run db:push` | Quick sync without migration file (dev only) |

## Migration rules for students

1. **Edit schema first**, then migrate
2. Never edit old migration SQL files by hand (beginners)
3. Commit `prisma/migrations/` to Git
4. Never commit `.env`

---

# PART 5 — Full project flow (teach in order)

## Lesson 1 — PostgreSQL + pgAdmin

- Install PostgreSQL
- Create `auth_db` in pgAdmin
- Run `SELECT 1;` in Query Tool

## Lesson 2 — Connect Node to DB

- `.env` with `DATABASE_URL`
- `src/lib/prisma.js`
- `npm run db:migrate:init`

## Lesson 3 — Auth (register/login)

- POST register → show row in pgAdmin `users`
- Explain password_hash (not plain text)

## Lesson 4 — JWT + protected routes

- GET `/api/auth/me` with Bearer token

## Lesson 5 — Relations + tasks

- Explain ER diagram in `DATABASE-SCHEMA.md`
- `npm run db:migrate:tasks`
- POST `/api/tasks` with token
- Show `tasks.user_id` links to `users.id` in pgAdmin

## Lesson 6 — Migrations deep dive

- Change schema (add column)
- Run new migration
- Show new SQL file in `prisma/migrations/`

---

# PART 6 — Postman demo script (tasks feature)

### 1. Register

```
POST http://localhost:4001/api/auth/register
Body: { "name": "Sam", "email": "sam@test.com", "password": "secret1" }
```

Copy `accessToken`.

### 2. Create task

```
POST http://localhost:4001/api/tasks
Authorization: Bearer <accessToken>
Body: { "title": "Learn Prisma", "description": "Study migrations" }
```

### 3. List my tasks

```
GET http://localhost:4001/api/tasks
Authorization: Bearer <accessToken>
```

### 4. Mark complete

```
PUT http://localhost:4001/api/tasks/1
Authorization: Bearer <accessToken>
Body: { "completed": true }
```

### 5. Verify in pgAdmin

```sql
SELECT * FROM tasks;
```

---

# PART 7 — Student Q&A

**Q: What is the difference between PostgreSQL and Prisma?**  
A: PostgreSQL stores data. Prisma helps Node.js talk to PostgreSQL.

**Q: What is pgAdmin?**  
A: GUI to see and query PostgreSQL.

**Q: What is a migration?**  
A: A version-controlled change to database structure.

**Q: Why foreign key on tasks.user_id?**  
A: Every task must belong to a real user. Database enforces integrity.

**Q: Why can't I see another user's tasks?**  
A: API filters by `req.user.userId` from JWT.

---

# PART 8 — One-slide summary

```
PostgreSQL  = permanent storage (tables)
pgAdmin     = visual tool to manage PostgreSQL
Prisma      = Node.js ORM (schema + client + migrations)
Migration   = saved SQL change applied to database
Schema      = design of tables (in schema.prisma)
```
