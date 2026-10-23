from getpass import getpass
from werkzeug.security import generate_password_hash
import database.mongodb as mongodb


def create_admin():
    print("\n================================")
    print("      NutriTrack Admin Setup")
    print("================================\n")

    if mongodb.admins_collection is None:
        print("❌ MongoDB is not connected.")
        print("Please check your .env MONGO_URI.")
        return

    username = input("Enter admin username: ").strip()
    email = input("Enter admin email: ").strip()
    password = getpass("Enter admin password: ")
    confirm_password = getpass("Confirm admin password: ")

    if not username or not email or not password:
        print("\n❌ All fields are required.")
        return

    if password != confirm_password:
        print("\n❌ Passwords do not match.")
        return

    existing_username = mongodb.admins_collection.find_one({
        "username": username
    })

    if existing_username:
        print("\n❌ This admin username already exists.")
        return

    existing_email = mongodb.admins_collection.find_one({
        "email": email
    })

    if existing_email:
        print("\n❌ This admin email already exists.")
        return

    admin_data = {
        "username": username,
        "email": email,
        "password": generate_password_hash(password)
    }

    result = mongodb.admins_collection.insert_one(admin_data)

    print("\n✅ Admin account created successfully!")
    print("Admin ID:", result.inserted_id)
    print("Username:", username)
    print("Email:", email)
    print("\nYou can now use this account for Admin Login.")


if __name__ == "__main__":
    create_admin()