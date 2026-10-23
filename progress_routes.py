from flask import Blueprint, request, jsonify

import database.mongodb as mongodb

from crud.progress_crud import (
    create_progress,
    get_user_progress,
    get_progress,
    update_progress,
    delete_progress,
    create_daily_completion,
    get_daily_completion
)

from crud.user_crud import get_user_complete_data

from routes.route_helpers import (
    serialize_data,
    user_login_required,
    get_current_user_id,
    get_current_time
)


progress_routes = Blueprint(
    "progress_routes",
    __name__
)


# ==========================================
# GET USER PROGRESS
# ==========================================

@progress_routes.route(
    "/api/progress",
    methods=["GET"]
)
@user_login_required
def get_progress_records():

    if mongodb.progress_collection is None:

        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503

    user_id = get_current_user_id()

    records = get_user_progress(
        user_id
    )

    return jsonify({
        "success": True,
        "progress": serialize_data(
            records
        )
    })


# ==========================================
# CREATE PROGRESS
# ==========================================

@progress_routes.route(
    "/api/progress",
    methods=["POST"]
)
@user_login_required
def create_progress_record():

    if mongodb.progress_collection is None:

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

    progress = create_progress(
        data
    )

    if not progress:

        return jsonify({
            "success": False,
            "message": "Unable to create progress record."
        }), 500

    return jsonify({
        "success": True,
        "message": "Progress saved successfully.",
        "progress": serialize_data(
            progress
        )
    }), 201

# ==========================================
# COMPLETE MEAL / EXERCISE FOR TODAY
# ==========================================

@progress_routes.route(
    "/api/progress/complete",
    methods=["POST"]
)
@user_login_required
def complete_daily_task():

    if mongodb.progress_collection is None:

        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503


    data = request.get_json(
        silent=True
    ) or {}


    completion_type = str(
        data.get("completion_type", "")
    ).strip().lower()


    plan_id = data.get(
        "plan_id"
    )


    plan_name = data.get(
        "plan_name"
    )


    focus = data.get(
        "focus"
    )


    # ------------------------------------------
    # Only meal and exercise are allowed here
    # ------------------------------------------

    if completion_type not in [
        "meal",
        "exercise",
        "sleep",
        "water"
    ]:

        return jsonify({
            "success": False,
            "message": "Invalid completion type."
        }), 400


    user_id = get_current_user_id()


    # ------------------------------------------
    # Use server date
    # ------------------------------------------

    current_time = get_current_time()

    completion_date = str(current_time)[:10]


    # ------------------------------------------
    # Check if already completed today
    # ------------------------------------------

    existing_completion = get_daily_completion(
        user_id,
        completion_type,
        completion_date
    )


    if existing_completion:

        return jsonify({
            "success": True,
            "already_completed": True,
            "message": (
                "You have already completed "
                f"your {completion_type} plan today."
            ),
            "completion": serialize_data(
                existing_completion
            )
        })


    # ------------------------------------------
    # Create completion
    # ------------------------------------------

    completion = create_daily_completion(
        user_id=user_id,
        completion_type=completion_type,
        completion_date=completion_date,
        plan_id=plan_id,
        plan_name=plan_name,
        focus=focus
    )


    if not completion:

        return jsonify({
            "success": False,
            "message": "Unable to save completion."
        }), 500


    return jsonify({
        "success": True,
        "already_completed": False,
        "message": (
            f"{completion_type.capitalize()} "
            "completed successfully."
        ),
        "completion": serialize_data(
            completion
        )
    }), 201


# ==========================================
# GET ONE PROGRESS RECORD
# ==========================================

@progress_routes.route(
    "/api/progress/<progress_id>",
    methods=["GET"]
)
@user_login_required
def get_one_progress(progress_id):

    user_id = get_current_user_id()

    progress = get_progress(
        progress_id,
        user_id
    )

    if not progress:

        return jsonify({
            "success": False,
            "message": "Progress record not found."
        }), 404

    return jsonify({
        "success": True,
        "progress": serialize_data(
            progress
        )
    })


# ==========================================
# UPDATE PROGRESS
# ==========================================

@progress_routes.route(
    "/api/progress/<progress_id>",
    methods=["PUT"]
)
@user_login_required
def update_progress_record(progress_id):

    data = request.get_json(silent=True) or {}

    user_id = get_current_user_id()

    data.pop("user_id", None)
    data.pop("_id", None)

    updated_progress = update_progress(
        progress_id,
        user_id,
        data
    )

    if not updated_progress:

        return jsonify({
            "success": False,
            "message": "Progress record not found or could not be updated."
        }), 404

    return jsonify({
        "success": True,
        "message": "Progress updated successfully.",
        "progress": serialize_data(
            updated_progress
        )
    })


# ==========================================
# DELETE PROGRESS
# ==========================================

@progress_routes.route(
    "/api/progress/<progress_id>",
    methods=["DELETE"]
)
@user_login_required
def delete_progress_record(progress_id):

    user_id = get_current_user_id()

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



    # --------------------------------------
    # SORT BY DATE
    # --------------------------------------

    history_records.sort(
        key=lambda record: record.get(
            "date",
            ""
        ),
        reverse=True
    )


    return jsonify({
        "success": True,
        "history": serialize_data(
            history_records
        )
    })