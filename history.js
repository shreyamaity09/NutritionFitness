document.addEventListener("DOMContentLoaded", function () {

    let historyRecords = [];


    // ==================================================
    // GET ELEMENT
    // ==================================================

    function getElement(id) {
        return document.getElementById(id);
    }


    // ==================================================
    // HISTORY CONTAINER
    // ==================================================

    function getHistoryContainer() {

        return (
            getElement("historyContainer") ||
            document.querySelector(".history-container")
        );
    }


    // ==================================================
    // DATE / TIME
    // ==================================================

    function getRecordDate(record) {

        /*
         * completion_date must come first.
         *
         * Your daily completion records contain:
         *
         * completion_date: YYYY-MM-DD
         *
         * This represents the actual day the user completed
         * the task.
         */

        return (
            record.completion_date ||
            record.created_at ||
            record.date ||
            record.updated_at ||
            record.timestamp ||
            null
        );
    }


    // ==================================================
    // GET DATE KEY
    // ==================================================

    function getDateKey(record) {

        /*
         * If completion_date already exists, use it directly.
         *
         * Example:
         *
         * 2026-09-30
         *
         * This prevents UTC conversion from moving the record
         * to another date.
         */

        if (record.completion_date) {

            return String(
                record.completion_date
            ).substring(0, 10);
        }


        const dateValue =
            record.created_at ||
            record.date ||
            record.updated_at ||
            record.timestamp ||
            null;


        if (!dateValue) {
            return "unknown";
        }


        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {
            return "unknown";
        }


        /*
         * Use the browser's local date.
         */

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        return `${year}-${month}-${day}`;
    }


    // ==================================================
    // FORMAT DATE
    // ==================================================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "Date not available";
        }


        /*
         * Handle YYYY-MM-DD directly.
         *
         * Do NOT use new Date("YYYY-MM-DD") here because
         * JavaScript treats that format as UTC.
         */

        const dateString =
            String(dateValue).substring(0, 10);


        const parts =
            dateString.split("-");


        if (parts.length === 3) {

            const year =
                Number(parts[0]);

            const month =
                Number(parts[1]) - 1;

            const day =
                Number(parts[2]);


            const localDate =
                new Date(
                    year,
                    month,
                    day
                );


            if (!isNaN(localDate.getTime())) {

                return localDate.toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );
            }
        }


        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {
            return "Date not available";
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    }


    // ==================================================
    // FORMAT TIME
    // ==================================================

    function formatTime(dateValue) {

        /*
         * completion_date contains only a date.
         * There is no time to display.
         */

        if (!dateValue) {
            return "";
        }


        const value =
            String(dateValue);


        if (
            /^\d{4}-\d{2}-\d{2}$/.test(value)
        ) {

            return "";
        }


        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {
            return "";
        }


        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    // ==================================================
    // IDENTIFY RECORD TYPE
    // ==================================================

    function getRecordType(record) {

        const type =
            String(
                record.completion_type ||
                record.type ||
                record.progress_type ||
                record.category ||
                record.record_type ||
                ""
            ).toLowerCase();


        if (
            type.includes("meal") ||
            type.includes("food")
        ) {

            return "meal";
        }


        if (
            type.includes("exercise") ||
            type.includes("workout")
        ) {

            return "exercise";
        }


        if (
            type.includes("water") ||
            type.includes("hydration")
        ) {

            return "water";
        }


        if (
            type.includes("sleep")
        ) {

            return "sleep";
        }


        if (
            type.includes("progress") ||
            type.includes("calorie")
        ) {

            return "progress";
        }


        return "other";
    }


    // ==================================================
    // RECORD TITLE
    // ==================================================

    function getRecordTitle(record, type) {

        // ------------------------------------------
        // DAILY COMPLETIONS
        // ------------------------------------------

        if (
            record.status === "completed" &&
            record.completion_type === "meal"
        ) {

            return "Meal Plan Completed";
        }


        if (
            record.status === "completed" &&
            record.completion_type === "exercise"
        ) {

            return "Exercise Plan Completed";
        }


        if (
            record.status === "completed" &&
            record.completion_type === "water"
        ) {

            return "Water Intake Completed";
        }


        if (
            record.status === "completed" &&
            record.completion_type === "sleep"
        ) {

            return "Sleep Schedule Completed";
        }


        // ------------------------------------------
        // MEAL
        // ------------------------------------------

        if (type === "meal") {

            return (
                record.title ||
                record.meal_name ||
                record.plan_name ||
                record.name ||
                "Meal Plan"
            );
        }


        // ------------------------------------------
        // EXERCISE
        // ------------------------------------------

        if (type === "exercise") {

            return (
                record.title ||
                record.exercise_name ||
                record.plan_name ||
                record.focus ||
                record.workout_name ||
                "Exercise Plan"
            );
        }


        // ------------------------------------------
        // WATER
        // ------------------------------------------

        if (type === "water") {

            const amount =
                record.water_amount_ml ??
                record.waterAmount ??
                record.amount ??
                record.water_intake ??
                null;


            if (
                amount !== null &&
                amount !== ""
            ) {

                return `Water Intake - ${amount} ml`;
            }


            return "Water Intake";
        }


        // ------------------------------------------
        // SLEEP
        // ------------------------------------------

        if (type === "sleep") {

            return (
                record.title ||
                record.plan_name ||
                record.sleep_schedule ||
                record.recommendation ||
                "Sleep Schedule"
            );
        }


        // ------------------------------------------
        // PROGRESS
        // ------------------------------------------

        if (type === "progress") {

            return "Progress Updated";
        }


        return (
            record.title ||
            record.name ||
            "Health Activity"
        );
    }


    // ==================================================
    // RECORD DESCRIPTION
    // ==================================================

    function getRecordDescription(record, type) {

        // ------------------------------------------
        // MEAL COMPLETION
        // ------------------------------------------

        if (
            record.status === "completed" &&
            record.completion_type === "meal"
        ) {

            return (
                "You completed your meal plan for today."
            );
        }


        // ------------------------------------------
        // EXERCISE COMPLETION
        // ------------------------------------------

        if (
            record.status === "completed" &&
            record.completion_type === "exercise"
        ) {

            if (record.focus) {

                return (
                    `You completed today's workout. Focus: ${record.focus}`
                );
            }


            return (
                "You completed your exercise plan for today."
            );
        }


        // ------------------------------------------
        // WATER COMPLETION
        // ------------------------------------------

        if (
            record.status === "completed" &&
            record.completion_type === "water"
        ) {

            return (
                "You completed today's recommended water intake."
            );
        }


        // ------------------------------------------
        // SLEEP COMPLETION
        // ------------------------------------------

        if (
            record.status === "completed" &&
            record.completion_type === "sleep"
        ) {

            return (
                "You completed today's recommended sleep schedule."
            );
        }


        // ------------------------------------------
        // MEAL
        // ------------------------------------------

        if (type === "meal") {

            if (record.breakfast) {

                if (
                    typeof record.breakfast === "object"
                ) {

                    return (
                        `Breakfast: ${
                            record.breakfast.name ||
                            record.breakfast.meal_name ||
                            "Meal"
                        }`
                    );
                }


                return (
                    `Breakfast: ${record.breakfast}`
                );
            }


            if (record.lunch) {

                if (
                    typeof record.lunch === "object"
                ) {

                    return (
                        `Lunch: ${
                            record.lunch.name ||
                            record.lunch.meal_name ||
                            "Meal"
                        }`
                    );
                }


                return (
                    `Lunch: ${record.lunch}`
                );
            }


            if (record.dinner) {

                if (
                    typeof record.dinner === "object"
                ) {

                    return (
                        `Dinner: ${
                            record.dinner.name ||
                            record.dinner.meal_name ||
                            "Meal"
                        }`
                    );
                }


                return (
                    `Dinner: ${record.dinner}`
                );
            }


            if (record.description) {
                return record.description;
            }


            return "Meal plan recorded successfully.";
        }


        // ------------------------------------------
        // EXERCISE
        // ------------------------------------------

        if (type === "exercise") {

            if (record.focus) {

                return (
                    `Focus: ${record.focus}`
                );
            }


            if (record.exercise_name) {

                return (
                    `Exercise: ${record.exercise_name}`
                );
            }


            if (record.exercises) {

                if (
                    Array.isArray(
                        record.exercises
                    )
                ) {

                    return (
                        record.exercises.join(", ")
                    );
                }


                return record.exercises;
            }


            if (record.description) {
                return record.description;
            }


            return (
                "Exercise plan recorded successfully."
            );
        }


        // ------------------------------------------
        // WATER
        // ------------------------------------------

        if (type === "water") {

            const amount =
                record.water_amount_ml ??
                record.waterAmount ??
                record.amount ??
                record.water_intake ??
                null;


            if (
                amount !== null &&
                amount !== ""
            ) {

                return (
                    `${amount} ml of water recorded.`
                );
            }


            if (record.evaluation) {
                return record.evaluation;
            }


            return (
                "Water intake recorded successfully."
            );
        }


        // ------------------------------------------
        // SLEEP
        // ------------------------------------------

        if (type === "sleep") {

            const duration =
                record.sleep_duration ??
                record.sleepDuration ??
                record.duration ??
                null;


            if (
                duration !== null &&
                duration !== ""
            ) {

                return (
                    `Sleep duration: ${duration} hours`
                );
            }


            if (record.recommendation) {
                return record.recommendation;
            }


            return (
                "Sleep schedule recorded successfully."
            );
        }


        // ------------------------------------------
        // PROGRESS
        // ------------------------------------------

        if (type === "progress") {

            const percentage =
                record.percentage ??
                record.progress ??
                record.value ??
                null;


            if (
                percentage !== null &&
                percentage !== ""
            ) {

                return (
                    `Progress: ${percentage}%`
                );
            }


            if (record.description) {
                return record.description;
            }


            return "Progress record saved.";
        }


        return "Health activity recorded.";
    }


    // ==================================================
    // ICON
    // ==================================================

    function getRecordIcon(type) {

        if (type === "meal") {
            return "🍽️";
        }


        if (type === "exercise") {
            return "🏋️";
        }


        if (type === "water") {
            return "💧";
        }


        if (type === "sleep") {
            return "😴";
        }


        if (type === "progress") {
            return "📊";
        }


        return "❤️";
    }


    // ==================================================
    // ESCAPE HTML
    // ==================================================

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";
        }


        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ==================================================
    // CREATE HISTORY RECORD
    // ==================================================

    function createHistoryRecord(record) {

        const type =
            getRecordType(record);


        const dateValue =
            getRecordDate(record);


        const title =
            getRecordTitle(
                record,
                type
            );


        const description =
            getRecordDescription(
                record,
                type
            );


        const icon =
            getRecordIcon(type);


        const time =
            formatTime(dateValue);


        const recordElement =
            document.createElement("div");


        recordElement.className =
            `history-record ${type}`;


        recordElement.innerHTML = `

            <div class="history-record-icon">
                ${icon}
            </div>

            <div class="history-record-content">

                <h4>
                    ${escapeHTML(title)}
                </h4>

                <p>
                    ${escapeHTML(description)}
                </p>

                ${
                    time
                    ? `
                        <span class="history-record-time">
                            ${escapeHTML(time)}
                        </span>
                    `
                    : ""
                }

            </div>

        `;


        return recordElement;
    }


    // ==================================================
    // GROUP RECORDS BY DATE
    // ==================================================

    function groupRecordsByDate(records) {

        const groups = {};


        records.forEach(function (record) {

            const dateKey =
                getDateKey(record);


            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }


            groups[dateKey].push(record);

        });


        return groups;
    }


    // ==================================================
    // DISPLAY HISTORY
    // ==================================================

    window.displayHistory = function (
        filterType = "all"
    ) {

        const container =
            getHistoryContainer();


        if (!container) {

            console.warn(
                "History container not found."
            );

            return;
        }


        container.innerHTML = "";


        let filteredRecords =
            [...historyRecords];


        // ------------------------------------------
        // FILTER
        // ------------------------------------------

        if (filterType !== "all") {

            filteredRecords =
                filteredRecords.filter(
                    function (record) {

                        return (
                            getRecordType(record)
                            === filterType
                        );
                    }
                );
        }


        // ------------------------------------------
        // NO RECORDS
        // ------------------------------------------

        if (
            filteredRecords.length === 0
        ) {

            showNoHistory();

            return;
        }


        // ------------------------------------------
        // GROUP BY DATE
        // ------------------------------------------

        const groupedRecords =
            groupRecordsByDate(
                filteredRecords
            );


        const dates =
            Object.keys(groupedRecords)
                .sort(function (a, b) {

                    if (a === "unknown") {
                        return 1;
                    }


                    if (b === "unknown") {
                        return -1;
                    }


                    return b.localeCompare(a);
                });


        // ------------------------------------------
        // CREATE DATE CARDS
        // ------------------------------------------

        dates.forEach(function (dateKey) {

            const dateCard =
                document.createElement("div");


            dateCard.className =
                "history-date-card";


            const dateHeading =
                document.createElement("h3");


            if (dateKey === "unknown") {

                dateHeading.textContent =
                    "Date Not Available";

            } else {

                dateHeading.textContent =
                    formatDate(dateKey);
            }


            dateCard.appendChild(
                dateHeading
            );


            const records =
                groupedRecords[dateKey].sort(
                    function (a, b) {

                        const dateA =
                            new Date(
                                a.created_at ||
                                a.updated_at ||
                                0
                            );


                        const dateB =
                            new Date(
                                b.created_at ||
                                b.updated_at ||
                                0
                            );


                        return dateB - dateA;
                    }
                );


            records.forEach(
                function (record) {

                    dateCard.appendChild(
                        createHistoryRecord(
                            record
                        )
                    );
                }
            );


            container.appendChild(
                dateCard
            );

        });


        // ------------------------------------------
        // HIDE NO HISTORY MESSAGE
        // ------------------------------------------

        const noHistory =
            getElement("noHistory");


        if (noHistory) {

            noHistory.style.display =
                "none";
        }
    };


    // ==================================================
    // NO HISTORY
    // ==================================================

    function showNoHistory() {

        const container =
            getHistoryContainer();


        if (container) {

            container.innerHTML = "";
        }


        const noHistory =
            getElement("noHistory");


        if (noHistory) {

            noHistory.style.display =
                "block";

            return;
        }


        if (container) {

            const message =
                document.createElement("div");


            message.className =
                "no-history";


            message.innerHTML = `

                <div class="no-history-icon">
                    📋
                </div>

                <h3>
                    No history found
                </h3>

                <p>
                    Your health activities will
                    appear here once you start
                    using NutriTrack.
                </p>

            `;


            container.appendChild(
                message
            );
        }
    }


    // ==================================================
    // FILTER BUTTONS
    // ==================================================

    window.filterHistory = function (
        filterType,
        clickedButton
    ) {

        displayHistory(
            filterType
        );


        const buttons =
            document.querySelectorAll(
                ".history-filter-btn"
            );


        buttons.forEach(
            function (button) {

                button.classList.remove(
                    "active"
                );
            }
        );


        if (clickedButton) {

            clickedButton.classList.add(
                "active"
            );
        }
    };


    // ==================================================
    // LOAD HISTORY FROM FLASK API
    // ==================================================

    async function loadHistoryFromAPI() {

        try {

            const response =
                await fetch(
                    "/api/history",
                    {
                        method: "GET",
                        credentials: "same-origin",
                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );


            // ------------------------------------------
            // NOT LOGGED IN
            // ------------------------------------------

            if (response.status === 401) {

                window.location.href =
                    "/login";

                return;
            }


            const data =
                await response.json();


            // ------------------------------------------
            // SUCCESS
            // ------------------------------------------

            if (
                response.ok &&
                data.success
            ) {

                historyRecords =
                    Array.isArray(
                        data.history
                    )
                    ? data.history
                    : [];


                displayHistory("all");

                return;
            }


            // ------------------------------------------
            // API ERROR
            // ------------------------------------------

            console.warn(
                "Could not load history:",
                data.message ||
                "Unknown server error."
            );


            /*
             * Do NOT use old shared localStorage
             * history here.
             *
             * The database/API is the source of truth.
             */

            historyRecords = [];

            displayHistory("all");


        } catch (error) {

            console.error(
                "History API unavailable:",
                error
            );


            /*
             * Do not load shared localStorage data.
             *
             * Otherwise one user's browser data could
             * appear as another user's history.
             */

            historyRecords = [];

            displayHistory("all");
        }
    }


    // ==================================================
    // DEFAULT FILTER
    // ==================================================

    function setDefaultFilter() {

        const buttons =
            document.querySelectorAll(
                ".history-filter-btn"
            );


        buttons.forEach(function (button) {

            button.classList.remove(
                "active"
            );

        });


        const firstButton =
            document.querySelector(
                ".history-filter-btn"
            );


        if (firstButton) {

            firstButton.classList.add(
                "active"
            );
        }
    }


    // ==================================================
    // INITIALIZE
    // ==================================================

    setDefaultFilter();

    loadHistoryFromAPI();

});