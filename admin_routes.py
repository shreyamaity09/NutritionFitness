from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify, session
import re

import database.mongodb as mongodb

from crud.admin_crud import (
    find_admin_by_username,
    check_admin_password,
    get_all_admins
)

from crud.user_crud import (
    get_all_users,
    get_user_complete_data
)

from crud.meal_crud import delete_meal_plan
from crud.exercise_crud import delete_exercise_plan
from crud.sleep_crud import delete_sleep_schedule
from crud.water_crud import delete_water_record
from crud.progress_crud import delete_progress

from routes.route_helpers import (
    serialize_data,
    remove_password,
    admin_required,
    get_current_admin_id
)


admin_routes = Blueprint(
    "admin_routes",
    __name__
)


# ==========================================
# ADMIN LOGIN
# ==========================================

@admin_routes.route(
    "/api/admin/login",
    methods=["POST"]
)
def admin_login():

    if mongodb.admins_collection is None:

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

    username = data.get(
        "username",
        ""
    ).strip()

    password = data.get(
        "password",
        ""
    )

    if not username or not password:

        return jsonify({
            "success": False,
            "message": "Username and password are required."
        }), 400

    admin = find_admin_by_username(
        username
    )

    if not admin:

        return jsonify({
            "success": False,
            "message": "Invalid admin username or password."
        }), 401

    if not check_admin_password(
        admin,
        password
    ):

        return jsonify({
            "success": False,
            "message": "Invalid admin username or password."
        }), 401

    session.clear()

    session["admin_id"] = str(
        admin["_id"]
    )

    session["username"] = admin[
        "username"
    ]

    session["role"] = "admin"

    admin = remove_password(
        admin
    )

    return jsonify({
        "success": True,
        "message": "Admin login successful.",
        "redirect": "/admin",
        "admin": serialize_data(admin)
    })


# ==========================================
# ADMIN LOGOUT
# ==========================================

@admin_routes.route(
    "/api/admin/logout",
    methods=["POST"]
)
@admin_required
def admin_logout():

    session.clear()

    return jsonify({
        "success": True,
        "message": "Admin logged out successfully.",
        "redirect": "/"
    })


# ==========================================
# ADMIN CURRENT SESSION
# ==========================================

@admin_routes.route(
    "/api/admin/me",
    methods=["GET"]
)
@admin_required
def admin_me():

    admin_id = get_current_admin_id()

    admin = None

    try:

        from bson import ObjectId

        admin = mongodb.admins_collection.find_one({
            "_id": ObjectId(admin_id)
        })

    except Exception:

        admin = None

    if not admin:

        return jsonify({
            "success": False,
            "message": "Admin not found."
        }), 404

    admin = remove_password(
        admin
    )

    return jsonify({
        "success": True,
        "admin": serialize_data(admin)
    })


# ==========================================
# ADMIN DASHBOARD STATISTICS
# ==========================================

@admin_routes.route(
    "/api/admin/dashboard",
    methods=["GET"]
)
@admin_required
def admin_dashboard():

    if mongodb.database is None:

        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503

    statistics = {
        "total_users":
            mongodb.users_collection.count_documents({}),

        "total_meal_plans":
            mongodb.meal_plans_collection.count_documents({}),

        "total_exercise_plans":
            mongodb.exercise_plans_collection.count_documents({}),

        "total_sleep_schedules":
            mongodb.sleep_schedules_collection.count_documents({}),

        "total_water_records":
            mongodb.water_intake_collection.count_documents({}),

        "total_progress_records":
            mongodb.progress_collection.count_documents({})
    }

    return jsonify({
        "success": True,
        "statistics": statistics
    })



# ==========================================
# GET ALL USERS
# ==========================================

