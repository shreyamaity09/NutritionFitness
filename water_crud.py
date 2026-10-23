from bson import ObjectId

from database.mongodb import water_intake_collection


# =====================================================
# CREATE WATER RECORD
# =====================================================

def create_water_record(water_data):

    if water_intake_collection is None:
        return None

    result = water_intake_collection.insert_one(
        water_data
    )

    return water_intake_collection.find_one({
        "_id": result.inserted_id
    })


# =====================================================
# GET USER WATER RECORDS
# =====================================================

def get_user_water_records(user_id):

    if water_intake_collection is None:
        return []

    return list(
        water_intake_collection.find({
            "user_id": user_id
        })
    )


# =====================================================
# GET ONE WATER RECORD
# =====================================================

def get_water_record(record_id, user_id):

    if water_intake_collection is None:
        return None

    try:

        return water_intake_collection.find_one({
            "_id": ObjectId(record_id),
            "user_id": user_id
        })

    except Exception:

        return None


# =====================================================
# UPDATE WATER RECORD
# =====================================================

def update_water_record(
    record_id,
    user_id,
    update_data
):

    if water_intake_collection is None:
        return None

    try:

        water_intake_collection.update_one(
            {
                "_id": ObjectId(record_id),
                "user_id": user_id
            },
            {
                "$set": update_data
            }
        )

        return get_water_record(
            record_id,
            user_id
        )

    except Exception:

        return None


# =====================================================
# DELETE WATER RECORD
# =====================================================

def delete_water_record(record_id, user_id):

    if water_intake_collection is None:
        return False

    try:

        result = water_intake_collection.delete_one({
            "_id": ObjectId(record_id),
            "user_id": user_id
        })

        return result.deleted_count > 0

    except Exception:

        return False