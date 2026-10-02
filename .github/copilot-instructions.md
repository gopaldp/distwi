# Copilot instructions

## Project

Web app for viewing building sensor data together with an IFC (BIM) 3D
model. A React + TypeScript client talks to a FastAPI server; the server
reads sensor readings from PostgreSQL and ingests new readings over MQTT.

Stack:
- `client/`: React 19 + TypeScript (Create React App / `react-scripts`),
  MUI, Recharts, Three.js with That Open Components and `web-ifc` for the IFC
  viewer. Scripts: `npm start`, `npm run build`, `npm test`.
- `server/`: Python FastAPI, SQLAlchemy + PostgreSQL (`psycopg2`),
  `paho-mqtt`, `passlib`. Dependencies are in `server/requirements.txt`.

How it runs:

1. Server: `pip install -r server/requirements.txt`, then from `server/`,
   `uvicorn main:app --reload`. On startup it starts an MQTT subscriber thread
   (`mqtt_client.py`) and creates DB tables (`models.py`).
   Endpoints (`server/main.py`): `GET /`, `POST /login`, `POST /register`,
   `POST /forgot-password`, `GET /sensors`, `GET /sensorData`, `GET /health`.
2. Client: `cd client && npm install && npm start`. Routes (`client/src/App.tsx`
   and `routes/`): `/login`, `/register`, `/forgetPassword`, and a protected
   `/dashboard` area. The client calls `http://localhost:8000` (hard-coded in
   the route components).
3. Tests: `server/tests/` (pytest) and `client/src/*.test.tsx` (Jest).
4. Docker: `client/Dockerfile` and `server/Dockerfile`. CI: `.github/workflows/ci.yml`.

Configuration (server, read from environment or `.env` via `python-dotenv`):
`DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_HOST`, `DATABASE_PORT`,
`DATABASE_NAME`, `MQTT_BROKER`, `MQTT_PORT`, `MQTT_TOPIC`, `MQTT_USERNAME`,
`MQTT_PASSWORD`. Users are stored in `server/assets/users.csv` (git-ignored).

## Documentation notes

- There is **no root `README.md`**. Create one covering both parts.
  `client/README.md` is the default Create React App README; leave it, or link
  to it.
- Document environment variable **names** only. Never include values, hosts or
  credentials, even if they appear in code or comments.
- The CORS allow-list in `server/main.py` includes an Azure Web App URL. Do not
  repeat deployment URLs in the docs.
- The plugin system is in `client/src/plugin-system/` (registered plugins under
  `plugins/`). Describe it only from that code.

## Ignore

- `node_modules/`, build output, `client/public/web-ifc/*.wasm`, and the
  sample model `client/public/assets/*.ifc` (mention its purpose only).

## Conventions

- Keep changes small and focused. One concern per pull request.
- Base documentation on the actual code. Never invent features, metrics or
  commands. Mark anything uncertain with `TODO: confirm …`.
- Use UTF-8 for all text files.
