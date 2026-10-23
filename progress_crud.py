from bson import ObjectId

from database.mongodb import progress_collection


# =====================================================
# CREATE PROGRESS RECORD
# =====================================================

def create_progress(progress_data):

    if progress_collection is None:
        return None

    result = progress_collection.insert_one(
        progress_data
    )

    return progress_collection.find_one({
        "_id": result.inserted_id
    })


# =====================================================
# GET USER PROGRESS
# =====================================================

def get_user_progress(user_id):

    if progress_collection is None:
        return []

    return list(
        progress_collection.find({
            "user_id": user_id
        })
    )


# =====================================================
# GET ONE PROGRESS RECORD
# =====================================================

def get_progress(progress_id, user_id):

    if progress_collection is None:
        return None

    try:

        return progress_collection.find_one({
            "_id": ObjectId(progress_id),
            "user_id": user_id
        })

    except Exception:

        return None


# =====================================================
# FIND DAILY COMPLETION
# =====================================================

def get_daily_completion(
    user_id,
    completion_type,
    completion_date
):

    if progress_collection is None:
        return None

    return progress_collection.find_one({
        "user_id": user_id,
        "completion_type": completion_type,
        "completion_date": completion_date,
        "status": "completed"
    })


# =====================================================
# CREATE DAILY COMPLETION
# =====================================================

def create_daily_completion(
    user_id,
    completion_type,
    completion_date,
    plan_id=None,
    plan_name=None,
    focus=None
):

    if progress_collection is None:
        return None

    # -----------------------------------------------
    # Prevent duplicate completion on same day
    # -----------------------------------------------

    existing_completion = get_daily_completion(
        user_id,
        completion_type,
        completion_date
    )

    if existing_completion:

        return existing_completion


    progress_data = {
        "user_id": user_id,

        "type": completion_type,

        "progress_type": completion_type,

        "completion_type": completion_type,

        "status": "completed",

        "percentage": 100,

        "progress": 100,

        "completion_date": completion_date,

        "created_at": __import__(
            "datetime"
        ).datetime.utcnow()
    }


    if plan_id:
        progress_data["plan_id"] = plan_id


    if plan_name:
        progress_data["plan_name"] = plan_name


    if focus:
        progress_data["focus"] = focus


    result = progress_collection.insert_one(
        progress_data
    )


    return progress_collection.find_one({
        "_id": result.inserted_id
    })


# =====================================================
# UPDATE PROGRESS
# =====================================================

def update_progress(
    progress_id,
    user_id,
    update_data
):

    if progress_collection is None:
        return None

    try:

        progress_collection.update_one(
            {
                "_id": ObjectId(progress_id),
                "user_id": user_id
            },
            {
                "$set": update_data
            }
        )

        return get_progress(
            progress_id,
            user_id
        )

    except Exception:

        return None


# =====================================================
# DELETE PROGRESS
# =====================================================

def delete_progress(
    progress_id,
    user_id
):

    if progress_collection is None:
        return False

    try:

        result = progress_collection.delete_one({
            "_id": ObjectId(progress_id),
            "user_id": user_id
        })

        return result.deleted_count > 0

    except Exception:

        return False