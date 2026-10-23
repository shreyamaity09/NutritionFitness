from flask import Blueprint, request, jsonify, session
from datetime import datetime, timezone
import database.mongodb as mongodb

from crud.user_crud import (
    create_user,
    find_user_by_username,
    check_user_password,
    find_user_by_id
)

from routes.route_helpers import (
    serialize_data,
    remove_password
)


auth_routes = Blueprint("auth_routes", __name__)


# ==========================================
# USER REGISTRATION
# ==========================================

@auth_routes.route("/api/register", methods=["POST"])
def register_user():

    if mongodb.users_collection is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    name = data.get("name", "").strip()
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not name or not username or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400

    user_data = {
        "name": name,
        "username": username,
        "email": email,
        "password": password,
        "created_at": datetime.now(timezone.utc)
    }

    user = create_user(user_data)

    if user is None:
        return jsonify({
            "success": False,
            "message": "Username or email already exists."
        }), 409

    user_id = str(user["_id"])

    session.clear()

    session["user_id"] = user_id
    session["username"] = user["username"]
    session["role"] = "user"

    safe_user = remove_password(user)

    return jsonify({
        "success": True,
        "message": "Registration successful.",
        "redirect": "/questionnaire",
        "user": serialize_data(safe_user)
    }), 201



# ==========================================
# USER LOGIN
# ==========================================

@auth_routes.route("/api/login", methods=["POST"])
def login_user():

    if mongodb.users_collection is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Username and password are required."
        }), 400

    user = find_user_by_username(username)

    if not user:
        return jsonify({
            "success": False,
            "message": "Invalid username or password."
        }), 401

    if not check_user_password(user, password):
        return jsonify({
            "success": False,
            "message": "Invalid username or password."
        }), 401

    


    # After successful username and password validation:
    login_time = datetime.now(timezone.utc)

    update_result = mongodb.users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "last_login": login_time,
                "last_activity": login_time
            }
        }
    )
    print("Login timestamp matched:", update_result.matched_count)
    print("Login timestamp modified:", update_result.modified_count)
    print("Login time saved:", login_time)
    
    # Keep the updated timestamps in the current user object
    user["last_login"] = login_time
    user["last_activity"] = login_time


    # Create the user session
    session.clear()

    session["user_id"] = str(user["_id"])
    session["username"] = user["username"]
    session["role"] = "user"

    safe_user = remove_password(user)

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "redirect": "/dashboard",
        "user": serialize_data(safe_user)
    })


# ==========================================
# CURRENT USER
# ==========================================

@auth_routes.route("/api/auth/me", methods=["GET"])
def current_user():

    if session.get("role") != "user":
        return jsonify({
            "success": False,
            "message": "Not logged in."
        }), 401

    user_id = session.get("user_id")

    user = find_user_by_id(user_id)

    if not user:
        session.clear()

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    safe_user = remove_password(user)

    return jsonify({
        "success": True,
        "user": serialize_data(safe_user)
    })


# ==========================================
# LOGOUT
# ==========================================

@auth_routes.route("/api/logout", methods=["POST"])
def logout_user():

    session.clear()

    return jsonify({
        "success": True,
        "message": "Logged out successfully.",
        "redirect": "/"
    }
)