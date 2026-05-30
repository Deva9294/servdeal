ServDeal Backend - Run Instructions

Prerequisites:
- Node 18+ and npm
- MongoDB instance (local or cloud)

Quick start (development):

1. Copy env example:

```powershell
cd backend
copy .env.example .env
```

2. Edit `.env` and set `MONGO_URI` and `CLIENT_URL`.

3. Install and run:

```powershell
npm ci
npm run dev
```

API is available at `http://localhost:5000/api/v1` by default.

Profile location:
- Endpoint: `PATCH /api/v1/users/me`
- Body example: `{ "location": { "lat": 25.5941, "lng": 85.1376 } }`

Notes:
- Auth uses JWT issued from `/api/v1/auth/login` and attached as cookie and returned in response body.
- For local development allow `CLIENT_URL=http://localhost:3000`.
