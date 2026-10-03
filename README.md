# Building Sensor Data Viewer

## Description
This project is a web application for viewing building sensor data alongside an IFC (BIM) 3D model. It consists of a React + TypeScript client that communicates with a FastAPI server, which reads sensor readings from PostgreSQL and ingests new readings over MQTT.

## Key Features
- View building sensor data in real-time.
- Interactive 3D model visualization using IFC.
- User authentication and management.

## Tech Stack
- **Client:** React 19, TypeScript, MUI, Recharts, Three.js, web-ifc.
- **Server:** FastAPI, SQLAlchemy, PostgreSQL, paho-mqtt, passlib.

## Prerequisites
- Node.js (version 14 or higher)
- Python (version 3.8 or higher)
- PostgreSQL

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/gopaldp/distwi.git
   cd distwi
   ```
2. Install server dependencies:
   ```bash
   cd server
   pip install -r requirements.txt
   ```
3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

## Usage
### Running the Server
1. Start the server:
   ```bash
   cd server
   uvicorn main:app --reload
   ```

### Running the Client
1. Start the client:
   ```bash
   cd client
   npm start
   ```

## Configuration
- Environment variables are defined in the `.env` file. Ensure to set the following:
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

## Project Structure
```
.
├── client
│   ├── src
│   ├── public
│   └── package.json
├── server
│   ├── main.py
│   ├── models.py
│   └── requirements.txt
└── .github
    └── workflows
        └── ci.yml
```

## Testing
- Client tests are located in `client/src/*.test.tsx` and can be run using:
  ```bash
  npm test
  ```
- Server tests are located in `server/tests/` and can be run using:
  ```bash
  pytest
  ```

## Docker
- Dockerfiles are available in both `client/` and `server/` directories for containerization.

## Links
- [Client README](client/README.md) (default Create React App README)
