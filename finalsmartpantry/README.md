# SmartPantry MVP

SmartPantry is a full-stack MVP that lets a user register or sign in, maintain a pantry tied to their own account, and receive recipe recommendations ranked by pantry coverage, freshness urgency, and quantity fit.

## What is fixed in this build

- Authentication is a real gate now: the dashboard only appears after login or registration.
- New users start with an empty pantry.
- Returning users automatically get their saved pantry back after sign-in.
- Pantry changes are stored in the database per account.
- Recommendations use the uploaded local `recipes.json` dataset.
- Recommendation cards render in a wide grid so you see 3–4 per row on larger screens.
- `node_modules` and lockfiles are intentionally not included to avoid broken registry URLs from older environments.

## Project structure

```text
smartpantry-mvp/
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── data/
│   │   └── recipes.json
│   ├── db/
│   │   ├── database.js
│   │   └── storage/
│   │       └── users.db
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── pantryRoutes.js
│   │   └── recipeRoutes.js
│   └── services/
│       ├── authService.js
│       └── recommendationService.js
└── frontend/
    ├── package.json
    ├── index.html
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── components/
        └── services/
```

## Install and run

Open two terminals.

### Backend

```bash
cd smartpantry-mvp/backend
npm install
npm run dev
```

### Frontend

```bash
cd smartpantry-mvp/frontend
npm install
npm run dev
```

## Backend endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/pantry`
- `POST /api/recipes/recommend`

## Working flow

1. User registers or logs in.
2. The backend returns a JWT and the user profile.
3. New users begin with an empty pantry.
4. Existing users get their saved pantry back from the database.
5. Pantry add/remove/clear actions persist to the database.
6. Recommendation requests score recipes using the uploaded JSON dataset.
