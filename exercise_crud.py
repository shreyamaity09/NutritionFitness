from bson import ObjectId

from database.mongodb import exercise_plans_collection


# =====================================================
# CREATE EXERCISE PLAN
# =====================================================

def create_exercise_plan(exercise_data):

    if exercise_plans_collection is None:
        return None

    result = exercise_plans_collection.insert_one(
        exercise_data
    )

    return exercise_plans_collection.find_one({
        "_id": result.inserted_id
    })


# =====================================================
# GET USER EXERCISE PLANS
# =====================================================

def get_user_exercise_plans(user_id):

    if exercise_plans_collection is None:
        return []

    return list(
        exercise_plans_collection.find({
            "user_id": user_id
        })
    )


# =====================================================
# GET ONE EXERCISE PLAN
# =====================================================

def get_exercise_plan(plan_id, user_id):

    if exercise_plans_collection is None:
        return None

    try:

        return exercise_plans_collection.find_one({
            "_id": ObjectId(plan_id),
            "user_id": user_id
        })

    except Exception:

        return None


# =====================================================
# UPDATE EXERCISE PLAN
# =====================================================

def update_exercise_plan(
    plan_id,
    user_id,
    update_data
):

    if exercise_plans_collection is None:
        return None

    try:

        exercise_plans_collection.update_one(
            {
                "_id": ObjectId(plan_id),
                "user_id": user_id
            },
            {
                "$set": update_data
            }
        )

        return get_exercise_plan(
            plan_id,
            user_id
        )

    except Exception:

        return None


# =====================================================
# DELETE EXERCISE PLAN
# =====================================================

def delete_exercise_plan(plan_id, user_id):

    if exercise_plans_collection is None:
        return False

    try:

        result = exercise_plans_collection.delete_one({
            "_id": ObjectId(plan_id),
            "user_id": user_id
        })

        return result.deleted_count > 0

    except Exception:

        return False