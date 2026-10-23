from functools import wraps
from flask import session, jsonify
from bson import ObjectId
from datetime import datetime


# ==========================================
# SERIALIZE MONGODB DATA
# ==========================================

def serialize_data(data):

    if isinstance(data, ObjectId):
        return str(data)

    if isinstance(data, datetime):
        return data.isoformat()

    if isinstance(data, dict):
        return {
            key: serialize_data(value)
            for key, value in data.items()
        }

    if isinstance(data, list):
        return [
            serialize_data(item)
            for item in data
        ]

    return data


# ==========================================
# REMOVE PASSWORD
# ==========================================

def remove_password(user_data):

    if not user_data:
        return user_data

    user_data = dict(user_data)

    user_data.pop("password", None)

    return user_data


# ==========================================
# USER LOGIN REQUIRED
# ==========================================

def user_login_required(route_function):

    @wraps(route_function)
    def wrapper(*args, **kwargs):

        if session.get("role") != "user":
            return jsonify({
                "success": False,
                "message": "User login required."
            }), 401

        if not session.get("user_id"):
            return jsonify({
                "success": False,
                "message": "User session not found."
            }), 401

        return route_function(*args, **kwargs)

    return wrapper


# ==========================================
# ADMIN LOGIN REQUIRED
# ==========================================

def admin_required(route_function):

    @wraps(route_function)
    def wrapper(*args, **kwargs):

        if session.get("role") != "admin":
            return jsonify({
                "success": False,
                "message": "Admin access required."
            }), 403

        if not session.get("admin_id"):
            return jsonify({
                "success": False,
                "message": "Admin session not found."
            }), 403

        return route_function(*args, **kwargs)

    return wrapper


# ==========================================
# CURRENT USER ID
# ==========================================

def get_current_user_id():

    return session.get("user_id")


# ==========================================
# CURRENT ADMIN ID
# ==========================================

def get_current_admin_id():

    return session.get("admin_id")


# ==========================================
# CURRENT TIME
# ==========================================

def get_current_time():

    return datetime.utcnow().isoformat()