from flask import Blueprint, request, jsonify

import database.mongodb as mongodb

from crud.meal_crud import (
    create_meal_plan,
    get_user_meal_plans,
    get_meal_plan,
    update_meal_plan,
    delete_meal_plan
)

from routes.route_helpers import (
    serialize_data,
    user_login_required,
    get_current_user_id,
    get_current_time
)


meal_routes = Blueprint("meal_routes", __name__)


# ==========================================
# GET ALL USER MEAL PLANS
# ==========================================

@meal_routes.route("/api/meal-plans", methods=["GET"])
@user_login_required
def get_meals():

    if mongodb.meal_plans_collection is None:

        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503

    user_id = get_current_user_id()

    plans = get_user_meal_plans(
        user_id
    )

    return jsonify({
        "success": True,
        "meal_plans": serialize_data(plans)
    })


# ==========================================
# CREATE MEAL PLAN
# ==========================================

@meal_routes.route("/api/meal-plans", methods=["POST"])
@user_login_required
def create_meal():

    if mongodb.meal_plans_collection is None:

        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503

    data = request.get_json(silent=True) or {}

    user_id = get_current_user_id()

    # Never allow frontend to choose another user
    data.pop("user_id", None)
    data.pop("_id", None)

    data["user_id"] = user_id
    data["created_at"] = get_current_time()

    meal_plan = create_meal_plan(
        data
    )

    if not meal_plan:

        return jsonify({
            "success": False,
            "message": "Unable to create meal plan."
        }), 500

    return jsonify({
        "success": True,
        "message": "Meal plan created successfully.",
        "meal_plan": serialize_data(
            meal_plan
        )
    }), 201


# ==========================================
# GET ONE MEAL PLAN
# ==========================================

@meal_routes.route(
    "/api/meal-plans/<plan_id>",
    methods=["GET"]
)
@user_login_required
def get_one_meal(plan_id):

    user_id = get_current_user_id()

    meal_plan = get_meal_plan(
        plan_id,
        user_id
    )

    if not meal_plan:

        return jsonify({
            "success": False,
            "message": "Meal plan not found."
        }), 404

    return jsonify({
        "success": True,
        "meal_plan": serialize_data(
            meal_plan
        )
    })


# ==========================================
# UPDATE MEAL PLAN
# ==========================================

@meal_routes.route(
    "/api/meal-plans/<plan_id>",
    methods=["PUT"]
)
@user_login_required
def update_meal(plan_id):

    data = request.get_json(silent=True) or {}

    user_id = get_current_user_id()

    data.pop("user_id", None)
    data.pop("_id", None)

    updated_plan = update_meal_plan(
        plan_id,
        user_id,
        data
    )

    if not updated_plan:

        return jsonify({
            "success": False,
            "message": "Meal plan not found or could not be updated."
        }), 404

    return jsonify({
        "success": True,
        "message": "Meal plan updated successfully.",
        "meal_plan": serialize_data(
            updated_plan
        )
    })


# ==========================================
# DELETE MEAL PLAN
# ==========================================

@meal_routes.route(
    "/api/meal-plans/<plan_id>",
    methods=["DELETE"]
)
@user_login_required
def delete_meal(plan_id):

    user_id = get_current_user_id()

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