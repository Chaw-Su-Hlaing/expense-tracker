# Daily Expense Tracker

Spring Boot backend (Java 17) + React/Vite/TypeScript frontend for tracking daily expenses, with category breakdowns and monthly summaries.

## Prerequisites

- **JDK 17** — required by the backend (Spring Boot 3.3.4 targets Java 17). If your machine's default `java`/`JAVA_HOME` points at an older JDK (check with `java -version`), you'll need to point Maven at a JDK 17 install instead of relying on the system default.
- **Maven** (`mvn -v`)
- **Node.js 18+** and npm (`node -v`, `npm -v`)

## Quick start (Windows / PowerShell)

From the project root:

```powershell
.\run-dev.ps1
```

This opens two PowerShell windows — one running the backend on `http://localhost:8080` (with `JAVA_HOME` set to JDK 17 for that window only), one running the frontend on `http://localhost:5173`. If your JDK 17 lives somewhere other than `C:\Program Files\Java\jdk-17`, pass it explicitly:

```powershell
.\run-dev.ps1 -JavaHome "D:\tools\jdk-17.0.12"
```

Then open http://localhost:5173.

## Manual setup

### Backend

```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"   # skip if this is already your default JDK
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
mvn spring-boot:run
```

Runs on `http://localhost:8080` with the `dev` profile active by default — an in-memory H2 database (data resets on restart) and CORS opened up for `http://localhost:5173`. H2 console is at `/h2-console` (JDBC URL `jdbc:h2:mem:expensetracker`, user `sa`, no password).

To point at Postgres instead, run with the `postgres` profile and set connection env vars:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/expensetracker"
$env:DB_USERNAME = "expensetracker"
$env:DB_PASSWORD = "expensetracker"
mvn spring-boot:run "-Dspring-boot.run.profiles=postgres"
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. It talks to the backend via `VITE_API_BASE_URL` in [frontend/.env](frontend/.env) (defaults to `http://localhost:8080/api`).

## API

| Method | Path | Description |
|---|---|---|
| POST | `/api/expenses` | Create an expense |
| GET | `/api/expenses` | List expenses (filters: `startDate`, `endDate`, `category`; paginated) |
| GET | `/api/expenses/{id}` | Get one expense |
| PUT | `/api/expenses/{id}` | Update an expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |
| GET | `/api/expenses/summary?month=yyyy-MM` | Today's total, month total, category breakdown (defaults to current month) |

## Deployment

The backend has a `Dockerfile` (JDK 17, builds a runnable jar) and reads two settings from the environment so the same image works for both local dev and hosted deploys — see [application.yml](backend/src/main/resources/application.yml):

| Env var | Purpose | Example |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `dev` (H2, default) or `postgres` (needs `DB_URL`/`DB_USERNAME`/`DB_PASSWORD`) | `postgres` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of origins allowed to call the API. Supports `*` wildcards (matched via Spring's `allowedOriginPatterns`) | `https://*.vercel.app,http://localhost:5173` |

**Backend on Render**: set `CORS_ALLOWED_ORIGINS` (and `SPRING_PROFILES_ACTIVE`/DB vars if using Postgres) under the service's **Environment** tab. Render's free tier spins the instance down after inactivity — the first request after idling can take 50s+ to respond while it wakes up.

**Frontend on Vercel**: set `VITE_API_BASE_URL` to the deployed backend's `/api` base (e.g. `https://your-backend.onrender.com/api`) under **Settings → Environment Variables**. Vite bakes this in at build time, so changing it requires a redeploy — it won't take effect on the currently-built output.
