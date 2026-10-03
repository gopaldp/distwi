# Setup Guide

## Local Setup
This document provides a guide for setting up the Building Sensor Data Viewer application locally for development and testing.

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (version 14 or higher)
- **Python** (version 3.8 or higher)
- **PostgreSQL**

### Cloning the Repository
1. Clone the repository:
   ```bash
   git clone https://github.com/gopaldp/distwi.git
   cd distwi
   ```

### Setting Up the Server
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `server/` directory based on the `.env.example` file, and fill in the required environment variables:
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
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Setting Up the Client
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install the required Node.js packages:
   ```bash
   npm install
   ```
3. Start the React application:
   ```bash
   npm start
   ```

### Troubleshooting
- If you encounter issues with PostgreSQL, ensure that the database is running and accessible.
- Check the console for any errors during the server or client startup.

## Conclusion
Following this guide will set up the Building Sensor Data Viewer application locally, allowing you to develop and test features effectively.