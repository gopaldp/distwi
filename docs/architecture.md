# Architecture Overview

## Components
This document provides an overview of the architecture of the Building Sensor Data Viewer application, detailing the main components and their interactions.

### Client
- **React + TypeScript**: The client is built using React and TypeScript, providing a dynamic user interface for visualizing sensor data and the 3D model.
- **MUI**: Material-UI is used for styling and layout.
- **Recharts**: Used for rendering charts and graphs based on sensor data.
- **Three.js**: A JavaScript library for creating 3D graphics, used for rendering the IFC model.
- **web-ifc**: A library for handling IFC files in the browser.

### Server
- **FastAPI**: The server is built using FastAPI, providing a RESTful API for the client to interact with.
- **SQLAlchemy**: Used for database interactions with PostgreSQL.
- **PostgreSQL**: Stores sensors, channels and their readings (`server/models.py`). Login, registration and password reset read and write users in `server/assets/users.csv` (`server/user_utils.py`), not the database.
- **paho-mqtt**: A client library for MQTT, used for subscribing to sensor data updates.

## Data Flow
1. **User Interaction**: Users interact with the client application, which sends requests to the FastAPI server.
2. **API Requests**: The server processes these requests, interacting with the PostgreSQL database as needed.
3. **MQTT Updates**: On startup the server runs an MQTT subscriber thread (`server/mqtt_client.py`) that stores incoming sensor readings in the database.
4. **Rendering**: The client requests data from the server over HTTP (for example `GET /sensors` and `GET /sensorData`) and renders charts and the 3D model. The server does not push updates to the client; there is no WebSocket or server-sent events endpoint.

## Control Flow
- The client initiates API calls to the server for data retrieval.
- The server handles these requests, performs necessary database operations, and returns responses to the client.
- The server also listens for MQTT messages and writes them to the database. Clients see new readings the next time they request data.