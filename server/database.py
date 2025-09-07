# server/database.py

# This is a temporary dummy file to allow the server to run without a database.

def get_db():
    """Dummy database session provider."""
    print("Warning: Running without a database connection.")
    yield None