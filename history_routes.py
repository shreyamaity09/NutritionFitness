from flask import Blueprint, jsonify

import database.mongodb as mongodb

from routes.route_helpers import (
    serialize_data,
    user_login_required,
    get_current_user_id
)


history_routes = Blueprint("history_routes", __name__)


@history_routes.route("/api/history", methods=["GET"])
@user_login_required
def get_history():

    user_id = get_current_user_id()

    try:

        history = []

        # ==================================================
        # PROGRESS / DAILY COMPLETION HISTORY
        # ==================================================
        #
        # This is the most important collection for History.
        #
        # Meal, Exercise, Water and Sleep completion records
        # are stored here.
        #
        # IMPORTANT:
        # Always filter using the logged-in user's user_id.
        #

        if mongodb.progress_collection is not None:

            progress_records = list(
                mongodb.progress_collection.find(
                    {
                        "user_id": user_id
                    }
                )
            )

            for record in progress_records:

                completion_type = str(
                    record.get("completion_type", "")
                ).strip().lower()

                progress_type = str(
                    record.get("progress_type", "")
                ).strip().lower()

                record_type = str(
                    record.get("type", "")
                ).strip().lower()


                # ------------------------------------------
                # Determine the history type
                # ------------------------------------------

                if completion_type in [
                    "meal",
                    "exercise",
                    "water",
                    "sleep"
                ]:

                    record["type"] = completion_type

                elif progress_type in [
                    "meal",
                    "exercise",
                    "water",
                    "sleep"
                ]:

                    record["type"] = progress_type

                elif record_type in [
                    "meal",
                    "exercise",
                    "water",
                    "sleep"
                ]:

                    record["type"] = record_type

                else:

                    record["type"] = "progress"


                history.append(record)


        # ==================================================
        # MEAL PLAN RECORDS
        # ==================================================
        #
        # Include saved meal plans too.
        #
        # These are NOT used as daily completion records.
        # They are useful when the user has generated/saved
        # a meal plan.
        #

        if mongodb.meal_plans_collection is not None:

            meal_records = list(
                mongodb.meal_plans_collection.find(
                    {
                        "user_id": user_id
                    }
                )
            )

            for record in meal_records:

                # Avoid adding records that are already
                # explicitly marked as daily completions.

                if record.get("status") == "completed":
                    continue

                record["type"] = "meal"

                history.append(record)


        # ==================================================
        # EXERCISE PLAN RECORDS
        # ==================================================

        if mongodb.exercise_plans_collection is not None:

            exercise_records = list(
                mongodb.exercise_plans_collection.find(
                    {
                        "user_id": user_id
                    }
                )
            )

            for record in exercise_records:

                if record.get("status") == "completed":
                    continue

                record["type"] = "exercise"

                history.append(record)


        # ==================================================
        # WATER RECORDS
        # ==================================================

        if mongodb.water_intake_collection is not None:

            water_records = list(
                mongodb.water_intake_collection.find(
                    {
                        "user_id": user_id
                    }
                )
            )

            for record in water_records:

                record["type"] = "water"

                history.append(record)


        # ==================================================
        # SLEEP RECORDS
        # ==================================================

        if mongodb.sleep_schedules_collection is not None:

            sleep_records = list(
                mongodb.sleep_schedules_collection.find(
                    {
                        "user_id": user_id
                    }
                )
            )

            for record in sleep_records:

                record["type"] = "sleep"

                history.append(record)


        # ==================================================
        # SORT HISTORY
        # ==================================================
        #
        # completion_date is preferred because it represents
        # the actual day on which the task was completed.
        #
        # created_at is used as a fallback.
        #

        def get_sort_date(record):

            return (
                record.get("completion_date")
                or record.get("created_at")
                or record.get("updated_at")
                or record.get("date")
                or ""
            )


        history.sort(
            key=get_sort_date,
            reverse=True
        )


        # ==================================================
        # RETURN
        # ==================================================

        return jsonify({
            "success": True,
            "history": serialize_data(history)
        })


    except Exception as error:

        print(
            "History loading error:",
            error
        )

        return jsonify({
            "success": False,
            "message": "Unable to load history."
        }), 500