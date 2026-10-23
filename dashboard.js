    // ==========================================
    // NUTRITRACK - DASHBOARD
    // Backend connected with Flask API
    // ==========================================

    document.addEventListener("DOMContentLoaded", function () {

        updateTodayDate();

        loadDashboardData();

        setupMobileSidebar();

        setupLogout();

    });


    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    async function loadDashboardData() {

        try {

            const response = await fetch("/api/dashboard", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });


            // --------------------------------------
            // USER NOT LOGGED IN
            // --------------------------------------

            if (response.status === 401) {

                window.location.href = "/login";

                return;
            }


            const data = await response.json()
                .catch(function () {
                    return {};
                });


            if (!response.ok || data.success === false) {

                console.error(
                    "Dashboard error:",
                    data.message
                );

                return;
            }


            console.log(
    "Dashboard data:",
    data
);


// --------------------------------------
// GET ACTUAL DASHBOARD DATA
// --------------------------------------

const dashboardData =
    data.dashboard || data;


// --------------------------------------
// UPDATE DASHBOARD
// --------------------------------------

updateUserInformation(dashboardData);

updateHealthStatistics(dashboardData);

updateGoals(dashboardData);

updateWeeklyGoalTracker(dashboardData);

updateProgress(dashboardData);

updateProgressAnalytics(dashboardData);

updateHealthTip(dashboardData);

        } catch (error) {

            console.error(
                "Unable to load dashboard:",
                error
            );

            // If the backend cannot be reached,
            // keep the existing GUI data if available.

            loadLocalStorageFallback();

        }

    }


    // ==========================================
    // UPDATE USER INFORMATION
    // ==========================================

    function updateUserInformation(data) {

        const user =
            data.user || data;

        const username =
            user.username || "User";

        const name =
            user.name || username;


        const welcomeUserName =
            document.getElementById(
                "welcomeUserName"
            );

        const sidebarUserName =
            document.getElementById(
                "sidebarUserName"
            );

        const headerUserName =
            document.getElementById(
                "headerUserName"
            );


        if (welcomeUserName) {

            welcomeUserName.textContent =
                name;

        }


        if (sidebarUserName) {

            sidebarUserName.textContent =
                name;

        }


        if (headerUserName) {

            headerUserName.textContent =
                name;

        }


        const sidebarAvatar =
            document.getElementById(
                "sidebarAvatar"
            );

        const headerAvatar =
            document.getElementById(
                "headerAvatar"
            );


        const initial =
            name.charAt(0).toUpperCase();


        if (sidebarAvatar) {

            sidebarAvatar.textContent =
                initial;

        }


        if (headerAvatar) {

            headerAvatar.textContent =
                initial;

        }


        // --------------------------------------
        // PROFILE INITIAL
        // --------------------------------------

        const profileInitial =
            document.querySelector(".profile-avatar");


        if (profileInitial) {

            profileInitial.textContent =
                name.charAt(0).toUpperCase();

        }


        // --------------------------------------
        // AGE
        // --------------------------------------

        const userAge =
            document.getElementById("userAge");


        if (userAge && user.age !== undefined) {

            userAge.textContent =
                user.age;

        }


        // --------------------------------------
        // GENDER
        // --------------------------------------

        const userGender =
            document.getElementById("userGender");


        if (userGender) {

            userGender.textContent =
                user.gender ||
                "Not specified";

        }


        // --------------------------------------
        // HEIGHT
        // --------------------------------------

        const userHeight =
            document.getElementById("userHeight");


        if (userHeight && user.height !== undefined) {

            userHeight.textContent =
                user.height + " cm";

        }


        // --------------------------------------
       // WEIGHT
      // --------------------------------------

        const currentWeight =
            document.getElementById("currentWeight");

        const questionnaire =
            data.questionnaire ||
            data.user?.questionnaire ||
            data.survey_responses ||
            {};

        const weight =
            questionnaire.weight ??
            questionnaire.current_weight ??
            questionnaire.currentWeight ??
            questionnaire.weight_kg ??
            questionnaire.weightKg ??
            data.user?.weight ??
            data.user?.current_weight ??
            data.user?.currentWeight ??
            data.user?.weight_kg ??
            data.user?.weightKg;

        if (
           currentWeight &&
           weight !== undefined &&
           weight !== null &&
           weight !== ""
        ) {
           currentWeight.textContent =
            `${weight} kg`;
        }


        // --------------------------------------
        // TARGET WEIGHT
        // --------------------------------------

        const userTargetWeight =
            document.getElementById(
                "userTargetWeight"
            );


        if (userTargetWeight) {

            userTargetWeight.textContent =
                user.targetWeight ||
                user.target_weight ||
                "Not set";

        }


        // --------------------------------------
        // ALLERGIES
        // --------------------------------------

        const userAllergies =
            document.getElementById(
                "userAllergies"
            );


        if (userAllergies) {

            let allergies =
                user.allergies ||
                user.questionnaire?.allergies;


            if (Array.isArray(allergies)) {

                allergies =
                    allergies.join(", ");

            }


            userAllergies.textContent =
                allergies ||
                "None";

        }

    }


    // ==========================================
    // UPDATE HEALTH STATISTICS
    // ==========================================

    function updateHealthStatistics(data) {

        const user =
            data.user || data;


        const plans =
            data.generated_plans ||
            data.plans ||
            {};


        // --------------------------------------
        // CALORIES
        // --------------------------------------

        const calorieElement =
            document.getElementById(
                "recommendedCalories"
            );


        if (
            calorieElement &&
            plans.recommended_calories
        ) {

            calorieElement.textContent =
                plans.recommended_calories +
                " kcal";

        }


        // --------------------------------------
        // WATER
        // --------------------------------------

        const waterElement =
            document.getElementById(
                "dailyWater"
            );


        let waterTarget =
            plans.water_intake?.daily_target_ml ||
            plans.daily_water_target_ml;


        if (
            waterElement &&
            waterTarget
        ) {

            waterElement.textContent =
                waterTarget + " ml";

        }


        // --------------------------------------
        // SLEEP
        // --------------------------------------

        const sleepElement =
            document.getElementById(
                "sleepTarget"
            );


        const sleepDuration =
            plans.sleep_schedule?.recommended_duration ||
            plans.recommended_sleep_duration;


        if (
            sleepElement &&
            sleepDuration
        ) {

            sleepElement.textContent =
                sleepDuration;

        }


        // --------------------------------------
        // BEDTIME
        // --------------------------------------

        const bedtimeElement =
            document.getElementById(
                "suggestedBedtime"
            );


        if (
            bedtimeElement &&
            plans.suggested_bedtime
        ) {

            bedtimeElement.textContent =
                plans.suggested_bedtime;

        }


        // --------------------------------------
        // WAKE TIME
        // --------------------------------------

        const wakeTimeElement =
            document.getElementById(
                "suggestedWaketime"
            );


        if (
            wakeTimeElement &&
            plans.suggested_waketime
        ) {

            wakeTimeElement.textContent =
                plans.suggested_waketime;

        }

    }


    // ==========================================
    // UPDATE GOALS
    // ==========================================

    function updateGoals(data) {

        const user =
            data.user || data;


        const questionnaire =
            data.questionnaire ||
            user.questionnaire ||
            data.survey_responses ||
            {};


        // --------------------------------------
        // FITNESS GOAL
        // --------------------------------------

        let goals =
            questionnaire.main_fitness_goals ||
            questionnaire.fitnessGoals ||
            [];


        if (!Array.isArray(goals)) {

            goals = [goals];

        }


        const mainGoal =
            goals.length > 0
                ? goals[0]
                : "Build Muscle";


        const goalElement =
            document.getElementById(
                "mainGoal"
            );


        if (goalElement) {

            goalElement.textContent =
                mainGoal;

        }


        // --------------------------------------
        // HEADER GOAL
        // --------------------------------------

        const goalHeader =
            document.querySelector(
                ".goal-value"
            );


        if (goalHeader) {

            goalHeader.textContent =
                mainGoal;

        }

    }




