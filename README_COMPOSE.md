Docker Compose quick start

1. Copy compose env file to `.env` (or edit `.env.compose` values):

```powershell
copy .env.compose .env
```

2. Build and start the stack:

```powershell
docker compose up --build
```

Services:
- Frontend: http://localhost
- Backend API: http://localhost/api/v1

Note: Compose exposes MongoDB on host port 27017 for debugging.
