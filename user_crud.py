from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

from database.mongodb import users_collection


# =====================================================
# CREATE USER
# =====================================================

def create_user(user_data):

    if users_collection is None:
        return None

    existing_username = users_collection.find_one({
        "username": user_data["username"]
    })

    if existing_username:
        return None

    existing_email = users_collection.find_one({
        "email": user_data["email"]
    })

    if existing_email:
        return None

    user_data["password"] = generate_password_hash(
        user_data["password"]
    )

    result = users_collection.insert_one(user_data)

    return users_collection.find_one({
        "_id": result.inserted_id
    })


# =====================================================
# FIND USER BY USERNAME
# =====================================================

def find_user_by_username(username):

    if users_collection is None:
        return None

    return users_collection.find_one({
        "username": username
    })


# =====================================================
# FIND USER BY EMAIL
# =====================================================

def find_user_by_email(email):

    if users_collection is None:
        return None

    return users_collection.find_one({
        "email": email
    })


# =====================================================
# FIND USER BY ID
# =====================================================

def find_user_by_id(user_id):

    if users_collection is None:
        return None

    try:

        return users_collection.find_one({
            "_id": ObjectId(user_id)
        })

    except Exception:

        return None


# =====================================================
# CHECK PASSWORD
# =====================================================

def check_user_password(user, password):

    if not user:
        return False

    return check_password_hash(
        user["password"],
        password
    )


# =====================================================
# UPDATE USER
# =====================================================

def update_user(user_id, update_data):

    if users_collection is None:
        return None

    try:

        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        return find_user_by_id(user_id)

    except Exception:

        return None


# =====================================================
# DELETE USER
# =====================================================

def delete_user(user_id):

    if users_collection is None:
        return False

    try:

        result = users_collection.delete_one({
            "_id": ObjectId(user_id)
        })

        return result.deleted_count > 0

    except Exception:

        return False


# =====================================================
# GET ALL USERS
# =====================================================

def get_all_users():

    if users_collection is None:
        return []

    return list(
        users_collection.find({})
    )
def get_user_complete_data(user_id):

    if users_collection is None:
        return None

    try:

        user_object_id = ObjectId(user_id)

    except Exception:

        return None

    pipeline = [

        {
            "$match": {
                "_id": user_object_id
            }
        },

        {
            "$lookup": {
                "from": "meal_plans",
                "let": {
                    "current_user_id": {
                        "$toString": "$_id"
                    }
                },
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$eq": [
                                    "$user_id",
                                    "$$current_user_id"
                                ]
                            }
                        }
                    }
                ],
                "as": "meal_plans"
            }
        },

        {
            "$lookup": {
                "from": "exercise_plans",
                "let": {
                    "current_user_id": {
                        "$toString": "$_id"
                    }
                },
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$eq": [
                                    "$user_id",
                                    "$$current_user_id"
                                ]
                            }
                        }
                    }
                ],
                "as": "exercise_plans"
            }
        },

        {
            "$lookup": {
                "from": "sleep_schedules",
                "let": {
                    "current_user_id": {
                        "$toString": "$_id"
                    }
                },
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$eq": [
                                    "$user_id",
                                    "$$current_user_id"
                                ]
                            }
                        }
                    }
                ],
                "as": "sleep_schedules"
            }
        },

        {
            "$lookup": {
                "from": "water_intake",
                "let": {
                    "current_user_id": {
                        "$toString": "$_id"
                    }
                },
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$eq": [
                                    "$user_id",
                                    "$$current_user_id"
                                ]
                            }
                        }
                    }
                ],
                "as": "water_intake"
            }
        },

        {
            "$lookup": {
                "from": "progress",
                "let": {
                    "current_user_id": {
                        "$toString": "$_id"
                    }
                },
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$eq": [
                                    "$user_id",
                                    "$$current_user_id"
                                ]
                            }
                        }
                    }
                ],
                "as": "progress"
            }
        },

        {
            "$project": {
                "password": 0
            }
        }
    ]

    result = list(
        users_collection.aggregate(
            pipeline
        )
    )

    if not result:
        return None

    return result[0]


# =====================================================
# INITIALIZE WEIGHT GOAL TIMELINE
# =====================================================

from datetime import date
import math


def initialize_weight_goal(user_id):
    """
    Initialize a weight-goal timeline if one does not exist.
    Preserve the existing start date when the goal is unchanged.
    """

    if users_collection is None:
        return None

    try:
        user_object_id = ObjectId(user_id)

        user = users_collection.find_one({
            "_id": user_object_id
        })

        if not user:
            return None

        questionnaire = user.get("questionnaire", {})

        current_weight = questionnaire.get("weight")
        target_weight = questionnaire.get("target_weight")

        try:
            current_weight = float(current_weight)
            target_weight = float(target_weight)
        except (TypeError, ValueError):
            return None

        if current_weight <= 0 or target_weight <= 0:
            return None

        if current_weight == target_weight:
            return None

        existing_goal = user.get("weight_goal", {})

        # Keep the existing timeline if the goal weights
        # have not changed.
        if (
            existing_goal
            and existing_goal.get("start_weight") == current_weight
            and existing_goal.get("target_weight") == target_weight
            and existing_goal.get("start_date")
        ):
            return existing_goal

        # Illustrative estimate: 0.5 kg per week.
        weight_difference = abs(
            current_weight - target_weight
        )

        estimated_weeks = math.ceil(
            weight_difference / 0.5
        )

        goal = {
            "start_weight": current_weight,
            "target_weight": target_weight,
            "start_date": date.today().isoformat(),
            "estimated_total_weeks": estimated_weeks
        }

        users_collection.update_one(
            {"_id": user_object_id},
            {"$set": {"weight_goal": goal}}
        )

        return goal

    except Exception:
        return None