// ==========================================
// UPDATE TODAY'S PROGRESS
// ==========================================

async function updateProgress(data) {

    try {

        const response =
            await fetch(
                "/api/progress",
                {
                    method: "GET",
                    credentials: "same-origin",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


        if (response.status === 401) {

            window.location.href =
                "/login";

            return;

        }


        const progressData =
            await response.json()
                .catch(function () {
                    return {};
                });


        if (
            !response.ok ||
            progressData.success === false
        ) {

            console.error(
                "Unable to load today's progress:",
                progressData.message
            );

            return;

        }


        const records =
            progressData.progress || [];


        // --------------------------------------
        // TODAY'S DATE
        // --------------------------------------

        const today =
            getLocalDateKey(
                new Date()
            );


        // --------------------------------------
        // ONLY TODAY'S COMPLETED RECORDS
        // --------------------------------------

        const todayRecords =
    records.filter(
        function (record) {

            if (!record) {
                return false;
            }


            // Record must be completed
            if (
                String(
                    record.status || ""
                ).toLowerCase() !== "completed"
            ) {
                return false;
            }


            // ----------------------------------
            // GET COMPLETION DATE
            // ----------------------------------

            let recordDate = "";


            if (record.completion_date) {

                recordDate =
                    String(
                        record.completion_date
                    ).substring(
                        0,
                        10
                    );

            }

            else if (record.created_at) {

                recordDate =
                    String(
                        record.created_at
                    ).substring(
                        0,
                        10
                    );

            }

            else if (record.completed_at) {

                recordDate =
                    String(
                        record.completed_at
                    ).substring(
                        0,
                        10
                    );

            }


            return recordDate === today;

        }
    );


        console.log(
            "Today's completed records:",
            todayRecords
        );


        // --------------------------------------
        // MEAL
        // --------------------------------------

        const mealCompleted =
            todayRecords.some(
                function (record) {

                    return (
                        String(
                            record.completion_type ||
                            record.type ||
                            record.progress_type ||
                            ""
                        ).toLowerCase() === "meal"
                    );

                }
            );


        const mealValue =
            document.getElementById(
                "dashboardMealValue"
            );


        if (mealValue) {

            mealValue.textContent =
                mealCompleted
                    ? "1/1"
                    : "0/1";

        }


        const mealMessage =
            document.getElementById(
                "dashboardMealMessage"
            );


        if (mealMessage) {

            mealMessage.textContent =
                mealCompleted
                    ? "Meal plan completed today."
                    : "No meal records for today.";

        }


        setProgress(
            [
                "#dashboardMealProgress",
                ".meal-progress"
            ],
            mealCompleted ? 100 : 0
        );


        // --------------------------------------
        // EXERCISE
        // --------------------------------------

        const exerciseCompleted =
            todayRecords.some(
                function (record) {

                    return (
                        String(
                            record.completion_type ||
                            record.type ||
                            record.progress_type ||
                            ""
                        ).toLowerCase() === "exercise"
                    );

                }
            );


        const exerciseValue =
            document.getElementById(
                "dashboardExerciseValue"
            );


        if (exerciseValue) {

            exerciseValue.textContent =
                exerciseCompleted
                    ? "1/1"
                    : "0/1";

        }


        const exerciseMessage =
            document.getElementById(
                "dashboardExerciseMessage"
            );


        if (exerciseMessage) {

            exerciseMessage.textContent =
                exerciseCompleted
                    ? "Workout completed today."
                    : "No workout completed today.";

        }


        setProgress(
            [
                "#dashboardExerciseProgress",
                ".exercise-progress"
            ],
            exerciseCompleted ? 100 : 0
        );


        // --------------------------------------
        // WATER
        // --------------------------------------

        const waterCompleted =
            todayRecords.some(
                function (record) {

                    return (
                        String(
                            record.completion_type ||
                            record.type ||
                            record.progress_type ||
                            ""
                        ).toLowerCase() === "water"
                    );

                }
            );


        const waterValue =
            document.getElementById(
                "dashboardWaterValue"
            );


        const waterTarget =
            document.getElementById(
                "dashboardWaterTarget"
            );


        let recommendedWater = 0;


        const plans =
            data.generated_plans ||
            data.plans ||
            {};


        recommendedWater =
            Number(
                plans.water_intake?.daily_target_ml ||
                plans.daily_water_target_ml ||
                data.water_goal ||
                data.water_target ||
                0
            );


        // --------------------------------------
        // FALLBACK TO SAVED WATER DATA
        // --------------------------------------

        if (!recommendedWater) {

            try {

                const savedWater =
                    JSON.parse(
                        localStorage.getItem(
                            "nutriTrackWaterDetails"
                        ) || "{}"
                    );


                recommendedWater =
                    Number(
                        savedWater.recommendedWater ||
                        savedWater.recommended_water_ml ||
                        0
                    );

            } catch (error) {

                console.warn(
                    "Unable to read saved water data."
                );

            }

        }


        if (waterValue) {

            waterValue.textContent =
                waterCompleted
                    ? recommendedWater + " ml"
                    : "0 ml";

        }


        if (waterTarget) {

            waterTarget.textContent =
                "/ " +
                (
                    recommendedWater ||
                    0
                ) +
                " ml";

        }


        const waterMessage =
            document.getElementById(
                "dashboardWaterMessage"
            );


        if (waterMessage) {

            waterMessage.textContent =
                waterCompleted
                    ? "Water intake completed today."
                    : "No water intake recorded today.";

        }


        setProgress(
            [
                "#dashboardWaterProgress",
                ".water-progress"
            ],
            waterCompleted ? 100 : 0
        );


        // --------------------------------------
        // SLEEP
        // --------------------------------------

        const sleepCompleted =
            todayRecords.some(
                function (record) {

                    return (
                        String(
                            record.completion_type ||
                            record.type ||
                            record.progress_type ||
                            ""
                        ).toLowerCase() === "sleep"
                    );

                }
            );


        const sleepValue =
            document.getElementById(
                "dashboardSleepValue"
            );


        const sleepTarget =
            document.getElementById(
                "dashboardSleepTarget"
            );


        let recommendedSleep = 0;


        recommendedSleep =
            Number(
                plans.sleep_schedule?.recommended_duration ||
                plans.recommended_sleep_duration ||
                0
            );


        if (!recommendedSleep) {

            recommendedSleep = 8;

        }


        if (sleepValue) {

            sleepValue.textContent =
                sleepCompleted
                    ? recommendedSleep
                    : 0;

        }


        if (sleepTarget) {

            sleepTarget.textContent =
                "/ " +
                recommendedSleep +
                " hrs";

        }


        const sleepMessage =
            document.getElementById(
                "dashboardSleepMessage"
            );


        if (sleepMessage) {

            sleepMessage.textContent =
                sleepCompleted
                    ? "Sleep record completed today."
                    : "No sleep record for today.";

        }


        setProgress(
            [
                "#dashboardSleepProgress",
                ".sleep-progress"
            ],
            sleepCompleted ? 100 : 0
        );


        console.log(
            "Today's Progress:",
            {
                mealCompleted,
                exerciseCompleted,
                waterCompleted,
                sleepCompleted
            }
        );


    } catch (error) {

        console.error(
            "Today's progress error:",
            error
        );

    }

}

// ==========================================
// GET LOCAL DATE KEY
// ==========================================

function getLocalDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}

    //==========================================
    // UPDATE TODAYS DATE
    //==========================================
    function updateTodayDate() {

        const todayDate =
            document.getElementById(
                "todayDate"
            );


        if (!todayDate) {
            return;
        }


        const today =
            new Date();


        todayDate.textContent =
            today.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );

    }

    // ==========================================
    // SET PROGRESS BAR
    // ==========================================

    function setProgress(selectors, value) {

        let progressBar = null;


        for (let selector of selectors) {

            progressBar =
                document.querySelector(selector);


            if (progressBar) {
                break;
            }

        }


        if (!progressBar) {
            return;
        }


        let percentage =
            Number(value) || 0;


        percentage =
            Math.max(
                0,
                Math.min(
                    100,
                    percentage
                )
            );


        progressBar.style.width =
            "0%";


        setTimeout(function () {

            progressBar.style.width =
                percentage + "%";

        }, 300);

    }


