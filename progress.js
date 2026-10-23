// ==========================================
// NUTRITRACK - PROGRESS
// Matches current progress.html
// ==========================================


// ==========================================
// GLOBAL DATA
// ==========================================

let progressRecords = [];

const dailyProgressData = {

    meals: 0,

    exercise: 0,

    water: 0,

    sleep: 0

};


let weeklyProgressData = [

    {
        day: "Monday",
        shortDay: "Mon",
        progress: 0,
        exerciseCompleted: false
    },

    {
        day: "Tuesday",
        shortDay: "Tue",
        progress: 0,
        exerciseCompleted: false
    },

    {
        day: "Wednesday",
        shortDay: "Wed",
        progress: 0,
        exerciseCompleted: false
    },

    {
        day: "Thursday",
        shortDay: "Thu",
        progress: 0,
        exerciseCompleted: false
    },

    {
        day: "Friday",
        shortDay: "Fri",
        progress: 0,
        exerciseCompleted: false
    },

    {
        day: "Saturday",
        shortDay: "Sat",
        progress: 0,
        exerciseCompleted: false
    },

    {
        day: "Sunday",
        shortDay: "Sun",
        progress: 0,
        exerciseCompleted: false
    }

];


// ==========================================
// DOM READY
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setTodayDate();

        loadProgress();

    }
);


// ==========================================
// GET ELEMENT
// ==========================================

function getElement(id) {

    return document.getElementById(id);

}


// ==========================================
// LIMIT PERCENTAGE
// ==========================================

function limitPercentage(value) {

    value = Number(value) || 0;

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(value)
        )
    );

}


// ==========================================
// CALCULATE PERCENTAGE
// ==========================================

function calculatePercentage(
    completed,
    target
) {

    completed = Number(completed) || 0;

    target = Number(target) || 0;


    if (target <= 0) {

        return 0;

    }


    return limitPercentage(
        (completed / target) * 100
    );

}


// ==========================================
// TODAY'S DATE
// ==========================================

function setTodayDate() {

    const todayDate =
        getElement("todayDate");


    if (!todayDate) {

        return;

    }


    const today =
        new Date();


    const formattedDate =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    todayDate.textContent =
        formattedDate;

}


// ==========================================
// UPDATE DAILY PROGRESS
// ==========================================

function updateDailyProgress() {

    // --------------------------------------
    // MEALS
    // --------------------------------------

    const mealProgress =
        getElement("mealProgress");

    const mealPercent =
        getElement("mealPercent");

    const mealText =
        getElement("mealText");


    if (mealProgress) {

        mealProgress.style.width =
            dailyProgressData.meals + "%";

    }


    if (mealPercent) {

        mealPercent.textContent =
            dailyProgressData.meals + "%";

    }


    if (mealText) {

        const completedMeals =
            Math.round(
                (
                    dailyProgressData.meals /
                    100
                ) * 4
            );


        mealText.textContent =
            completedMeals +
            " of 4 meals completed";

    }


    // --------------------------------------
    // EXERCISE
    // --------------------------------------

    const exerciseProgress =
        getElement("exerciseProgress");

    const exercisePercent =
        getElement("exercisePercent");

    const exerciseText =
        getElement("exerciseText");


    if (exerciseProgress) {

        exerciseProgress.style.width =
            dailyProgressData.exercise + "%";

    }


    if (exercisePercent) {

        exercisePercent.textContent =
            dailyProgressData.exercise + "%";

    }


    if (exerciseText) {

        const completedMinutes =
            Math.round(
                (
                    dailyProgressData.exercise /
                    100
                ) * 50
            );


        exerciseText.textContent =
            completedMinutes +
            " of 50 minutes completed";

    }


    // --------------------------------------
    // WATER
    // --------------------------------------

    const waterProgress =
        getElement("waterProgress");

    const waterPercent =
        getElement("waterPercent");

    const waterText =
        getElement("waterText");


    if (waterProgress) {

        waterProgress.style.width =
            dailyProgressData.water + "%";

    }


    if (waterPercent) {

        waterPercent.textContent =
            dailyProgressData.water + "%";

    }


    if (waterText) {

        const waterAmount =
            Math.round(
                (
                    dailyProgressData.water /
                    100
                ) * 2000
            );


        waterText.textContent =
            waterAmount +
            " ml of 2000 ml";

    }


    // --------------------------------------
    // SLEEP
    // --------------------------------------

    const sleepProgress =
        getElement("sleepProgress");

    const sleepPercent =
        getElement("sleepPercent");

    const sleepText =
        getElement("sleepText");


    if (sleepProgress) {

        sleepProgress.style.width =
            dailyProgressData.sleep + "%";

    }


    if (sleepPercent) {

        sleepPercent.textContent =
            dailyProgressData.sleep + "%";

    }


    if (sleepText) {

        const sleepHours =
            (
                dailyProgressData.sleep /
                100
            ) * 8;


        sleepText.textContent =
            sleepHours.toFixed(1) +
            " of 8 hours";

    }


    // --------------------------------------
    // OVERALL DAILY SCORE
    // --------------------------------------

    const overall =
        Math.round(
            (
                dailyProgressData.meals +
                dailyProgressData.exercise +
                dailyProgressData.water +
                dailyProgressData.sleep 
            ) / 4
        );


    const dailyOverall =
        getElement("dailyOverall");


    if (dailyOverall) {

        dailyOverall.textContent =
            overall + "%";

    }


    // --------------------------------------
    // DAILY MESSAGE
    // --------------------------------------

    const dailyMessage =
        getElement("dailyMessage");


    if (dailyMessage) {

        if (overall >= 90) {

            dailyMessage.textContent =
                "Excellent work! You are doing a great job maintaining your healthy habits today.";

        } else if (overall >= 70) {

            dailyMessage.textContent =
                "You're doing a great job today. A few more healthy choices can make your day even better.";

        } else if (overall >= 40) {

            dailyMessage.textContent =
                "You're making progress. Keep going and try to complete a few more healthy activities today.";

        } else {

            dailyMessage.textContent =
                "Every healthy choice counts. Start with one small goal and keep building your routine.";

        }

    }


    // --------------------------------------
    // ANIMATE DAILY BARS
    // --------------------------------------

    animateProgressBars();

}


