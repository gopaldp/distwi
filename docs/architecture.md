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
- **PostgreSQL**: The database used to store sensor readings and user data.
- **paho-mqtt**: A client library for MQTT, used for subscribing to sensor data updates.

## Data Flow
1. **User Interaction**: Users interact with the client application, which sends requests to the FastAPI server.
2. **API Requests**: The server processes these requests, interacting with the PostgreSQL database as needed.
3. **MQTT Updates**: The server subscribes to MQTT topics to receive real-time sensor data updates, which are then stored in the database and made available to the client.
4. **Rendering**: The client retrieves data from the server and updates the UI accordingly, including rendering charts and the 3D model.

## Control Flow
- The client initiates API calls to the server for data retrieval.
- The server handles these requests, performs necessary database operations, and returns responses to the client.
- The server also listens for MQTT messages to update the database and notify the client of new data.

## Conclusion
This architecture allows for a responsive and interactive application that provides real-time insights into building sensor data alongside a 3D model visualization.