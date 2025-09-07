from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from models import Base, Sensor, Channel, NumericalValue, NonNumericalValue
from database import engine, SessionLocal
from contextlib import asynccontextmanager
import threading
from mqtt_client import start_mqtt
from sqlalchemy import desc
from collections import defaultdict
import pandas as pd
from user_utils import read_users, write_user, update_user_password
app = FastAPI()



@asynccontextmanager
async def lifespan(app: FastAPI):
    mqtt_thread = threading.Thread(target=start_mqtt, daemon=True)
    mqtt_thread.start()
    yield

app = FastAPI(lifespan=lifespan)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "https://distwi-client-app-cab5h9atb7c0h0dr.germanywestcentral-01.azurewebsites.net" # <--- ADD THIS LINE
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

class ChangePasswordRequest(BaseModel):
    username: str
    old_password: str
    new_password: str

class RegisterUser(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str


@app.get("/")
def root():
    return {"message": "Backend running"}


@app.post("/login")
def login(payload: LoginRequest):
    USERS = read_users()
    user = USERS.get(payload.username)
    if not user:
        raise HTTPException(status_code=401, detail="User does not exist")
    if user["password"] != payload.password:
        raise HTTPException(status_code=403, detail="Incorrect password")
    return {"token": f"{payload.username}-token", "role": user["role"], "user": f"{payload.username}"}

@app.post("/register", status_code=201)
def register_user(user_data: RegisterUser):
    USERS = read_users()
    if user_data.username in USERS:
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = {
        "username": user_data.username,
        "password": user_data.password,
        "role": "user"
    }
    write_user(new_user)
    return {"message": "User registered successfully"}

from fastapi import Request

@app.post("/forgot-password")
def forgot_password(request: Request, payload: ChangePasswordRequest):
    USERS = read_users()
    user = USERS.get(payload.username)
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")
    # No need to validate old password here
    update_user_password(payload.username, payload.new_password)
    return {"message": "Password reset successfully"}


@app.get("/sensors")
def get_latest_sensor_values():
    
    db = SessionLocal()
    subquery = (
        db.query(
            NumericalValue.sensor_name,
            NumericalValue.channel_id,
            NumericalValue.value,
            NumericalValue.time,
        )
        .order_by(
            NumericalValue.sensor_name,
            NumericalValue.channel_id,
            desc(NumericalValue.time)
        )
        .all()
    )

    latest = {}
    for record in subquery:
        key = (record.sensor_name, record.channel_id)
        if key not in latest:
            latest[key] = {
                "sensor_name": record.sensor_name,
                "channel_id": record.channel_id,
                "value": float(record.value),
                "time": record.time.isoformat(),
            }
    result = defaultdict(dict)
    for entry in latest.values():
        name = entry["sensor_name"]
        cid = entry["channel_id"]
        if cid == 101:
            result[name]["temperature"] = entry
        elif cid == 102:
            result[name]["humidity"] = entry
        elif cid == 103:
            result[name]["pressure"] = entry

    db.close()
    print(result)
    return {"sensors": result}

@app.get("/sensorData")
def get_sensor_data(sensor_name: str = Query(...)):
    print("cem ehre")
    sensor_name="BP-NT-53-01"
    db = SessionLocal()
    result = {"Numerical": [], "NonNumerical": []}

    numerical = (
        db.query(NumericalValue)
        .filter(NumericalValue.sensor_name == sensor_name)
        .order_by(NumericalValue.time.asc())
        .all()
    )
    for entry in numerical:
        result["Numerical"].append({
            "channel_id": entry.channel_id,
            "value": float(entry.value),
            "time": entry.time.isoformat(),
        })

    non_numerical = (
        db.query(NonNumericalValue)
        .filter(NonNumericalValue.sensor_name == sensor_name)
        .order_by(NonNumericalValue.time.asc())
        .all()
    )
    for entry in non_numerical:
        result["NonNumerical"].append({
            "channel_id": entry.channel_id,
            "value": entry.value,
            "time": entry.time.isoformat(),
        })
    db.close()
    return {"sensor_name": sensor_name, "data": result}
@app.get("/health")
def health():
    return {"status": "ok"}