// ==========================================
// UPDATE WEEKLY PROGRESS
// ==========================================

function updateWeeklyProgress() {

    const weeklyDays =
        document.querySelectorAll(
            ".weekly-day"
        );


    // --------------------------------------
    // UPDATE EACH DAY
    // --------------------------------------

    weeklyDays.forEach(
        function (dayElement, index) {

            if (
                !weeklyProgressData[index]
            ) {

                return;

            }


            const progress =
                weeklyProgressData[index].progress;


            const weeklyFill =
                dayElement.querySelector(
                    ".weekly-fill"
                );


            const dayPercent =
                dayElement.querySelector(
                    ".day-percent"
                );


            if (weeklyFill) {

                weeklyFill.style.width =
                    progress + "%";

            }


            if (dayPercent) {

                dayPercent.textContent =
                    progress + "%";

            }

        }
    );


    // --------------------------------------
    // WEEKLY AVERAGE
    // --------------------------------------

    const weeklyAverage =
        calculateWeeklyAverage();


    const weeklyOverall =
        getElement("weeklyOverall");


    if (weeklyOverall) {

        weeklyOverall.textContent =
            weeklyAverage + "%";

    }


    // --------------------------------------
    // WEEKLY SUMMARY
    // --------------------------------------

    const weeklyWorkout =
        getElement("weeklyWorkout");

    const weeklyWater =
        getElement("weeklyWater");

    const weeklySleep =
        getElement("weeklySleep");

    const weeklyMeals =
        getElement("weeklyMeals");


    if (weeklyWorkout) {

        const workoutDays =
            weeklyProgressData.filter(
                function (day) {

                    return day.exerciseCompleted === true;

                }
            ).length;


        weeklyWorkout.textContent =
            workoutDays;

    }


    if (weeklyWater) {

        weeklyWater.textContent =
            calculateWeeklyCategory(
                "water"
            ) + "%";

    }


    if (weeklySleep) {

        weeklySleep.textContent =
            calculateWeeklyCategory(
                "sleep"
            ) + "%";

    }


    if (weeklyMeals) {

        weeklyMeals.textContent =
            calculateWeeklyCategory(
                "meals"
            ) + "%";

    }


    animateWeeklyBars();

}


// ==========================================
// WEEKLY AVERAGE
// ==========================================

function calculateWeeklyAverage() {

    if (
        weeklyProgressData.length === 0
    ) {

        return 0;

    }


    const total =
        weeklyProgressData.reduce(
            function (
                sum,
                day
            ) {

                return sum +
                    Number(
                        day.progress || 0
                    );

            },
            0
        );


    return Math.round(
        total /
        weeklyProgressData.length
    );

}


// ==========================================
// WEEKLY CATEGORY
// ==========================================