@admin_routes.route(
    "/api/admin/users",
    methods=["GET"]
)
@admin_required
def admin_get_users():

    if mongodb.users_collection is None:
        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503

    search = request.args.get("search", "").strip()

    if search:
        safe_search = re.escape(search)

        users = list(
            mongodb.users_collection.find({
                "$or": [
                    {
                        "name": {
                            "$regex": safe_search,
                            "$options": "i"
                        }
                    },
                    {
                        "username": {
                            "$regex": safe_search,
                            "$options": "i"
                        }
                    },
                    {
                        "email": {
                            "$regex": safe_search,
                            "$options": "i"
                        }
                    }
                ]
            })
        )
    else:
        users = get_all_users()

    # Initialize this list before processing users.
    safe_users = []

    for user in users:

        questionnaire = user.get("questionnaire") or {}
        user_id = str(user["_id"])

        # Remove password before returning user information.
        user = remove_password(user)

        user["goal"] = questionnaire.get(
            "main_fitness_goal",
            questionnaire.get(
                "fitness_goal",
                "Not specified"
            )
        )

        # Calculate account activity from saved timestamps.
        user.update(get_user_activity_status(user))

        # Get only this user's progress records.
        progress_records = []

        if mongodb.progress_collection is not None:
            progress_records = list(
                mongodb.progress_collection.find({
                    "user_id": user_id
                })
            )

        # Calculate today's track status.
        user.update(
            get_user_track_status(
                user_id,
                progress_records
            )
        )

        safe_users.append(user)

    return jsonify({
        "success": True,
        "users": serialize_data(safe_users)
    })


# ==========================================
# GET ONE USER
# ==========================================

@admin_routes.route(
    "/api/admin/users/<user_id>",
    methods=["GET"]
)
@admin_required
def admin_get_user(user_id):

    
    complete_data = get_user_complete_data(user_id)

    if not complete_data:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    # Keep a copy of the user's information
    complete_data = dict(complete_data)

    # Calculate account activity
    complete_data.update(
        get_user_activity_status(complete_data)
    )

    # Get this user's progress records
    user_id_str = str(complete_data.get("_id"))

    progress_records = []

    if mongodb.progress_collection is not None:
        progress_records = list(
            mongodb.progress_collection.find({
                "user_id": user_id_str
            })
        )

    # Calculate track status
    complete_data.update(
        get_user_track_status(
            user_id_str,
            progress_records
        )
    )

    # Remove password before sending data to frontend
    complete_data = remove_password(complete_data)

    return jsonify({
        "success": True,
        "user": serialize_data(complete_data)
    })

# ==========================================
# DELETE USER + ALL RELATED DATA
# ==========================================

@admin_routes.route(
    "/api/admin/users/<user_id>",
    methods=["DELETE"]
)
@admin_required
def admin_delete_user(user_id):

    if mongodb.users_collection is None:

        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503

    from bson import ObjectId

    try:

        user_object_id = ObjectId(
            user_id
        )

    except Exception:

        return jsonify({
            "success": False,
            "message": "Invalid user ID."
        }), 400


    user = mongodb.users_collection.find_one({
        "_id": user_object_id
    })

    if not user:

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404


    # Delete all related user data

    user_id_string = str(
        user_object_id
    )

    mongodb.meal_plans_collection.delete_many({
        "user_id": user_id_string
    })

    mongodb.exercise_plans_collection.delete_many({
        "user_id": user_id_string
    })

    mongodb.sleep_schedules_collection.delete_many({
        "user_id": user_id_string
    })

    mongodb.water_intake_collection.delete_many({
        "user_id": user_id_string
    })

    mongodb.progress_collection.delete_many({
        "user_id": user_id_string
    })


    # Delete user

    mongodb.users_collection.delete_one({
        "_id": user_object_id
    })


    return jsonify({
        "success": True,
        "message": "User and all related data deleted successfully."
    })


# ==========================================
# ADMIN DELETE MEAL PLAN
# ==========================================

@admin_routes.route(
    "/api/admin/users/<user_id>/meal-plans/<plan_id>",
    methods=["DELETE"]
)
@admin_required
def admin_delete_meal(
    user_id,
    plan_id
):

    deleted = delete_meal_plan(
        plan_id,
        user_id
    )

    if not deleted:

        return jsonify({
            "success": False,
            "message": "Meal plan not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Meal plan deleted successfully."
    })


# ==========================================
# ADMIN DELETE EXERCISE PLAN
# ==========================================

@admin_routes.route(
    "/api/admin/users/<user_id>/exercise-plans/<plan_id>",
    methods=["DELETE"]
)
@admin_required
def admin_delete_exercise(
    user_id,
    plan_id
):

    deleted = delete_exercise_plan(
        plan_id,
        user_id
    )

    if not deleted:

        return jsonify({
            "success": False,
            "message": "Exercise plan not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Exercise plan deleted successfully."
    })


