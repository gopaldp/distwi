# server/main.py

from fastapi import FastAPI
import logging

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

logger.info("Server is starting in NO-DATABASE mode for debugging.")

# --- DATABASE AND MQTT CODE TEMPORARILY DISABLED ---

# try:
#     models.Base.metadata.create_all(bind=database.engine)
#     logger.info("Database tables checked/created successfully.")
# except Exception as e:
#     logger.error(f"FATAL: Could not connect to the database on startup: {e}")

# try:
#     start_mqtt_client()
#     logger.info("MQTT client started successfully.")
# except Exception as e:
#     logger.error(f"Could not start MQTT client: {e}")

# ----------------------------------------------------


@app.get("/")
def read_root():
    """This endpoint works without a database."""
    logger.info("Root endpoint was called successfully.")
    return {"message": "Hello World - Server is running without a database connection."}

# --- ALL DATABASE-DEPENDENT ENDPOINTS ARE DISABLED ---

# @app.post("/register/")
# def register_user(user: models.UserCreate, db: Session = Depends(database.get_db)):
#     # ... implementation ...
#
# @app.post("/login/")
# def login_user(form_data: models.UserLogin, db: Session = Depends(database.get_db)):
#     # ... implementation ...
#
# @app.get("/users/me/", response_model=models.User)
# def read_users_me(current_user: models.User = Depends(user_utils.get_current_active_user)):
#     # ... implementation ...

# ----------------------------------------------------