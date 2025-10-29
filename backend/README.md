# Backend Auth API

Express + MongoDB auth service providing signup/login for admins and customers.

## Environment

Create a `.env` file in `backend/` based on `.env.example`:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/todo_app
MONGODB_DB=todo_app
JWT_SECRET=replace_this_with_a_long_random_string
```

If running with Docker Compose, the included `docker-compose.yaml` already passes env vars and uses the `mongo` container.

## Install & Run (Local)

```
# from backend/
npm install
npm run dev
```

The API will start at `http://localhost:4000`.

If your frontend is Vite, set `VITE_API_BASE_URL=http://localhost:4000` in `frontend/.env`.

## Install & Run (Docker Compose)

```
# from project root
docker compose up --build
```

This will start:
- backend on port 4000
- mongo on port 27017
- frontend on port 5173 (if your frontend Dockerfile runs dev server)

## Routes

Base path: `/api`

- POST `/admins/signup` – Create an admin account
- POST `/admins/login` – Login admin
- POST `/users/signup` – Create a customer account
- POST `/users/login` – Login customer

All responses return JSON, and success includes a JWT token:

```
{
  "token": "<jwt>",
  "role": "admin|customer",
  "user_id": "<mongo_id>",
  "email": "user@example.com"
}
```

## Sample Requests (PowerShell)

```
# Admin signup
$body = @{ name = 'Admin'; email = 'admin@example.com'; password = 'secret123' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/api/admins/signup' -Body $body -ContentType 'application/json'

# Admin login
$body = @{ email = 'admin@example.com'; password = 'secret123' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/api/admins/login' -Body $body -ContentType 'application/json'

# Customer signup
$body = @{ name = 'Jane'; email = 'jane@example.com'; password = 'secret123' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/api/users/signup' -Body $body -ContentType 'application/json'

# Customer login
$body = @{ email = 'jane@example.com'; password = 'secret123' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/api/users/login' -Body $body -ContentType 'application/json'
```

## Notes
- Passwords are hashed with bcrypt.
- Admin vs customer is enforced by route; clients do not provide `role`.
- For production, lock down who can create admin accounts.
- Add rate-limiting and HTTPS in production.