// ==========================================
// PROGRESS ANALYTICS
// ==========================================

let analyticsRecords = [];

let currentAnalyticsPeriod = "weekly";

let analyticsTabsInitialized = false;


// ==========================================
// SETUP ANALYTICS TABS
// ==========================================

function setupProgressAnalytics() {

    const analyticsTabs =
        document.querySelectorAll(
            ".analytics-tab"
        );


    if (!analyticsTabs.length) {

        return;

    }


    // Prevent duplicate event listeners

    if (analyticsTabsInitialized) {

        return;

    }


    analyticsTabsInitialized = true;


    analyticsTabs.forEach(function (tab) {

        tab.addEventListener(
            "click",
            async function () {

                // ----------------------------------
                // REMOVE ACTIVE FROM ALL TABS
                // ----------------------------------

                analyticsTabs.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                // ----------------------------------
                // MAKE SELECTED TAB ACTIVE
                // ----------------------------------

                tab.classList.add(
                    "active"
                );


                currentAnalyticsPeriod =
                    tab.getAttribute(
                        "data-period"
                    ) || "weekly";


                // ----------------------------------
                // LOAD FRESH DATA
                // ----------------------------------

                await loadProgressAnalytics();


            }
        );

    });

}


// ==========================================
// LOAD REAL PROGRESS DATA
// ==========================================

