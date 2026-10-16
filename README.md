# Smart Expense & Subscription Tracker

A beginner-friendly full-stack app for recording expenses, managing subscriptions and budgets, and viewing a financial dashboard. The website adapts to laptop and mobile screens.

## Quick start on Windows

Open PowerShell in the project folder. If your prompt currently shows another folder, enter:

```powershell
cd "E:\Smart expense & subscription tracker"
```

Install dependencies once:

```powershell
npm run setup
```

Start the frontend and backend together:

```powershell
npm run dev
```

Keep that terminal open. Open the **Local** URL Vite prints, usually http://localhost:5173. Sign in with the preloaded demo account to explore a populated dashboard, or register your own account. Press **Ctrl+C** in the terminal to stop both servers.

### Demo account

The local embedded database is automatically seeded with sample expenses, budgets, subscriptions, and notifications on first startup:

- **Email:** `admin@gmail.com`
- **Password:** `admin`

This is a demo account for the app's regular user dashboard, not an account with separate administrator permissions. The credentials are intentionally simple for local demonstration only; do not use this account or password in a public or production deployment. The demo account is not seeded when using an external PostgreSQL database.

## Deploy the app

Deploy the frontend to GitHub Pages and the API with PostgreSQL to Render:

1. In Render, create a **Blueprint** from this repository and approve the services defined in `render.yaml`. Render provisions the PostgreSQL database and API, configures a private JWT secret, and restricts API access to this project's GitHub Pages origin.
2. After Render finishes deploying the API, copy its HTTPS URL. If Render assigned a different URL from `https://smart-expense-subscription-tracker-api.onrender.com`, add a GitHub Actions repository variable named `VITE_API_URL` with the API URL ending in `/api` (for example, `https://your-api.onrender.com/api`).
3. Push to `main` or manually run **Deploy frontend to GitHub Pages** from the **Actions** tab. The workflow switches Pages to Actions publishing automatically.

The frontend will be available at `https://omlendal.github.io/Smart-expense-subscription-tracker/`. The Pages workflow builds the app at the correct repository path and uses hash-based routing, so refreshes work. GitHub Pages cannot host the backend. Create a new user account on the deployed app; the local demo account is not added to the production database. Render's free database has provider-imposed storage and availability limits; use a suitable persistent database plan for ongoing use.

## Database

The local app uses an embedded PostgreSQL-compatible database by default. You do not need to install PostgreSQL or Docker. The backend creates the schema automatically and stores local data in `backend/data/pglite`, which is ignored by Git.

To use an existing PostgreSQL server instead:

1. Create a database named `expense_tracker`.
2. Copy `backend/.env.example` to `backend/.env`.
3. Set `DATABASE_URL` and a private `JWT_SECRET` in `backend/.env`.
4. Restart the app.

Leave `DATABASE_URL` unset to keep using the embedded local database. Never commit `backend/.env` or expose its secrets.

## Use from a mobile phone

1. Connect the phone and computer to the same Wi-Fi network.
2. Run `npm run dev` on the computer.
3. Find the Vite **Network** URL printed in the terminal (for example, `http://192.168.1.25:5173`) and open it on the phone.
4. If the site loads but cannot reach the API, allow Node.js through the computer firewall on the private network.

Do not use `localhost` on the phone; it refers to the phone itself. The frontend uses the same hostname as the website to reach the backend on port `5000`.

## Project flow

```text
Browser (React) -> Express API -> Controller -> Service -> Model -> Database
```

The frontend runs on port `5173`. The Express backend runs on port `5000`.

## Technology

- Frontend: React, Vite, React Router, Recharts
- Backend: Node.js and Express
- Local database: PGlite (embedded PostgreSQL-compatible database)
- Optional database: PostgreSQL
- Authentication: JWT and bcrypt
- API documentation: Swagger/OpenAPI
- Tests: Jest and Supertest

## Folder structure

```text
.
├── backend/              # Express API, models, services, and tests
├── database/             # SQL schema and optional sample records
├── docs/                 # Postman collection and supporting material
├── frontend/             # React screens, components, and styles
├── API.md                # API endpoint reference
├── FLOW.md               # App flow diagrams
├── package.json          # Root setup and run commands
└── README.md
```

## Useful commands

Run from the project root:

```powershell
npm run setup             # Install root, backend, and frontend dependencies (one time)
npm run dev               # Start frontend and backend together
```

Run backend tests:

```powershell
cd backend
npm test
```

Build the frontend:

```powershell
cd frontend
npm run build
```

## Main API endpoints

Local API base URL: `http://localhost:5000`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in |
| GET, POST | `/api/expenses` | List or create expenses |
| PUT, DELETE | `/api/expenses/:id` | Update or delete an expense |
| GET, POST | `/api/subscriptions` | List or create subscriptions |
| PUT, DELETE | `/api/subscriptions/:id` | Update or delete a subscription |
| GET, POST | `/api/budgets` | List or create budgets |
| PUT | `/api/budgets/:id` | Update a budget |
| GET | `/api/dashboard/summary` | Load dashboard data |
| GET | `/api/notifications` | List notifications |
| PUT | `/api/notifications/:id/read` | Mark a notification as read |

Swagger documentation is available at http://localhost:5000/api-docs. See [API.md](./API.md) for endpoint details.

## Troubleshooting

- **`npm` says it cannot find `package.json`:** first `cd` into the project root shown above, not the `backend` or `frontend` folder.
- **Login or registration shows a server error:** check the `npm run dev` terminal for backend startup errors. The backend initializes the local database before it accepts requests.
- **Backend does not respond:** open http://localhost:5000/health on the computer.
- **Port already in use:** close the other app using port `5000` or `5173`, then run `npm run dev` again.
- **Phone cannot load data:** use the Vite **Network** URL, keep both devices on the same Wi-Fi, and allow Node.js through the private-network firewall.

## Additional documentation

- [API.md](./API.md) — API request and response reference
- [FLOW.md](./FLOW.md) — application flow
- [docs/postman_collection.json](./docs/postman_collection.json) — Postman collection
