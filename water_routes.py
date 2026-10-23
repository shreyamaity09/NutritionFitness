from flask import Blueprint, request, jsonify

import database.mongodb as mongodb

from crud.water_crud import (
    create_water_record,
    get_user_water_records,
    get_water_record,
    update_water_record,
    delete_water_record
)

from routes.route_helpers import (
    serialize_data,
    user_login_required,
    get_current_user_id,
    get_current_time
)


water_routes = Blueprint(
    "water_routes",
    __name__
)


# ==========================================
# GET ALL WATER RECORDS
# ==========================================

@water_routes.route(
    "/api/water-intake",
    methods=["GET"]
)
@user_login_required
def get_water_records():

    if mongodb.water_intake_collection is None:

        return jsonify({
            "success": False,
            "message": "Database is not connected yet."
        }), 503

    user_id = get_current_user_id()

    records = get_user_water_records(
        user_id
    )

    return jsonify({
        "success": True,
        "water_records": serialize_data(
            records
        )
    })


# ==========================================
# CREATE WATER RECORD
# ==========================================

@water_routes.route(
    "/api/water-intake",
    methods=["POST"]
)
@user_login_required
def create_water():

    if mongodb.water_intake_collection is None:

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

    water_record = create_water_record(
        data
    )

    if not water_record:

        return jsonify({
            "success": False,
            "message": "Unable to create water record."
        }), 500

    return jsonify({
        "success": True,
        "message": "Water record created successfully.",
        "water_record": serialize_data(
            water_record
        )
    }), 201


# ==========================================
# GET ONE WATER RECORD
# ==========================================

@water_routes.route(
    "/api/water-intake/<record_id>",
    methods=["GET"]
)
@user_login_required
def get_one_water(record_id):

    user_id = get_current_user_id()

    record = get_water_record(
        record_id,
        user_id
    )

    if not record:

        return jsonify({
            "success": False,
            "message": "Water record not found."
        }), 404

    return jsonify({
        "success": True,
        "water_record": serialize_data(
            record
        )
    })


# ==========================================
# UPDATE WATER RECORD
# ==========================================

@water_routes.route(
    "/api/water-intake/<record_id>",
    methods=["PUT"]
)
@user_login_required
def update_water(record_id):

    data = request.get_json(silent=True) or {}

    user_id = get_current_user_id()

    data.pop("user_id", None)
    data.pop("_id", None)

    updated_record = update_water_record(
        record_id,
        user_id,
        data
    )

    if not updated_record:

        return jsonify({
            "success": False,
            "message": "Water record not found or could not be updated."
        }), 404

    return jsonify({
        "success": True,
        "message": "Water record updated successfully.",
        "water_record": serialize_data(
            updated_record
        )
    })


# ==========================================
# DELETE WATER RECORD
# ==========================================

@water_routes.route(
    "/api/water-intake/<record_id>",
    methods=["DELETE"]
)
@user_login_required
def delete_water(record_id):

    user_id = get_current_user_id()

    deleted = delete_water_record(
        record_id,
        user_id
    )

    if not deleted:

        return jsonify({
            "success": False,
            "message": "Water record not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Water record deleted successfully."
    })