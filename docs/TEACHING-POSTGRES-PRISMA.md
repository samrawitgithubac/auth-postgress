# Teaching guide: PostgreSQL + Prisma + Auth

Use this in class after students understand the basic `auth` project (arrays).

---

## 1. What is PostgreSQL?

**PostgreSQL** is a relational database — data lives in **tables** (like Excel sheets).

| Term | Meaning |
|------|---------|
| Database | Container (`auth_db`) |
| Table | Collection of rows (`users`, `refresh_tokens`) |
| Row | One record (one user) |
| Column | One field (`email`, `password_hash`) |
| SQL | Language to read/write data |

**Why not arrays?**
- Data survives server restart
- Handles many users safely
- Used in real production apps

**Default port:** 5432

---

## 2. What is Prisma?

**Prisma** connects Node.js to PostgreSQL without writing raw SQL everywhere.

| Piece | Role |
|-------|------|
| `schema.prisma` | Defines tables (blueprint) |
| `prisma migrate` | Creates tables in PostgreSQL |
| `Prisma Client` | JavaScript API: `prisma.user.create()` |

**Flow:**
```
schema.prisma  →  migrate  →  PostgreSQL tables
                    ↓
              Prisma Client  →  your service code
```

---

## 3. Schema explained (`prisma/schema.prisma`)

```prisma
model User {
  id           Int      @id @default(autoincrement())
  name         String
  email        String   @unique
  passwordHash String   @map("password_hash")
  createdAt    DateTime @default(now()) @map("created_at")
  refreshTokens RefreshToken[]
  @@map("users")
}
```

| Prisma | PostgreSQL |
|--------|------------|
| `model User` | table `users` |
| `@id @default(autoincrement())` | SERIAL PRIMARY KEY |
| `@unique` on email | UNIQUE constraint |
| `@map("password_hash")` | column name in DB |
| `RefreshToken[]` | one user has many refresh tokens |

---

## 4. Setup steps (class demo order)

### Step A — Install PostgreSQL
Show pgAdmin. Create database `auth_db`.

### Step B — Configure `.env`
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/auth_db?schema=public"
```

Explain URL parts:
```
postgresql:// USER : PASSWORD @ HOST : PORT / DATABASE
```

### Step C — Run migration
```bash
npm run db:migrate
```

Show in pgAdmin: tables `users` and `refresh_tokens` appeared.

### Step D — Start server
```bash
npm start
```

Should print: `PostgreSQL connected via Prisma`

### Step E — Register in Postman
```json
POST /api/auth/register
{ "name": "Sam", "email": "sam@test.com", "password": "secret1" }
```

### Step F — Show data in database
```sql
SELECT * FROM users;
SELECT * FROM refresh_tokens;
```

**Key moment:** Restart server → data still there!

---

## 5. How connection works in code

**`src/lib/prisma.js`**
```js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = prisma;
```

**`src/server.js`**
```js
await prisma.$connect();  // test connection on startup
```

**`src/services/authService.js`**
```js
await prisma.user.create({ data: { name, email, passwordHash } });
await prisma.user.findUnique({ where: { email } });
await prisma.refreshToken.create({ data: { token, userId, expiresAt } });
```

Prisma converts these to SQL and sends to PostgreSQL.

---

## 6. Prisma vs raw SQL

| Task | Raw SQL | Prisma |
|------|---------|--------|
| Find user | `SELECT * FROM users WHERE email = $1` | `prisma.user.findUnique({ where: { email } })` |
| Create user | `INSERT INTO users ...` | `prisma.user.create({ data: {...} })` |
| Delete token | `DELETE FROM refresh_tokens ...` | `prisma.refreshToken.deleteMany({ where: { token } })` |

---

## 7. Useful Prisma tools

```bash
npm run db:studio    # Visual browser for your data
npm run db:migrate   # Apply schema changes
npm run db:generate  # Regenerate client after schema edit
```

---

## 8. Common errors

| Error | Fix |
|-------|-----|
| `Can't reach database server` | PostgreSQL not running |
| `database "auth_db" does not exist` | Run `CREATE DATABASE auth_db` |
| `Authentication failed` | Wrong password in DATABASE_URL |
| `P2002 Unique constraint` | Email already registered |
| `Prisma Client not generated` | Run `npm run db:generate` |

---

## 9. Classroom comparison slide

```
auth (array)                    auth-postgres (Prisma)
─────────────────              ─────────────────────────
let users = []                 PostgreSQL users table
users.push(user)               prisma.user.create()
data lost on restart           data persists
good for first lesson          good for real-world lesson
```

---

## 10. What production adds next

- Separate test database
- Connection pooling tuning
- Prisma migrations in CI/CD
- Indexes on email
- Refresh token rotation