async function loadProgressAnalytics() {

    const chart =
        document.getElementById(
            "analyticsChart"
        );


    if (!chart) {

        return;

    }


    // --------------------------------------
    // SHOW LOADING
    // --------------------------------------

    chart.innerHTML = `
        <div class="analytics-loading">
            <span></span>
            <span></span>
            <span></span>
            <p>Loading your progress...</p>
        </div>
    `;


    try {

        const response =
            await fetch(
                "/api/progress",
                {
                    method: "GET",

                    credentials: "same-origin",

                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


        // --------------------------------------
        // LOGIN REQUIRED
        // --------------------------------------

        if (response.status === 401) {

            window.location.href =
                "/login";

            return;

        }


        const data =
            await response.json()
                .catch(function () {

                    return {};

                });


        // --------------------------------------
        // ERROR
        // --------------------------------------

        if (
            !response.ok ||
            data.success === false
        ) {

            console.error(
                "Progress analytics error:",
                data.message
            );


            analyticsRecords = [];


            renderProgressAnalytics(
                currentAnalyticsPeriod
            );


            return;

        }


        // --------------------------------------
        // GET REAL USER RECORDS
        // --------------------------------------

        analyticsRecords =
            data.progress ||
            data.records ||
            data.history ||
            data.data ||
            [];


        // --------------------------------------
        // MAKE SURE IT IS AN ARRAY
        // --------------------------------------

        if (
            !Array.isArray(
                analyticsRecords
            )
        ) {

            analyticsRecords = [];

        }


        console.log(
            "Progress analytics records:",
            analyticsRecords
        );


        // --------------------------------------
        // RENDER BAR CHART
        // --------------------------------------

        renderProgressAnalytics(
            currentAnalyticsPeriod
        );


    } catch (error) {

        console.error(
            "Unable to load progress analytics:",
            error
        );


        analyticsRecords = [];


        renderProgressAnalytics(
            currentAnalyticsPeriod
        );

    }

}


// ==========================================
// UPDATE PROGRESS ANALYTICS
// ==========================================

function updateProgressAnalytics(data) {

    /*
     * The dashboard loads the main user data first.
     * Then we separately load the real progress
     * records from /api/progress.
     */


    setupProgressAnalytics();


    loadProgressAnalytics();

}


// ==========================================
// RENDER PROGRESS ANALYTICS
// ==========================================

function renderProgressAnalytics(period) {

    const chart =
        document.getElementById(
            "analyticsChart"
        );


    if (!chart) {

        return;

    }


    // --------------------------------------
    // CLEAR OLD CHART
    // --------------------------------------

    chart.innerHTML = "";


    let chartData = [];


    // --------------------------------------
    // SELECT PERIOD
    // --------------------------------------

    if (period === "weekly") {

        chartData =
            createWeeklyAnalytics();

    }


    else if (period === "monthly") {

        chartData =
            createMonthlyAnalytics();

    }


    else if (period === "yearly") {

        chartData =
            createYearlyAnalytics();

    }


    // --------------------------------------
    // EMPTY CHECK
    // --------------------------------------

    if (!chartData.length) {

        showEmptyAnalyticsMessage(
            chart
        );

        return;

    }


    // --------------------------------------
    // FIND HIGHEST VALUE
    // --------------------------------------

    const maxValue =
        Math.max(
            ...chartData.map(
                function (item) {

                    return item.value;

                }
            ),
            1
        );


    // --------------------------------------
    // CREATE CHART
    // --------------------------------------

    chartData.forEach(
        function (item, index) {

            // ------------------------------
            // BAR ITEM
            // ------------------------------

            const barItem =
                document.createElement(
                    "div"
                );


            barItem.className =
                "analytics-bar-item";


            // ------------------------------
            // VALUE
            // ------------------------------

            const value =
                document.createElement(
                    "span"
                );


            value.className =
                "analytics-bar-value";


            value.textContent =
                item.value;


            // ------------------------------
            // BAR AREA
            // ------------------------------

            const barArea =
                document.createElement(
                    "div"
                );


            barArea.className =
                "analytics-bar-area";


            // ------------------------------
            // BAR
            // ------------------------------

            const bar =
                document.createElement(
                    "div"
                );


            bar.className =
                "analytics-bar";


            // ------------------------------
            // BAR HEIGHT
            // ------------------------------

            let barHeight = 0;


            if (item.value > 0) {

                barHeight =
                    (
                        item.value /
                        maxValue
                    ) * 100;


                // Keep small values visible

                barHeight =
                    Math.max(
                        8,
                        barHeight
                    );

            }


            // Start from bottom

            bar.style.height =
                "0%";


            bar.style.setProperty(
                "--bar-height",
                barHeight + "%"
            );


            // ------------------------------
            // BAR TITLE
            // ------------------------------

            bar.title =
                item.value +
                (
                    item.value === 1
                        ? " completed activity"
                        : " completed activities"
                );


            // ------------------------------
            // LABEL
            // ------------------------------

            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "analytics-bar-label";


            label.textContent =
                item.label;


            // ------------------------------
            // ADD ELEMENTS
            // ------------------------------

            barArea.appendChild(
                bar
            );


            barItem.appendChild(
                value
            );


            barItem.appendChild(
                barArea
            );


            barItem.appendChild(
                label
            );


            chart.appendChild(
                barItem
            );


            // ------------------------------
            // ANIMATE BAR
            // ------------------------------

            setTimeout(
                function () {

                    bar.style.height =
                        barHeight + "%";

                },
                80 + (index * 35)
            );

        }
    );

}


// ==========================================
// WEEKLY ANALYTICS
// ==========================================

function createWeeklyAnalytics() {

    const today =
        new Date();


    const result = [];


    // Last 7 days

    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date(
                today
            );


        date.setDate(
            today.getDate() - i
        );


        const dateKey =
            getDateKey(
                date
            );


        const value =
            countCompletedRecordsForDate(
                dateKey
            );


        result.push({

            label:
                date.toLocaleDateString(
                    "en-IN",
                    {
                        weekday: "short"
                    }
                ),

            value:
                value,

            date:
                dateKey

        });

    }


    return result;

}


// ==========================================
// MONTHLY ANALYTICS
// ==========================================

function createMonthlyAnalytics() {

    const today =
        new Date();


    const result = [];


    // Last 30 days

    for (
        let i = 29;
        i >= 0;
        i--
    ) {

        const date =
            new Date(
                today
            );


        date.setDate(
            today.getDate() - i
        );


        const dateKey =
            getDateKey(
                date
            );


        const value =
            countCompletedRecordsForDate(
                dateKey
            );


        result.push({

            label:
                date.getDate(),

            value:
                value,

            date:
                dateKey

        });

    }


    return result;

}


// ==========================================
// YEARLY ANALYTICS
// ==========================================

function createYearlyAnalytics() {

    const today =
        new Date();


    const currentYear =
        today.getFullYear();


    const result = [];


    for (
        let month = 0;
        month < 12;
        month++
    ) {

        const value =
            countCompletedRecordsForMonth(
                currentYear,
                month
            );


        const date =
            new Date(
                currentYear,
                month,
                1
            );


        result.push({

            label:
                date.toLocaleDateString(
                    "en-IN",
                    {
                        month: "short"
                    }
                ),

            value:
                value,

            month:
                month

        });

    }


    return result;

}


// ==========================================
// COUNT COMPLETED RECORDS FOR DATE
// ==========================================

function countCompletedRecordsForDate(
    dateKey
) {

    if (
        !Array.isArray(
            analyticsRecords
        )
    ) {

        return 0;

    }


    return analyticsRecords.filter(
        function (record) {

            if (!record) {

                return false;

            }


            // Only completed records

            const status =
                String(
                    record.status ||
                    ""
                ).toLowerCase();


            if (
                status !== "completed"
            ) {

                return false;

            }


            const recordDate =
                getRecordDate(
                    record
                );


            return (
                recordDate ===
                dateKey
            );

        }
    ).length;

}


// ==========================================
// COUNT COMPLETED RECORDS FOR MONTH
// ==========================================

function countCompletedRecordsForMonth(
    year,
    month
) {

    if (
        !Array.isArray(
            analyticsRecords
        )
    ) {

        return 0;

    }


    return analyticsRecords.filter(
        function (record) {

            if (!record) {

                return false;

            }


            const status =
                String(
                    record.status ||
                    ""
                ).toLowerCase();


            if (
                status !== "completed"
            ) {

                return false;

            }


            const recordDate =
                getRecordDateObject(
                    record
                );


            if (!recordDate) {

                return false;

            }


            return (
                recordDate.getFullYear() ===
                    year &&
                recordDate.getMonth() ===
                    month
            );

        }
    ).length;

}


// ==========================================
// GET RECORD DATE
// ==========================================

function getRecordDate(
    record
) {

    const date =
        getRecordDateObject(
            record
        );


    if (!date) {

        return null;

    }


    return getDateKey(
        date
    );

}


// ==========================================
// GET RECORD DATE OBJECT
// ==========================================

function getRecordDateObject(
    record
) {

    if (!record) {

        return null;

    }


    // --------------------------------------
    // COMPLETION DATE
    // --------------------------------------

    if (
        record.completion_date
    ) {

        const completionDate =
            new Date(
                String(
                    record.completion_date
                ) +
                "T00:00:00"
            );


        if (
            !Number.isNaN(
                completionDate.getTime()
            )
        ) {

            return completionDate;

        }

    }


    // --------------------------------------
    // OTHER DATE FIELDS
    // --------------------------------------

    const possibleDate =
        record.created_at ||
        record.completed_at ||
        record.date ||
        record.createdAt ||
        record.timestamp;


    if (!possibleDate) {

        return null;

    }


    const date =
        new Date(
            possibleDate
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    return date;

}


// ==========================================
// DATE KEY
// ==========================================

function getDateKey(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// ==========================================
// EMPTY ANALYTICS MESSAGE
// ==========================================

function showEmptyAnalyticsMessage(
    chart
) {

    chart.innerHTML = `
        <div class="analytics-empty">
            <div class="analytics-empty-icon">
                📊
            </div>

            <strong>
                No progress records yet
            </strong>

            <span>
                Complete your daily activities
                to see your progress here.
            </span>
        </div>
    `;

}


    // ==========================================
    // MOBILE SIDEBAR
    // ==========================================

    function setupMobileSidebar() {

        const menuButton =
        document.getElementById(
            "mobileMenuButton"
        );


        const sidebar =
            document.querySelector(
                ".sidebar"
            );


        if (!menuButton || !sidebar) {
            return;
        }


        menuButton.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "open"
                );

            }
        );


        // Close sidebar when clicking a link
        const sidebarLinks =
            sidebar.querySelectorAll(
                "a"
            );


        sidebarLinks.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    sidebar.classList.remove(
                        "active"
                    );

                }
            );

        });

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    function setupLogout() {

        const logoutLinks =
        document.querySelectorAll(
            ".logout-link, #logoutBtn, #logoutButton, [data-action='logout']"
        );


        logoutLinks.forEach(function (logoutLink) {

            logoutLink.addEventListener(
                "click",
                async function (event) {

                    event.preventDefault();


                    try {

                        await fetch(
                            "/api/logout",
                            {
                                method: "POST"
                            }
                        );

                    } catch (error) {

                        console.error(
                            "Logout error:",
                            error
                        );

                    }


                    // Clear temporary frontend data
                    localStorage.removeItem(
                        "nutriTrackUser"
                    );

                    localStorage.removeItem(
                        "nutriTrackQuestionnaire"
                    );

                    localStorage.removeItem(
                        "questionnaireCompleted"
                    );


                    // Go to home page
                    window.location.href = "/";

                }
            );

        });

    }


    // ==========================================
    // LOCAL STORAGE FALLBACK
    // ==========================================

    function loadLocalStorageFallback() {

        try {

            const savedUser =
                localStorage.getItem(
                    "nutriTrackUser"
                );


            const savedQuestionnaire =
                localStorage.getItem(
                    "nutriTrackQuestionnaire"
                );


            const user =
                savedUser
                    ? JSON.parse(savedUser)
                    : {};


            const questionnaire =
                savedQuestionnaire
                    ? JSON.parse(savedQuestionnaire)
                    : {};


            // --------------------------------------
            // USER
            // --------------------------------------

            const userName =
                document.getElementById(
                    "welcomeUserName"
                );


            const userNameHeader =
                document.getElementById(
                    "userNameHeader"
                );


            if (userName) {

                userName.textContent =
                    user.name ||
                    user.username ||
                    "User";

            }


            if (userNameHeader) {

                userNameHeader.textContent =
                    user.name ||
                    user.username ||
                    "User";

            }


            // --------------------------------------
            // WEIGHT
            // --------------------------------------

            const userWeight =
                document.getElementById(
                    "userWeight"
                );


            if (
                userWeight &&
                questionnaire.weight
            ) {

                userWeight.textContent =
                    questionnaire.weight +
                    " kg";

            }


            // --------------------------------------
            // AGE
            // --------------------------------------

            const userAge =
                document.getElementById(
                    "userAge"
                );


            if (
                userAge &&
                questionnaire.age
            ) {

                userAge.textContent =
                    questionnaire.age;

            }


            // --------------------------------------
            // HEIGHT
            // --------------------------------------

            const userHeight =
                document.getElementById(
                    "userHeight"
                );


            if (
                userHeight &&
                questionnaire.height
            ) {

                userHeight.textContent =
                    questionnaire.height +
                    " cm";

            }


            // --------------------------------------
            // GOAL
            // --------------------------------------

            const goals =
                questionnaire.fitnessGoals ||
                [];


            const goalElement =
                document.getElementById(
                    "mainGoal"
                );


            if (
                goalElement &&
                goals.length
            ) {

                goalElement.textContent =
                    goals[0];

            }


        } catch (error) {

            console.error(
                "Local storage error:",
                error
            );

        }

    }


    // ==========================================
    // HISTORY NAVIGATION
    // ==========================================

    const historyLinks =
        document.querySelectorAll(
            "a[href='/history']"
        );


    historyLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                window.location.href =
                    "/history";

            }
        );

    });
    
