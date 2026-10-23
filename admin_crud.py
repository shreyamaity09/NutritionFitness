from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

from database.mongodb import admins_collection


# =====================================================
# CREATE ADMIN
# =====================================================

def create_admin(admin_data):

    if admins_collection is None:
        return None

    existing_username = admins_collection.find_one({
        "username": admin_data["username"]
    })

    if existing_username:
        return None

    existing_email = admins_collection.find_one({
        "email": admin_data["email"]
    })

    if existing_email:
        return None

    admin_data["password"] = generate_password_hash(
        admin_data["password"]
    )

    result = admins_collection.insert_one(admin_data)

    return admins_collection.find_one({
        "_id": result.inserted_id
    })


# =====================================================
# FIND ADMIN BY USERNAME
# =====================================================

def find_admin_by_username(username):

    if admins_collection is None:
        return None

    return admins_collection.find_one({
        "username": username
    })


# =====================================================
# CHECK ADMIN PASSWORD
# =====================================================

def check_admin_password(admin, password):

    if not admin:
        return False

    return check_password_hash(
        admin["password"],
        password
    )


# =====================================================
# FIND ADMIN BY ID
# =====================================================

def find_admin_by_id(admin_id):

    if admins_collection is None:
        return None

    try:

        return admins_collection.find_one({
            "_id": ObjectId(admin_id)
        })

    except Exception:

        return None


# =====================================================
# UPDATE ADMIN
# =====================================================

def update_admin(admin_id, update_data):

    if admins_collection is None:
        return None

    try:

        admins_collection.update_one(
            {"_id": ObjectId(admin_id)},
            {"$set": update_data}
        )

        return find_admin_by_id(admin_id)

    except Exception:

        return None


# =====================================================
# DELETE ADMIN
# =====================================================

def delete_admin(admin_id):

    if admins_collection is None:
        return False

    try:

        result = admins_collection.delete_one({
            "_id": ObjectId(admin_id)
        })

        return result.deleted_count > 0

    except Exception:

        return False


# =====================================================
# GET ALL ADMINS
# =====================================================

def get_all_admins():

    if admins_collection is None:
        return []

    return list(
        admins_collection.find({})
    )