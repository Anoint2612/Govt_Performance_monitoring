# HQ System Backend (HQ Admin MVP)

## Setup
1. Ensure MongoDB is running locally or provide a remote URI.
2. Copy `.env` and set values:

```
MONGO_URI=mongodb://127.0.0.1:27017/hq_system
JWT_SECRET=change_me
PORT=5000
```

3. Install and run:

```
npm install
npm run dev
```

## API Base
`/api/v1`

### Auth
- `POST /auth/login` { email, password }
- `POST /auth/register-manager` (HQ only, Bearer token)

### HQ Admin
- `GET /hq/projects` - Get all projects with manager details
- `POST /hq/projects` - Create new project { title, details, budget, deadline, managerId, status }
- `GET /hq/managers` - Get all managers for project assignment
- `GET /hq/managers-with-projects` - Get all managers with their assigned projects and stats
- `GET /hq/inspection-reports`
- `GET /hq/alerts`
- `GET /hq/performance?minScore=0&maxScore=100`
- `POST /hq/resolve-ticket/:id`
- `GET /hq/tickets/escalated`

