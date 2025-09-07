import paho.mqtt.client as mqtt
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import SessionLocal
import os
from dotenv import load_dotenv
from typing import Optional # <--- IMPORT THIS

load_dotenv()

# MQTT settings
MQTT_BROKER = os.getenv("MQTT_BROKER")
MQTT_PORT = int(os.getenv("MQTT_PORT"))
MQTT_TOPIC = os.getenv("MQTT_TOPIC")
MQTT_USERNAME = os.getenv("MQTT_USERNAME")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")

db: Session = SessionLocal()

# Function to get channel_id from sensor and channel names
def get_channel_id(sensor_name: str, channel_name: str) -> Optional[int]: # <--- CORRECTED
    query = text("""
        SELECT c.id FROM channels c
        JOIN sensors s ON c.sensor_id = s.id
        WHERE s.name = :sensor_name AND c.name = :channel_name
    """)
    result = db.execute(query, {"sensor_name": sensor_name, "channel_name": channel_name}).fetchone()
    if result:
        return result[0]
    return None

# Function to insert numerical value
def insert_numerical_value(channel_id: int, value: float) -> Optional[int]: # <--- CORRECTED
    query = text("""
        INSERT INTO numerical_values (channel_id, value)
        VALUES (:channel_id, :value)
        RETURNING id
    """)
    result = db.execute(query, {"channel_id": channel_id, "value": value}).fetchone()
    db.commit()
    if result:
        return result[0]
    return None

# Function to insert non-numerical value
def insert_non_numerical_value(channel_id: int, value: str) -> Optional[int]: # <--- CORRECTED
    query = text("""
        INSERT INTO non_numerical_values (channel_id, value)
        VALUES (:channel_id, :value)
        RETURNING id
    """)
    result = db.execute(query, {"channel_id": channel_id, "value": value}).fetchone()
    db.commit()
    if result:
        return result[0]
    return None

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("Connected to MQTT Broker!")
        client.subscribe(MQTT_TOPIC)
    else:
        print(f"Failed to connect, return code {rc}\n")


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    # print(msg.topic + " " + str(msg.payload))
    topic_parts = msg.topic.split('/')
    if len(topic_parts) >= 4:
        sensor_name = topic_parts[2]
        channel_name = topic_parts[3]
        value = msg.payload.decode()

        channel_id = get_channel_id(sensor_name, channel_name)
        if channel_id:
            try:
                # Try to convert to float for numerical values
                numerical_value = float(value)
                insert_numerical_value(channel_id, numerical_value)
                print(f"Inserted numerical value {numerical_value} for channel {channel_id}")
            except ValueError:
                # If conversion fails, treat as non-numerical
                insert_non_numerical_value(channel_id, value)
                print(f"Inserted non-numerical value '{value}' for channel {channel_id}")
        else:
            print(f"Channel not found for sensor '{sensor_name}' and channel '{channel_name}'")


def start_mqtt():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER, MQTT_PORT, 60)

    client.loop_start()

if __name__ == '__main__':
    start_mqtt()
    # Keep the script running
    import time
    while True:
        time.sleep(1)