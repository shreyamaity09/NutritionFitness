from flask import Blueprint, request, jsonify

import database.mongodb as mongodb

from crud.sleep_crud import (
    create_sleep_schedule,
    get_user_sleep_schedules,
    get_sleep_schedule,
    update_sleep_schedule,
    delete_sleep_schedule
)

from routes.route_helpers import (
    serialize_data,
    user_login_required,
    get_current_user_id,
    get_current_time
)


sleep_routes = Blueprint(
    "sleep_routes",
    __name__
)


# ==========================================
# GET ALL SLEEP SCHEDULES
# ==========================================

@sleep_routes.route(
    "/api/sleep-schedules",
    methods=["GET"]
)
@user_login_required
def get_sleep_schedules():

    if mongodb.sleep_schedules_collection is None:

        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503

    user_id = get_current_user_id()

    schedules = get_user_sleep_schedules(
        user_id
    )

    return jsonify({
        "success": True,
        "sleep_schedules": serialize_data(
            schedules
        )
    })


# ==========================================
# CREATE SLEEP SCHEDULE
# ==========================================

@sleep_routes.route(
    "/api/sleep-schedules",
    methods=["POST"]
)
@user_login_required
def create_sleep():

    if mongodb.sleep_schedules_collection is None:

        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503

    data = request.get_json(silent=True) or {}

    user_id = get_current_user_id()

    data.pop("user_id", None)
    data.pop("_id", None)

    data["user_id"] = user_id
    data["created_at"] = get_current_time()

    schedule = create_sleep_schedule(
        data
    )

    if not schedule:

        return jsonify({
            "success": False,
            "message": "Unable to create sleep schedule."
        }), 500

    return jsonify({
        "success": True,
        "message": "Sleep schedule created successfully.",
        "sleep_schedule": serialize_data(
            schedule
        )
    }), 201


# ==========================================
# GET ONE SLEEP SCHEDULE
# ==========================================

@sleep_routes.route(
    "/api/sleep-schedules/<schedule_id>",
    methods=["GET"]
)
@user_login_required
def get_one_sleep(schedule_id):

    user_id = get_current_user_id()

    schedule = get_sleep_schedule(
        schedule_id,
        user_id
    )

    if not schedule:

        return jsonify({
            "success": False,
            "message": "Sleep schedule not found."
        }), 404

    return jsonify({
        "success": True,
        "sleep_schedule": serialize_data(
            schedule
        )
    })


# ==========================================
# UPDATE SLEEP SCHEDULE
# ==========================================

@sleep_routes.route(
    "/api/sleep-schedules/<schedule_id>",
    methods=["PUT"]
)
@user_login_required
def update_sleep(schedule_id):

    data = request.get_json(silent=True) or {}

    user_id = get_current_user_id()

    data.pop("user_id", None)
    data.pop("_id", None)

    updated_schedule = update_sleep_schedule(
        schedule_id,
        user_id,
        data
    )

    if not updated_schedule:

        return jsonify({
            "success": False,
            "message": "Sleep schedule not found or could not be updated."
        }), 404

    return jsonify({
        "success": True,
        "message": "Sleep schedule updated successfully.",
        "sleep_schedule": serialize_data(
            updated_schedule
        )
    })


# ==========================================
# DELETE SLEEP SCHEDULE
# ==========================================

@sleep_routes.route(
    "/api/sleep-schedules/<schedule_id>",
    methods=["DELETE"]
)
@user_login_required
def delete_sleep(schedule_id):

    user_id = get_current_user_id()

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