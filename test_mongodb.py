import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")

print("MongoDB URI found:", bool(mongo_uri))

try:
    client = MongoClient(
        mongo_uri,
        serverSelectionTimeoutMS=10000
    )

    client.admin.command("ping")

    print("================================")
    print("MongoDB connection SUCCESSFUL!")
    print("================================")

except Exception as error:
    print("================================")
    print("MongoDB connection FAILED!")
    print("================================")
    print(error)