function calculateWeeklyCategory(
    category
) {

    let total = 0;

    let count = 0;


    progressRecords.forEach(
        function (record) {

            const type =
                (
                    record.type ||
                    record.category ||
                    record.progress_type ||
                    ""
                ).toLowerCase();


            if (
                type.includes(category)
            ) {

                const percentage =
                    limitPercentage(
                        record.percentage ||
                        record.progress ||
                        0
                    );


                total +=
                    percentage;

                count++;

            }

        }
    );


    if (count === 0) {

        return 0;

    }


    return Math.round(
        total / count
    );

}


// ==========================================
// LOAD PROGRESS
// ==========================================

async function loadProgress() {

    const loaded =
        await loadProgressFromAPI();


    if (!loaded) {

        loadProgressFromLocalStorage();

    }


    updateDailyProgress();

    updateWeeklyProgress();

}


// ==========================================
// LOAD FROM FLASK API
// ==========================================

async function loadProgressFromAPI() {

    try {

        const response =
            await fetch(
                "/api/progress",
                {
                    method: "GET",
                    credentials:
                        "same-origin"
                }
            );


        // ----------------------------------
        // LOGIN REQUIRED
        // ----------------------------------

        if (
            response.status === 401
        ) {

            window.location.href =
                "/login";

            return false;

        }


        const data =
            await response.json()
                .catch(
                    function () {
                        return {};
                    }
                );


        if (
            response.ok &&
            data.success
        ) {

            progressRecords =
                data.progress || [];


            processProgressRecords();


            return true;

        }


        console.warn(
            "Unable to load progress:",
            data.message ||
            "Unknown error"
        );


    } catch (error) {

        console.warn(
            "Progress API unavailable:",
            error
        );

    }


    return false;

}


// ==========================================
// PROCESS DATABASE RECORDS
// ==========================================

function processProgressRecords() {

    // Reset first
    dailyProgressData.meals = 0;
    dailyProgressData.exercise = 0;
    dailyProgressData.water = 0;
    dailyProgressData.sleep = 0;
    
    // --------------------------------------
    // TODAY
    // --------------------------------------

    const today =
        new Date();


    const todayString =
        today.toISOString()
            .split("T")[0];


    const todayRecords =
        progressRecords.filter(
            function (record) {

                if (!record.created_at) {

                    return false;

                }


                return record.created_at
                    .toString()
                    .startsWith(
                        todayString
                    );

            }
        );


    // --------------------------------------
    // PROCESS TODAY'S RECORDS
    // --------------------------------------

    todayRecords.forEach(
        function (record) {

            const type =
                (
                    record.type ||
                    record.category ||
                    record.progress_type ||
                    ""
                ).toLowerCase();


            let percentage =
                record.percentage;


           // ----------------------------------
           // Completed meal/exercise task
          // ----------------------------------

          if (
              record.status === "completed" &&
              (
                 record.completion_type === "meal" ||
                 record.completion_type === "exercise"
              )
           ) {

                percentage = 100;

            }


            // ----------------------------------
            // If percentage isn't stored,
            // calculate from values.
            // ----------------------------------

            if (
                percentage === undefined &&
                record.progress !== undefined
            ) {

                percentage =
                    record.progress;

            }


            percentage =
                limitPercentage(
                    percentage
                );


            if (
                type.includes("meal") ||
                type.includes("food")
            ) {

                dailyProgressData.meals =
                    Math.max(
                        dailyProgressData.meals,
                        percentage
                    );

            }


            if (
                type.includes("exercise") ||
                type.includes("workout")
            ) {

                dailyProgressData.exercise =
                    Math.max(
                        dailyProgressData.exercise,
                        percentage
                    );

            }


            if (
                type.includes("water") ||
                type.includes("hydration")
            ) {

                dailyProgressData.water =
                    Math.max(
                        dailyProgressData.water,
                        percentage
                    );

            }


            if (
                type.includes("sleep")
            ) {

                dailyProgressData.sleep =
                    Math.max(
                        dailyProgressData.sleep,
                        percentage
                    );

            }

        }
    );


    // --------------------------------------
    // BUILD WEEKLY DATA
    // --------------------------------------

    processWeeklyRecords();

}


// ==========================================
// PROCESS WEEKLY RECORDS
// ==========================================