# ==========================================
# ADMIN DELETE SLEEP SCHEDULE
# ==========================================

@admin_routes.route(
    "/api/admin/users/<user_id>/sleep-schedules/<schedule_id>",
    methods=["DELETE"]
)
@admin_required
def admin_delete_sleep(
    user_id,
    schedule_id
):

    deleted = delete_sleep_schedule(
        schedule_id,
        user_id
    )

    if not deleted:

        return jsonify({
            "success": False,
            "message": "Sleep schedule not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Sleep schedule deleted successfully."
    })


# ==========================================
# ADMIN DELETE WATER RECORD
# ==========================================

@admin_routes.route(
    "/api/admin/users/<user_id>/water-intake/<record_id>",
    methods=["DELETE"]
)
@admin_required
def admin_delete_water(
    user_id,
    record_id
):

    deleted = delete_water_record(
        record_id,
        user_id
    )

    if not deleted:

        return jsonify({
            "success": False,
            "message": "Water record not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Water record deleted successfully."
    })


# ==========================================
# ADMIN DELETE PROGRESS
# ==========================================

@admin_routes.route(
    "/api/admin/users/<user_id>/progress/<progress_id>",
    methods=["DELETE"]
)
@admin_required
def admin_delete_progress(
    user_id,
    progress_id
):

    deleted = delete_progress(
        progress_id,
        user_id
    )

    if not deleted:

        return jsonify({
            "success": False,
            "message": "Progress record not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Progress record deleted successfully."
    })

# ==========================================
# USER ACTIVITY AND TRACK STATUS HELPERS
# ==========================================

def get_user_track_status(user_id, progress_records):
    """
    Calculate today's completion status for meal,
    exercise, water and sleep activities.
    """

    # India local date
    from zoneinfo import ZoneInfo

    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    ).date().isoformat()

    required_types = {
        "meal",
        "exercise",
        "water",
        "sleep"
    }

    completed_types = set()

    for record in progress_records:

        if str(record.get("user_id", "")) != str(user_id):
            continue

        completion_type = (
            record.get("completion_type")
            or record.get("type")
            or record.get("progress_type")
        )

        if completion_type not in required_types:
            continue

        if record.get("status") != "completed":
            continue

        completion_date = (
            record.get("completion_date")
            or record.get("created_at")
            or record.get("date")
        )

        if isinstance(completion_date, datetime):
            if completion_date.tzinfo is not None:
                record_date = completion_date.astimezone(
                    ZoneInfo("Asia/Kolkata")
                ).date().isoformat()
            else:
                record_date = completion_date.date().isoformat()

        elif isinstance(completion_date, str):
            try:
                parsed_date = datetime.fromisoformat(
                    completion_date.replace("Z", "+00:00")
                )

                if parsed_date.tzinfo is not None:
                    parsed_date = parsed_date.astimezone(
                        ZoneInfo("Asia/Kolkata")
                    )

                record_date = parsed_date.date().isoformat()

            except ValueError:
                record_date = completion_date[:10]

        else:
            continue

        if record_date == today:
            completed_types.add(completion_type)

    if completed_types == required_types:
        status = "Completed"
    elif completed_types:
        status = "In progress"
    else:
        status = "Not started"

    return {
        "track_status": status,
        "completed_tracks": len(completed_types),
        "total_tracks": len(required_types),
        "completed_types": sorted(completed_types)
    }





def get_user_activity_status(user):
    last_activity = (
        user.get("last_activity")
        or user.get("last_active")
        or user.get("last_login")
    )

    if not last_activity:
        return {
            "activity_status": "Inactive",
            "last_activity": None
        }

    try:
        if isinstance(last_activity, str):
            last_activity = datetime.fromisoformat(
                last_activity.replace("Z", "+00:00")
            )

        if last_activity.tzinfo is None:
            last_activity = last_activity.replace(
                tzinfo=timezone.utc
            )

        current_time = datetime.now(timezone.utc)

        if current_time - last_activity <= timedelta(minutes=15):
            status = "Active"
        else:
            status = "Inactive"

        return {
            "activity_status": status,
            "last_activity": last_activity
        }

    except (ValueError, TypeError):
        return {
            "activity_status": "Inactive",
            "last_activity": None
        }
