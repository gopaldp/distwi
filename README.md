# Distwi

Distwi is a web application for viewing building sensor data alongside an
IFC/BIM 3D model. A React client communicates with a FastAPI server, which
reads sensor data from PostgreSQL and ingests MQTT readings.

## Key features

- User login, registration, and password-reset pages.
- Protected dashboard routes for sensor data.
- Latest sensor values and historical numerical/non-numerical readings through
  the server API.
- IFC/BIM model viewing in the client.
- Theme support and a client plugin system under `client/src/plugin-system/`.
- MQTT subscription for writing incoming sensor readings to the database.

## Technology stack

- **Client:** React 19, TypeScript, Create React App, Material UI, Recharts,
  Three.js, That Open Components, and `web-ifc`.
- **Server:** Python 3.9, FastAPI, Uvicorn, SQLAlchemy, PostgreSQL via
  `psycopg2`, Paho MQTT, and `python-dotenv`.
- **Packaging:** Docker containers and GitHub Actions.

## Prerequisites

- Node.js 18 and npm.
- Python 3.9 and pip.
- PostgreSQL and an MQTT broker reachable by the server.
- Docker, if building or running the container images.

## Installation and build

Install client dependencies and create a production build:

```bash
cd client
npm install
npm run build
```

Install server dependencies:

```bash
python -m pip install -r server/requirements.txt
```

## Usage

Start the server from its directory:

```bash
cd server
uvicorn main:app --reload
```

The server listens on port `8000` by default when run with Uvicorn's default
settings. Its entry points include `GET /`, `GET /health`, `POST /login`,
`POST /register`, `POST /forgot-password`, `GET /sensors`, and
`GET /sensorData`.

Start the client:

```bash
cd client
npm start
```

The client development server runs on port `3000`. The application routes
include `/login`, `/register`, `/forgetPassword`, and the protected dashboard
routes.

The MQTT subscriber can also be started directly:

```bash
cd server
python mqtt_client.py
```

## Configuration

The server loads configuration from environment variables or a `.env` file.
Set these names without committing credentials:

- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_NAME`
- `MQTT_BROKER`
- `MQTT_PORT`
- `MQTT_TOPIC`
- `MQTT_USERNAME`
- `MQTT_PASSWORD`

## Project structure

```text
.
├── client/
│   ├── src/
│   │   ├── plugin-system/
│   │   └── routes/
│   ├── Dockerfile
│   └── package.json
├── server/
│   ├── main.py
│   ├── mqtt_client.py
│   ├── models.py
│   ├── database.py
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
└── .github/workflows/
    └── ci.yml
```

The sample IFC files under `client/public/assets/` provide model content for
the viewer.

## Testing

Run client tests in non-watch mode:

```bash
cd client
npm test -- --watchAll=false
```

Run server tests:

```bash
pytest server/tests
```

## Build and deployment

Build the client image:

```bash
docker build -t dtwin-client:latest ./client
```

Build the server image:

```bash
docker build -t dtwin-server:latest ./server
```

The client image builds the React application and exposes port `3000`. The
server image runs Uvicorn on port `8000`. The repository's registered
pipelines are **CI**, **Copilot Setup Steps**, **Generate or Update Docs**, and
**Generate or Update Docs (Gemini)**.

## Documentation

See the [documentation portal page](http://localhost:1313/repos/github/gopaldp/distwi/).