function processWeeklyRecords() {

    weeklyProgressData = [
        { day: "Monday", shortDay: "Mon", progress: 0 },
        { day: "Tuesday", shortDay: "Tue", progress: 0 },
        { day: "Wednesday", shortDay: "Wed", progress: 0 },
        { day: "Thursday", shortDay: "Thu", progress: 0 },
        { day: "Friday", shortDay: "Fri", progress: 0 },
        { day: "Saturday", shortDay: "Sat", progress: 0 },
        { day: "Sunday", shortDay: "Sun", progress: 0 }
    ];


    const today = new Date();

    const dayOfWeek = today.getDay();

    const mondayOffset =
        dayOfWeek === 0
            ? -6
            : 1 - dayOfWeek;


    const monday = new Date(today);

    monday.setDate(
        today.getDate() + mondayOffset
    );

    monday.setHours(0, 0, 0, 0);


    /*
     * Each day has only 4 tasks:
     * 1. Meal
     * 2. Exercise
     * 3. Sleep
     * 4. Water
     */

    const completedTasksByDay = [
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set()
    ];


    progressRecords.forEach(
        function (record) {

            if (!record.created_at) {
                return;
            }


            const recordDate =
                new Date(record.created_at);

            recordDate.setHours(
                0,
                0,
                0,
                0
            );


            const difference =
                Math.floor(
                    (
                        recordDate -
                        monday
                    ) /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                );


            if (
                difference < 0 ||
                difference > 6
            ) {
                return;
            }


            const type =
                (
                    record.type ||
                    record.category ||
                    record.progress_type ||
                    record.completion_type ||
                    ""
                ).toLowerCase();


            /*
             * Only count the 4 main tasks.
             */

            if (
                type.includes("meal") ||
                type.includes("food")
            ) {

                completedTasksByDay[difference]
                    .add("meal");

            }


            if (
                type.includes("exercise") ||
                type.includes("workout")
            ) {

                completedTasksByDay[difference]
                    .add("exercise");

                weeklyProgressData[difference]
                    .exerciseCompleted = true;

            }


            if (
                type.includes("sleep")
            ) {

                completedTasksByDay[difference]
                    .add("sleep");

            }


            if (
                type.includes("water") ||
                type.includes("hydration")
            ) {

                completedTasksByDay[difference]
                    .add("water");

            }

        }
    );


    /*
     * Calculate daily percentage:
     *
     * 1 out of 4 = 25%
     * 2 out of 4 = 50%
     * 3 out of 4 = 75%
     * 4 out of 4 = 100%
     */

    completedTasksByDay.forEach(
        function (completedTasks, index) {

            const completedCount =
                completedTasks.size;


            weeklyProgressData[index].progress =
                Math.round(
                    (
                        completedCount /
                        4
                    ) * 100
                );

        }
    );

}


// ==========================================
// LOCAL STORAGE FALLBACK
// ==========================================

function loadProgressFromLocalStorage() {

    // --------------------------------------
    // WATER
    // --------------------------------------

    try {

        const savedWater =
            localStorage.getItem(
                "nutriTrackWaterDetails"
            );


        if (savedWater) {

            const waterData =
                JSON.parse(savedWater);


            if (
                waterData.waterAmount
            ) {

                dailyProgressData.water =
                    calculatePercentage(
                        waterData.waterAmount,
                        2000
                    );

            }

        }

    } catch (error) {

        console.warn(
            "Water progress could not be loaded."
        );

    }


    // --------------------------------------
    // SLEEP
    // --------------------------------------

    try {

        const savedSleep =
            localStorage.getItem(
                "nutriTrackSleepDetails"
            );


        if (savedSleep) {

            const sleepData =
                JSON.parse(savedSleep);


            if (
                sleepData.sleepDuration
            ) {

                dailyProgressData.sleep =
                    calculatePercentage(
                        sleepData.sleepDuration,
                        8
                    );

            }

        }

    } catch (error) {

        console.warn(
            "Sleep progress could not be loaded."
        );

    }


    // --------------------------------------
    // EXERCISE
    // --------------------------------------

    try {

        const savedExercise =
            localStorage.getItem(
                "nutriTrackExerciseDetails"
            );


        if (savedExercise) {

            const exerciseData =
                JSON.parse(savedExercise);


            if (
                exerciseData.focus
            ) {

                dailyProgressData.exercise =
                    60;

            }

        }

    } catch (error) {

        console.warn(
            "Exercise progress could not be loaded."
        );

    }


    // --------------------------------------
    // MEALS
    // --------------------------------------

    try {

        const savedMeal =
            localStorage.getItem(
                "nutriTrackMealDetails"
            );


        if (savedMeal) {

            dailyProgressData.meals =
                80;

        }

    } catch (error) {

        console.warn(
            "Meal progress could not be loaded."
        );

    }


    // --------------------------------------
    // CALORIES
    // --------------------------------------

    dailyProgressData.calories =
        75;


    // --------------------------------------
    // DEFAULT WEEKLY VALUES
    // --------------------------------------

    weeklyProgressData =
        [
            {
                day: "Monday",
                shortDay: "Mon",
                progress: 80
            },
            {
                day: "Tuesday",
                shortDay: "Tue",
                progress: 90
            },
            {
                day: "Wednesday",
                shortDay: "Wed",
                progress: 70
            },
            {
                day: "Thursday",
                shortDay: "Thu",
                progress: 90
            },
            {
                day: "Friday",
                shortDay: "Fri",
                progress: 80
            },
            {
                day: "Saturday",
                shortDay: "Sat",
                progress: 90
            },
            {
                day: "Sunday",
                shortDay: "Sun",
                progress: 70
            }
        ];

}


