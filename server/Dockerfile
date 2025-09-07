# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Add the local packages bin to the path
ENV PATH="/root/.local/bin:${PATH}"

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to start the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]