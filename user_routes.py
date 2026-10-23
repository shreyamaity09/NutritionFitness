from flask import Blueprint, request, jsonify

import database.mongodb as mongodb

from crud.user_crud import (
    find_user_by_id,
    update_user,
    get_user_complete_data,
    initialize_weight_goal
)

from routes.route_helpers import (
    serialize_data,
    remove_password,
    user_login_required,
    get_current_user_id
)


user_routes = Blueprint("user_routes", __name__)


# ==========================================
# GET USER PROFILE
# ==========================================

@user_routes.route("/api/user/profile", methods=["GET"])
@user_login_required
def get_profile():

    user_id = get_current_user_id()

    user = find_user_by_id(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    questionnaire = user.get("questionnaire", {})

    user = remove_password(user)

    return jsonify({
        "success": True,
        "user": serialize_data(user),
        "questionnaire": serialize_data(questionnaire)
    })


# ==========================================
# UPDATE USER PROFILE
# ==========================================

@user_routes.route("/api/user/profile", methods=["PUT"])
@user_login_required
def update_profile():

    user_id = get_current_user_id()

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    # ======================================
    # ACCOUNT INFORMATION
    # ======================================

    account_fields = [
        "name",
        "username",
        "email"
    ]

    account_update = {}

    for field in account_fields:

        if field in data:

            value = data[field]

            if isinstance(value, str):
                value = value.strip()

            if value != "":
                account_update[field] = value


    # ======================================
    # QUESTIONNAIRE / FITNESS INFORMATION
    # ======================================

    questionnaire_fields = [
        "age",
        "height",
        "weight",
        "target_weight",
        "date_of_birth",
        "dob",
        "allergies",
        "fitness_meaning",
        "what_fitness_means",
        "exercise_important",
        "exercise_frequency",
        "main_fitness_goal",
        "fitness_goal",
        "biggest_challenge",
        "sleep_hours"
    ]

    questionnaire_update = {}

    for field in questionnaire_fields:

        if field in data:

            value = data[field]

            # Allow arrays such as allergies and fitness goals
            if isinstance(value, list):

                questionnaire_update[field] = value

            # Allow numbers such as age, height and weight
            elif isinstance(value, (int, float)):

                questionnaire_update[field] = value

            # Allow normal text values
            elif isinstance(value, str):

                value = value.strip()

                if value != "":
                    questionnaire_update[field] = value


    # ======================================
    # CHECK IF ANYTHING WAS PROVIDED
    # ======================================

    if not account_update and not questionnaire_update:

        return jsonify({
            "success": False,
            "message": "No valid profile information provided."
        }), 400


    # ======================================
    # UPDATE ACCOUNT INFORMATION
    # ======================================

    updated_user = None

    if account_update:

        updated_user = update_user(
            user_id,
            account_update
        )

        if updated_user is None:

            return jsonify({
                "success": False,
                "message": "Username or email may already exist."
            }), 409


    # ======================================
    # UPDATE QUESTIONNAIRE INFORMATION
    # ======================================

    if questionnaire_update:

        user = find_user_by_id(user_id)

        if not user:

            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404

        old_questionnaire = user.get(
            "questionnaire",
            {}
        )

        old_questionnaire.update(
            questionnaire_update
        )

        updated_user = update_user(
            user_id,
            {
                "questionnaire": old_questionnaire
            }
        )

        if not updated_user:

            return jsonify({
                "success": False,
                "message": "Unable to update profile information."
            }), 500


    # ======================================
    # UPDATE SESSION USERNAME
    # ======================================

    from flask import session

    if "username" in account_update:

        session["username"] = account_update["username"]


    # ======================================
    # PREPARE RESPONSE
    # ======================================

    updated_user = remove_password(
        updated_user
    )

    questionnaire = updated_user.get(
        "questionnaire",
        {}
    )


    return jsonify({
        "success": True,
        "message": "Profile updated successfully.",
        "user": serialize_data(updated_user),
        "questionnaire": serialize_data(questionnaire)
    })


# ==========================================
# GET QUESTIONNAIRE
# ==========================================

@user_routes.route("/api/user/questionnaire", methods=["GET"])
@user_login_required
def get_questionnaire():

    user_id = get_current_user_id()

    user = find_user_by_id(user_id)

    if not user:

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    questionnaire = user.get(
        "questionnaire",
        {}
    )

    return jsonify({
        "success": True,
        "questionnaire": serialize_data(questionnaire)
    })


# ==========================================
# SAVE QUESTIONNAIRE
# ==========================================

@user_routes.route("/api/user/questionnaire", methods=["POST", "PUT"])
@user_login_required
def save_questionnaire():

    user_id = get_current_user_id()

    data = request.get_json(silent=True)

    if not data:

        return jsonify({
            "success": False,
            "message": "No questionnaire data received."
        }), 400

    allowed_fields = [
        "age",
        "height",
        "weight",
        "target_weight",
        "date_of_birth",
        "dob",
        "allergies",
        "fitness_meaning",
        "what_fitness_means",
        "exercise_important",
        "exercise_frequency",
        "main_fitness_goal",
        "fitness_goal",
        "biggest_challenge",
        "sleep_hours"
    ]

    questionnaire = {}

    for field in allowed_fields:

        if field in data:
            questionnaire[field] = data[field]

    if not questionnaire:

        return jsonify({
            "success": False,
            "message": "No valid questionnaire fields received."
        }), 400

    user = find_user_by_id(user_id)

    if not user:

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    old_questionnaire = user.get(
        "questionnaire",
        {}
    )

    old_questionnaire.update(questionnaire)

    updated_user = update_user(
        user_id,
        {
            "questionnaire": old_questionnaire
        }
    )

    if not updated_user:

        return jsonify({
            "success": False,
            "message": "Unable to save questionnaire."
        }), 500

    return jsonify({
        "success": True,
        "message": "Questionnaire saved successfully.",
        "questionnaire": serialize_data(
            old_questionnaire
        ),
        "redirect": "/dashboard"
    })


# ==========================================
# COMPLETE USER DATA
# ==========================================

@user_routes.route("/api/user/complete-data", methods=["GET"])
@user_login_required
def complete_user_data():

    user_id = get_current_user_id()

    complete_data = get_user_complete_data(
        user_id
    )

    if not complete_data:

        return jsonify({
            "success": False,
            "message": "User data not found."
        }), 404

    complete_data = remove_password(
        complete_data
    )

    return jsonify({
        "success": True,
        "data": serialize_data(
            complete_data
        )
    })


# ==========================================
# DASHBOARD DATA
# ==========================================

@user_routes.route("/api/dashboard", methods=["GET"])
@user_login_required
def dashboard_data():

    user_id = get_current_user_id()
    initialize_weight_goal(user_id)

    complete_data = get_user_complete_data(
        user_id
    )

    if not complete_data:

        return jsonify({
            "success": False,
            "message": "Unable to load dashboard."
        }), 404

    complete_data = remove_password(
        complete_data
    )

    return jsonify({
        "success": True,
        "dashboard": serialize_data(
            complete_data
        )
    }
)