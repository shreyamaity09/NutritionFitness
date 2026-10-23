from bson import ObjectId

from database.mongodb import meal_plans_collection


# =====================================================
# CREATE MEAL PLAN
# =====================================================

def create_meal_plan(meal_data):

    if meal_plans_collection is None:
        return None

    result = meal_plans_collection.insert_one(meal_data)

    return meal_plans_collection.find_one({
        "_id": result.inserted_id
    })


# =====================================================
# GET MEAL PLANS FOR USER
# =====================================================

def get_user_meal_plans(user_id):

    if meal_plans_collection is None:
        return []

    return list(
        meal_plans_collection.find({
            "user_id": user_id
        })
    )


# =====================================================
# GET ONE MEAL PLAN
# =====================================================

def get_meal_plan(plan_id, user_id):

    if meal_plans_collection is None:
        return None

    try:

        return meal_plans_collection.find_one({
            "_id": ObjectId(plan_id),
            "user_id": user_id
        })

    except Exception:

        return None


# =====================================================
# UPDATE MEAL PLAN
# =====================================================

def update_meal_plan(plan_id, user_id, update_data):

    if meal_plans_collection is None:
        return None

    try:

        meal_plans_collection.update_one(
            {
                "_id": ObjectId(plan_id),
                "user_id": user_id
            },
            {
                "$set": update_data
            }
        )

        return get_meal_plan(plan_id, user_id)

    except Exception:

        return None


# =====================================================
# DELETE MEAL PLAN
# =====================================================

def delete_meal_plan(plan_id, user_id):

    if meal_plans_collection is None:
        return False

    try:

        result = meal_plans_collection.delete_one({
            "_id": ObjectId(plan_id),
            "user_id": user_id
        })

        return result.deleted_count > 0

    except Exception:

        return False