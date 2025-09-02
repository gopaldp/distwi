import csv
import os

CSV_FILE = "./assets/users.csv"

def read_users():
    users = {}
    
    if not os.path.exists(CSV_FILE):
        return users
    with open(CSV_FILE, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            users[row["username"]] = {
                "password": row["password"],
                "role": row["role"]
            }
    return users

def write_user(new_user):
    file_exists = os.path.exists(CSV_FILE)
    with open(CSV_FILE, mode='a', newline='') as file:
        fieldnames = ["username","password", "role"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow(new_user)

def update_user_password(username, new_password):
    users = []
    with open(CSV_FILE, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row['username'] == username:
                row['password'] = new_password
            users.append(row)

    with open(CSV_FILE, mode='w', newline='') as file:
        fieldnames = ["username", "email", "password", "role"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(users)