// ==========================================
// ANIMATE DAILY BARS
// ==========================================

function animateProgressBars() {

    const bars =
        document.querySelectorAll(
            ".progress-fill"
        );


    bars.forEach(
        function (bar) {

            const targetWidth =
                bar.style.width;


            if (!targetWidth) {

                return;

            }


            bar.style.width =
                "0%";


            setTimeout(
                function () {

                    bar.style.width =
                        targetWidth;

                },
                100
            );

        }
    );

}


// ==========================================
// ANIMATE WEEKLY BARS
// ==========================================

function animateWeeklyBars() {

    const bars =
        document.querySelectorAll(
            ".weekly-fill"
        );


    bars.forEach(
        function (bar) {

            const targetWidth =
                bar.style.width;


            if (!targetWidth) {

                return;

            }


            bar.style.width =
                "0%";


            setTimeout(
                function () {

                    bar.style.width =
                        targetWidth;

                },
                100
            );

        }
    );

}


// ==========================================
// DAILY / WEEKLY TABS
// ==========================================

window.showProgress =
    function (type) {

        const dailySection =
            getElement(
                "dailyProgress"
            );


        const weeklySection =
            getElement(
                "weeklyProgress"
            );


        const dailyButton =
            getElement(
                "dailyTab"
            );


        const weeklyButton =
            getElement(
                "weeklyTab"
            );


        // ----------------------------------
        // DAILY
        // ----------------------------------

        if (type === "daily") {

            if (dailySection) {

                dailySection.style.display =
                    "block";

            }


            if (weeklySection) {

                weeklySection.style.display =
                    "none";

            }


            if (dailyButton) {

                dailyButton.classList.add(
                    "active"
                );

            }


            if (weeklyButton) {

                weeklyButton.classList.remove(
                    "active"
                );

            }


            updateDailyProgress();

        }


        // ----------------------------------
        // WEEKLY
        // ----------------------------------

        else {

            if (dailySection) {

                dailySection.style.display =
                    "none";

            }


            if (weeklySection) {

                weeklySection.style.display =
                    "block";

            }


            if (dailyButton) {

                dailyButton.classList.remove(
                    "active"
                );

            }


            if (weeklyButton) {

                weeklyButton.classList.add(
                    "active"
                );

            }


            updateWeeklyProgress();

        }

    };


// ==========================================
// OPTIONAL FUNCTION
// SAVE PROGRESS RECORD
// ==========================================

async function saveProgressRecord(
    type,
    percentage,
    additionalData = {}
) {

    const progressData = {

        type:
            type,

        percentage:
            limitPercentage(
                percentage
            ),

        ...additionalData,

        created_at:
            new Date().toISOString()

    };


    try {

        const response =
            await fetch(
                "/api/progress",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials:
                        "same-origin",

                    body:
                        JSON.stringify(
                            progressData
                        )

                }
            );


        if (
            response.status === 401
        ) {

            window.location.href =
                "/login";

            return false;

        }


        const data =
            await response.json()
                .catch(
                    function () {
                        return {};
                    }
                );


        if (
            response.ok &&
            data.success
        ) {

            console.log(
                "Progress record saved successfully."
            );


            return true;

        }


        console.warn(
            "Progress save failed:",
            data.message
        );


    } catch (error) {

        console.warn(
            "Progress API unavailable:",
            error
        );

    }


    return false;

}


// ==========================================
// MAKE SAVE FUNCTION AVAILABLE
// ==========================================

window.saveProgressRecord =
    saveProgressRecord;