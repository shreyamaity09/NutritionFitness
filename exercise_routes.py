from flask import Blueprint, request, jsonify

import database.mongodb as mongodb

from crud.exercise_crud import (
    create_exercise_plan,
    get_user_exercise_plans,
    get_exercise_plan,
    update_exercise_plan,
    delete_exercise_plan
)

from routes.route_helpers import (
    serialize_data,
    user_login_required,
    get_current_user_id,
    get_current_time
)


exercise_routes = Blueprint(
    "exercise_routes",
    __name__
)


# ==========================================
# GET ALL EXERCISE PLANS
# ==========================================

@exercise_routes.route(
    "/api/exercise-plans",
    methods=["GET"]
)
@user_login_required
def get_exercises():

    if mongodb.exercise_plans_collection is None:

        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503

    user_id = get_current_user_id()

    plans = get_user_exercise_plans(
        user_id
    )

    return jsonify({
        "success": True,
        "exercise_plans": serialize_data(
            plans
        )
    })


# ==========================================
# CREATE EXERCISE PLAN
# ==========================================

@exercise_routes.route(
    "/api/exercise-plans",
    methods=["POST"]
)
@user_login_required
def create_exercise():

    if mongodb.exercise_plans_collection is None:

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

    exercise_plan = create_exercise_plan(
        data
    )

    if not exercise_plan:

        return jsonify({
            "success": False,
            "message": "Unable to create exercise plan."
        }), 500

    return jsonify({
        "success": True,
        "message": "Exercise plan created successfully.",
        "exercise_plan": serialize_data(
            exercise_plan
        )
    }), 201


# ==========================================
# GET ONE EXERCISE PLAN
# ==========================================

@exercise_routes.route(
    "/api/exercise-plans/<plan_id>",
    methods=["GET"]
)
@user_login_required
def get_one_exercise(plan_id):

    user_id = get_current_user_id()

    plan = get_exercise_plan(
        plan_id,
        user_id
    )

    if not plan:

        return jsonify({
            "success": False,
            "message": "Exercise plan not found."
        }), 404

    return jsonify({
        "success": True,
        "exercise_plan": serialize_data(
            plan
        )
    })


# ==========================================
# UPDATE EXERCISE PLAN
# ==========================================

@exercise_routes.route(
    "/api/exercise-plans/<plan_id>",
    methods=["PUT"]
)
@user_login_required
def update_exercise(plan_id):

    data = request.get_json(silent=True) or {}

    user_id = get_current_user_id()

    data.pop("user_id", None)
    data.pop("_id", None)

    updated_plan = update_exercise_plan(
        plan_id,
        user_id,
        data
    )

    if not updated_plan:

        return jsonify({
            "success": False,
            "message": "Exercise plan not found or could not be updated."
        }), 404

    return jsonify({
        "success": True,
        "message": "Exercise plan updated successfully.",
        "exercise_plan": serialize_data(
            updated_plan
        )
    })


# ==========================================
# DELETE EXERCISE PLAN
# ==========================================

@exercise_routes.route(
    "/api/exercise-plans/<plan_id>",
    methods=["DELETE"]
)
@user_login_required
def delete_exercise(plan_id):

    user_id = get_current_user_id()

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