/* =====================================================
   NUTRITRACK - WEEKLY WEIGHT GOAL TRACKER
===================================================== */

function updateWeeklyGoalTracker(data) {
    const statusElement = document.getElementById("weeklyGoalStatus");
    const titleElement = document.getElementById("weeklyGoalTitle");
    const messageElement = document.getElementById("weeklyGoalMessage");
    const emptyElement = document.getElementById("weeklyGoalEmpty");
    const detailsElement = document.getElementById("weeklyGoalDetails");

    const totalWeeksElement = document.getElementById("weeklyTotalWeeks");
    const passedWeeksElement = document.getElementById("weeklyWeeksPassed");
    const remainingWeeksElement = document.getElementById("weeklyWeeksRemaining");
    const percentageElement = document.getElementById("weeklyGoalPercentage");

    const progressTrack = document.getElementById("weeklyGoalProgressTrack");
    const progressFill = document.getElementById("weeklyGoalProgressFill");
    const recordDateElement = document.getElementById("weeklyGoalRecordDate");

    // Stop safely if the tracker is not present in the HTML.
    if (
        !statusElement ||
        !titleElement ||
        !messageElement ||
        !emptyElement ||
        !detailsElement
    ) {
        return;
    }

    const user = data.user || data;
    const questionnaire =
        data.questionnaire ||
        user.questionnaire ||
        data.survey_responses ||
        {};

    const savedGoal = data.weight_goal || user.weight_goal || {};

    // Find the current and target weights.
    const currentWeightValue =
        questionnaire.weight ??
        questionnaire.current_weight ??
        questionnaire.currentWeight ??
        questionnaire.weight_kg ??
        questionnaire.weightKg ??
        user.weight ??
        user.current_weight ??
        user.currentWeight ??
        user.weight_kg ??
        user.weightKg;

    const targetWeightValue =
        questionnaire.target_weight ??
        questionnaire.targetWeight ??
        user.target_weight ??
        user.targetWeight;

    const currentWeight = Number(currentWeightValue);
    const targetWeight = Number(targetWeightValue);

    function showEmptyState(message, title = "Weekly Goal Tracker") {
        titleElement.textContent = title;
        messageElement.textContent = message;

        emptyElement.hidden = false;
        detailsElement.hidden = true;

        statusElement.textContent = "Setup needed";
        statusElement.setAttribute("aria-label", "Weekly goal setup needed");
    }

    // Check whether the weights are available and valid.
    if (
        currentWeightValue === undefined ||
        currentWeightValue === null ||
        currentWeightValue === "" ||
        targetWeightValue === undefined ||
        targetWeightValue === null ||
        targetWeightValue === "" ||
        !Number.isFinite(currentWeight) ||
        !Number.isFinite(targetWeight) ||
        currentWeight <= 0 ||
        targetWeight <= 0
    ) {
        showEmptyState(
            "Add your current weight and target weight in your fitness profile to view your estimated timeline."
        );
        return;
    }

    // The user has already reached the target weight.
    if (currentWeight === targetWeight) {
        titleElement.textContent = "Weight Goal Reached!";
        messageElement.textContent =
            "Your current weight matches your target weight.";

        emptyElement.hidden = true;
        detailsElement.hidden = false;

        if (totalWeeksElement) totalWeeksElement.textContent = "0";
        if (passedWeeksElement) passedWeeksElement.textContent = "—";
        if (remainingWeeksElement) remainingWeeksElement.textContent = "0";
        if (percentageElement) percentageElement.textContent = "100%";

        if (progressFill) progressFill.style.width = "100%";

        if (progressTrack) {
            progressTrack.setAttribute("aria-valuenow", "100");
        }

        statusElement.textContent = "Goal reached";

        if (recordDateElement) {
            recordDateElement.textContent =
                savedGoal.start_date || "Not recorded";
        }

        return;
    }

    // Validate the saved goal information.
    const startDateString = savedGoal.start_date;
    const savedStartWeight = Number(savedGoal.start_weight);
    const savedTargetWeight = Number(savedGoal.target_weight);

    if (
        !startDateString ||
        !Number.isFinite(savedStartWeight) ||
        !Number.isFinite(savedTargetWeight) ||
        savedStartWeight <= 0 ||
        savedTargetWeight <= 0
    ) {
        showEmptyState(
            "Your weight goal timeline has not been initialized yet. Refresh the dashboard after saving your current and target weights."
        );
        return;
    }

    // Validate the saved start date.
    const startDate = new Date(startDateString + "T00:00:00Z");

    if (Number.isNaN(startDate.getTime())) {
        showEmptyState(
            "The saved goal start date is invalid. Please check your saved weight-goal information."
        );
        return;
    }

    // Use UTC dates so daylight-saving changes cannot affect calculations.
    const today = new Date();
    const todayUTC = Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const startUTC = Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate()
    );

    if (startUTC > todayUTC) {
        showEmptyState(
            "Your goal start date is in the future. Please check your saved goal information."
        );
        return;
    }

    // If the saved goal weights no longer match the questionnaire,
    // do not silently reset the user's timeline.
    if (
        Math.abs(savedStartWeight - currentWeight) > 0.001 ||
        Math.abs(savedTargetWeight - targetWeight) > 0.001
    ) {
        showEmptyState(
            "Your weight goal has changed. Please confirm your new goal before starting a new timeline."
        );
        return;
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysPassed = Math.floor(
        (todayUTC - startUTC) / millisecondsPerDay
    );

    const weeksPassed = Math.floor(daysPassed / 7);

    // Use the saved estimate from the backend.
    // Fall back to the same illustrative calculation if needed.
    const savedTotalWeeks = Number(savedGoal.estimated_total_weeks);

    const totalWeeks =
        Number.isFinite(savedTotalWeeks) && savedTotalWeeks > 0
            ? savedTotalWeeks
            : Math.ceil(Math.abs(currentWeight - targetWeight) / 0.5);

    const weeksRemaining = Math.max(totalWeeks - weeksPassed, 0);

    // This bar shows elapsed time in the estimated timeline,
    // not measured weight loss.
    const percentage = Math.min(
        Math.round((weeksPassed / totalWeeks) * 100),
        100
    );

    // Update the tracker.
    titleElement.textContent = "Your Weight Goal Timeline";

    messageElement.textContent =
        `Your estimated timeline is ${totalWeeks} weeks. ` +
        `This is a planning estimate, not a guarantee of weight change.`;

    emptyElement.hidden = true;
    detailsElement.hidden = false;

    if (totalWeeksElement) {
        totalWeeksElement.textContent = totalWeeks;
    }

    if (passedWeeksElement) {
        passedWeeksElement.textContent = weeksPassed;
    }

    if (remainingWeeksElement) {
        remainingWeeksElement.textContent = weeksRemaining;
    }

    if (percentageElement) {
        percentageElement.textContent = percentage + "%";
    }

    if (progressFill) {
        progressFill.style.width = percentage + "%";
    }

    if (progressTrack) {
        progressTrack.setAttribute("aria-valuenow", String(percentage));
        progressTrack.setAttribute(
            "aria-valuetext",
            `${percentage}% of estimated timeline elapsed`
        );
    }

    if (recordDateElement) {
        recordDateElement.textContent = startDateString;
    }

    if (weeksRemaining === 0) {
        statusElement.textContent = "Estimated timeline complete";
        messageElement.textContent =
            "Your estimated timeline has ended. Review your current weight and update your goal if needed.";
    } else {
        statusElement.textContent = "In progress";
    }
}
