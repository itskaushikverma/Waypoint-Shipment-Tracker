<p align="center">
  <img src="frontend/public/logo.svg" width="72" alt="Waypoint Shipment Tracker" />
</p>

<h1 align="center">Waypoint Shipment Tracker</h1>

<p align="center">
  Sign in, log a container route, update its location, and open the trip on a map.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express" />&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

---

## Preview

| Sign in                                                                | Create an account                                                              |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| <img src="docs/screenshots/login.png" alt="Waypoint sign in screen" /> | <img src="docs/screenshots/signup.png" alt="Waypoint create account screen" /> |

After sign-in, the dashboard lists your shipments, lets you add a numeric container with a start and end point, and opens any trip on an OpenStreetMap view.

## Features

- **Accounts** — Sign up, sign in, stay signed in with a JWT, and log out.
- **Shipment list** — Sort by container ID, location, ETA, or status.
- **Add shipment** — Enter a numeric container ID, coordinates, and status (`Pending` or `In Transit`).
- **Live location** — Update the current point; ETA is recalculated toward the destination.
- **Map** — Start, current position, destination, and remaining path on a map.
- **Owned data** — Each user only sees and edits their own shipments.

## Tech stack

| Layer   | Tools                                                                               |
| ------- | ----------------------------------------------------------------------------------- |
| Web app | React 19, Vite, Redux Toolkit Query, React Router, Tailwind CSS, shadcn/ui, Leaflet |
| API     | Node.js, Express 5, Mongoose, JWT, bcrypt                                           |
| Data    | MongoDB                                                                             |

## Architecture

```mermaid
flowchart LR
  Browser["React app<br/>localhost:5173"] -->|Bearer JWT| API["Express API<br/>localhost:5000"]
  API --> Auth["/api/auth"]
  API --> Shipments["/api/shipment"]
  Auth --> Mongo[(MongoDB)]
  Shipments --> Mongo
```

Every JSON response uses the same envelope:

```json
{ "success": true, "data": {}, "message": "Logged in successfully." }
```

Failed requests use `"success": false` and `"data": null`.

## Getting started

Use **Node.js 20+** and a MongoDB database.

### 1. Clone

```bash
git clone https://github.com/itskaushikverma/waypoint.git
cd waypoint
```

### 2. API

```bash
cd backend
cp .env.example .env
npm install
npm start
```

The API listens on [http://localhost:5000](http://localhost:5000).

### 3. Web app

In a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment

### `backend/.env`

| Variable                     | Purpose                                                               |
| ---------------------------- | --------------------------------------------------------------------- |
| `PORT`                       | API port. Local default is `5000`.                                    |
| `MONGO_URI`                  | MongoDB connection string.                                            |
| `JWT_SECRET`                 | Signing secret. Use at least 32 characters.                           |
| `FRONTEND_URL`               | Allowed browser origin, for example `http://localhost:5173`.          |
| `CHECK_DISPOSABLE_EMAIL_URL` | Optional disposable-email check. Signup still works if this is unset. |

### `frontend/.env`

| Variable       | Purpose                         |
| -------------- | ------------------------------- |
| `VITE_API_URL` | API base URL, including `/api`. |

## API

Send the access token as `Authorization: Bearer <token>`.

| Method | Path                               | Auth |
| ------ | ---------------------------------- | ---- |
| `POST` | `/api/auth/signup`                 | No   |
| `POST` | `/api/auth/login`                  | No   |
| `POST` | `/api/auth/logout`                 | Yes  |
| `GET`  | `/api/auth/me`                     | Yes  |
| `GET`  | `/api/shipment`                    | Yes  |
| `POST` | `/api/shipment`                    | Yes  |
| `GET`  | `/api/shipment/:id`                | Yes  |
| `POST` | `/api/shipment/:id/updatelocation` | Yes  |
| `GET`  | `/api/shipment/:id/eta`            | Yes  |
| `GET`  | `/health`                          | No   |

## Project structure

```text
.
├── backend/          Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── frontend/         React app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── redux/
└── docs/screenshots/
```

---

<!-- AUTHOR:START -->

## 👨‍💻 Author

**Kaushik Verma**

<p align="center">
  <a href="https://www.kaushikverma.com"><img src="https://img.shields.io/badge/Portfolio-114B5F?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Portfolio" /></a>&nbsp;&nbsp;
  <a href="https://github.com/itskaushikverma"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>&nbsp;&nbsp;
  <a href="https://www.linkedin.com/in/itskaushikverma"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>&nbsp;&nbsp;
  <a href="https://x.com/SilentK68296830"><img src="https://img.shields.io/badge/X-111111?style=for-the-badge&logo=x&logoColor=white" alt="X" /></a>&nbsp;&nbsp;
  <a href="https://www.instagram.com/itskaushikverma"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" /></a>&nbsp;&nbsp;
  <a href="mailto:kaushikverma321@gmail.com"><img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
</p>
<!-- AUTHOR:END -->
