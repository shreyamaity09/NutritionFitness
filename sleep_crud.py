from bson import ObjectId

from database.mongodb import sleep_schedules_collection


# =====================================================
# CREATE SLEEP SCHEDULE
# =====================================================

def create_sleep_schedule(sleep_data):

    if sleep_schedules_collection is None:
        return None

    result = sleep_schedules_collection.insert_one(
        sleep_data
    )

    return sleep_schedules_collection.find_one({
        "_id": result.inserted_id
    })


# =====================================================
# GET USER SLEEP SCHEDULES
# =====================================================

def get_user_sleep_schedules(user_id):

    if sleep_schedules_collection is None:
        return []

    return list(
        sleep_schedules_collection.find({
            "user_id": user_id
        })
    )


# =====================================================
# GET ONE SLEEP SCHEDULE
# =====================================================

def get_sleep_schedule(schedule_id, user_id):

    if sleep_schedules_collection is None:
        return None

    try:

        return sleep_schedules_collection.find_one({
            "_id": ObjectId(schedule_id),
            "user_id": user_id
        })

    except Exception:

        return None


# =====================================================
# UPDATE SLEEP SCHEDULE
# =====================================================

def update_sleep_schedule(
    schedule_id,
    user_id,
    update_data
):

    if sleep_schedules_collection is None:
        return None

    try:

        sleep_schedules_collection.update_one(
            {
                "_id": ObjectId(schedule_id),
                "user_id": user_id
            },
            {
                "$set": update_data
            }
        )

        return get_sleep_schedule(
            schedule_id,
            user_id
        )

    except Exception:

        return None


# =====================================================
# DELETE SLEEP SCHEDULE
# =====================================================

def delete_sleep_schedule(schedule_id, user_id):

    if sleep_schedules_collection is None:
        return False

    try:

        result = sleep_schedules_collection.delete_one({
            "_id": ObjectId(schedule_id),
            "user_id": user_id
        })

        return result.deleted_count > 0

    except Exception:

        return False