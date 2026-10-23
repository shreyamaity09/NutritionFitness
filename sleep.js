// ==========================================
// NUTRITRACK - SLEEP SCHEDULE
// Matches current sleep-schedule.html
// ==========================================


// ==========================================
// DOM ELEMENTS
// ==========================================

const sleepTimeInput = document.getElementById("sleepTime");
const wakeTimeInput = document.getElementById("wakeTime");

const checkSleepButton =
    document.getElementById("checkSleepBtn");

const sleepResultSection =
    document.getElementById("sleepResultSection");

const sleepResultIcon =
    document.getElementById("sleepResultIcon");

const sleepResultTitle =
    document.getElementById("sleepResultTitle");

const sleepResultMessage =
    document.getElementById("sleepResultMessage");

const sleepDurationElement =
    document.getElementById("sleepDuration");

const sleepRecommendButton =
    document.getElementById("sleepRecommendBtn");

const sleepRecommendMessage =
    document.getElementById("sleepRecommendMessage");

const recommendedSleepSection =
    document.getElementById("recommendedSleepSection");

const recommendedSleepTime =
    document.getElementById("recommendedSleepTime");

const recommendedWakeTime =
    document.getElementById("recommendedWakeTime");

const recommendedSleepDuration =
    document.getElementById("recommendedSleepDuration");

const completeSleepButton =
    document.getElementById("completeSleepButton");

const sleepCompletionMessage =
    document.getElementById("sleepCompletionMessage");

// ==========================================
// CURRENT LOGGED-IN USER
// ==========================================

let currentUserId = null;


// ==========================================
// LOAD CURRENT USER
// ==========================================

async function loadCurrentUser() {

    try {

        const response =
            await fetch(
                "/api/auth/me",
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to verify logged-in user."
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !data.user ||
            !data.user._id
        ) {

            throw new Error(
                "User ID not found."
            );

        }


        currentUserId =
            data.user._id;


        console.log(
            "Current NutriTrack user:",
            currentUserId
        );


        return currentUserId;

    } catch (error) {

        console.error(
            "Unable to load current user:",
            error
        );

        window.location.href =
            "/login";

        return null;

    }

}


// ==========================================
// USER-SPECIFIC LOCAL STORAGE KEY
// ==========================================

function getUserStorageKey(key) {

    if (!currentUserId) {

        console.error(
            "User ID is not available."
        );

        return null;

    }


    return (
        key +
        "_" +
        currentUserId
    );

}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const userId =
            await loadCurrentUser();

        if (!userId) {

            return;

        }


        loadSavedSleepSchedule();

        checkSleepCompletion();

    }
);


// ==========================================
// CHECK SLEEP BUTTON
// ==========================================

if (checkSleepButton) {

    checkSleepButton.addEventListener(
        "click",
        function () {

            checkCurrentSleep();

        }
    );

}


// ==========================================
// CHECK CURRENT SLEEP
// ==========================================

function checkCurrentSleep() {

    const sleepTime =
        sleepTimeInput
            ? sleepTimeInput.value
            : "";

    const wakeTime =
        wakeTimeInput
            ? wakeTimeInput.value
            : "";


    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    if (!sleepTime || !wakeTime) {

        alert(
            "Please enter your usual sleep time and wake-up time."
        );

        return;

    }


    // --------------------------------------
    // CALCULATE DURATION
    // --------------------------------------

    const sleepDuration =
        calculateSleepDuration(
            sleepTime,
            wakeTime
        );


    // --------------------------------------
    // EVALUATE SLEEP
    // --------------------------------------

    let resultTitle = "";
    let resultMessage = "";
    let resultIcon = "🌙";


    if (sleepDuration < 7) {

        resultTitle =
            "You may need more sleep";

        resultMessage =
            "Your current sleep duration is below the recommended range. Aim for around 7–9 hours of sleep each night.";

        resultIcon = "😴";

    } else if (sleepDuration > 9) {

        resultTitle =
            "You are sleeping quite long";

        resultMessage =
            "Your sleep duration is above the usual recommended range. Try maintaining a consistent sleep schedule of around 7–9 hours.";

        resultIcon = "💤";

    } else {

        resultTitle =
            "Your sleep duration looks healthy";

        resultMessage =
            "Great! Your current sleep duration is within the recommended range. Keep maintaining a consistent routine.";

        resultIcon = "🌙";

    }


    // --------------------------------------
    // DISPLAY CURRENT RESULT
    // --------------------------------------

    if (sleepResultIcon) {

        sleepResultIcon.textContent =
            resultIcon;

    }


    if (sleepResultTitle) {

        sleepResultTitle.textContent =
            resultTitle;

    }


    if (sleepResultMessage) {

        sleepResultMessage.textContent =
            resultMessage;

    }


    if (sleepDurationElement) {

        sleepDurationElement.textContent =
            sleepDuration;

    }


    // --------------------------------------
    // SHOW RESULT SECTION
    // --------------------------------------

    if (sleepResultSection) {

        sleepResultSection.classList.remove("hidden");

    }


    // --------------------------------------
    // SHOW RECOMMENDATION MESSAGE
    // --------------------------------------

    if (sleepRecommendMessage) {

        sleepRecommendMessage.classList.remove("hidden");

    }


    // --------------------------------------
    // SAVE SLEEP DETAILS
    // --------------------------------------

    const sleepDetails = {

        usualSleepTime:
            sleepTime,

        usualWakeTime:
            wakeTime,

        sleepDuration:
            sleepDuration,

        evaluation:
            resultTitle,

        recommendation:
            resultMessage,

        recommendedBedtime:
            "10:30 PM",

        recommendedWakeTime:
            "6:30 AM",

        recommendedDuration:
            "8 hours",

        createdAt:
            new Date().toISOString()

    };


    const sleepStorageKey =
    getUserStorageKey(
        "nutriTrackSleepDetails"
    );

    if (sleepStorageKey) {

        localStorage.setItem(
            sleepStorageKey,
            JSON.stringify(sleepDetails)
        );

    }


    // --------------------------------------
    // SCROLL TO RESULT
    // --------------------------------------

    setTimeout(function () {

        if (sleepResultSection) {

            sleepResultSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }, 100);

}


// ==========================================
// CALCULATE SLEEP DURATION
// ==========================================

function calculateSleepDuration(
    sleepTime,
    wakeTime
) {

    const sleepParts =
        sleepTime.split(":");

    const wakeParts =
        wakeTime.split(":");


    let sleepMinutes =
        Number(sleepParts[0]) * 60 +
        Number(sleepParts[1]);


    let wakeMinutes =
        Number(wakeParts[0]) * 60 +
        Number(wakeParts[1]);


    // --------------------------------------
    // OVERNIGHT SLEEP
    // --------------------------------------

    if (wakeMinutes <= sleepMinutes) {

        wakeMinutes += 24 * 60;

    }


    const totalMinutes =
        wakeMinutes - sleepMinutes;


    return Number(
        (totalMinutes / 60).toFixed(1)
    );

}


// ==========================================
// RECOMMENDATION ARROW
// ==========================================

if (sleepRecommendButton) {

    sleepRecommendButton.addEventListener(
        "click",
        function () {

            showRecommendedSleepSchedule();

        }
    );

}


// ==========================================
// SHOW RECOMMENDED SCHEDULE
// ==========================================

async function showRecommendedSleepSchedule() {

    const sleepStorageKey =
    getUserStorageKey(
        "nutriTrackSleepDetails"
    );

    if (!sleepStorageKey) {

        return;

    }

    const savedData =
    localStorage.getItem(
        sleepStorageKey
    );

    if (!savedData) {

        alert(
            "Please enter your usual sleep and wake-up time first."
        );

        return;

    }


    let sleepDetails;


    try {

        sleepDetails =
            JSON.parse(savedData);

    } catch (error) {

        console.error(
            "Unable to read saved sleep details:",
            error
        );

        alert(
            "Unable to load your sleep information."
        );

        return;

    }


    // --------------------------------------
    // RECOMMENDED SCHEDULE
    // --------------------------------------

    const recommendedBedtime =
        "10:30 PM";

    const recommendedWakeTime =
        "6:30 AM";

    const recommendedDuration =
        "8 hours";


    // --------------------------------------
    // DISPLAY RECOMMENDATION
    // --------------------------------------

    if (recommendedSleepTime) {

        recommendedSleepTime.textContent =
            recommendedBedtime;

    }


    if (recommendedWakeTime) {

        recommendedWakeTime.textContent =
            recommendedWakeTime;

    }


    if (recommendedSleepDuration) {

        recommendedSleepDuration.textContent =
            recommendedDuration;

    }


    // --------------------------------------
    // UPDATE SAVED DATA
    // --------------------------------------

    sleepDetails.recommendedBedtime =
        recommendedBedtime;

    sleepDetails.recommendedWakeTime =
        recommendedWakeTime;

    sleepDetails.recommendedDuration =
        recommendedDuration;


    localStorage.setItem(
       sleepStorageKey,
       JSON.stringify(sleepDetails)
    );


   const recommendedSleepStorageKey =
    getUserStorageKey(
        "nutriTrackRecommendedSleep"
    );

    if (recommendedSleepStorageKey) {

        localStorage.setItem(
           recommendedSleepStorageKey,
           JSON.stringify({

                bedtime:
                    recommendedBedtime,

                wakeTime:
                    recommendedWakeTime,

                duration:
                    recommendedDuration

            })
        );
    }    


    // --------------------------------------
    // SHOW RECOMMENDED SECTION
    // --------------------------------------

    if (recommendedSleepSection) {

        recommendedSleepSection.classList.remove(
            "hidden"
        );

    }


    // --------------------------------------
    // SAVE TO DATABASE
    // --------------------------------------

    await saveSleepScheduleToDatabase(
        sleepDetails
    );


    // --------------------------------------
    // SCROLL TO RECOMMENDATION
    // --------------------------------------

    setTimeout(function () {

        if (recommendedSleepSection) {

            recommendedSleepSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }, 100);

}


// ==========================================
// SAVE SLEEP SCHEDULE TO DATABASE
// ==========================================

async function saveSleepScheduleToDatabase(
    sleepDetails
) {

    try {

        const response =
            await fetch(
                "/api/sleep-schedules",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        usual_sleep_time:
                            sleepDetails.usualSleepTime,

                        usual_wake_time:
                            sleepDetails.usualWakeTime,

                        sleep_duration:
                            sleepDetails.sleepDuration,

                        evaluation:
                            sleepDetails.evaluation,

                        recommendation:
                            sleepDetails.recommendation,

                        recommended_bedtime:
                            sleepDetails.recommendedBedtime,

                        recommended_wake_time:
                            sleepDetails.recommendedWakeTime,

                        recommended_duration:
                            sleepDetails.recommendedDuration,

                        created_at:
                            sleepDetails.createdAt

                    })

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
        // DATABASE ERROR
        // --------------------------------------

        if (
            !response.ok ||
            data.success === false
        ) {

            console.error(
                "Sleep database error:",
                data.message ||
                "Unable to save sleep schedule."
            );

            return;

        }


        console.log(
            "Sleep schedule saved successfully:",
            data
        );


    } catch (error) {

        console.error(
            "Sleep API error:",
            error
        );

    }

}


// ==========================================
// LOAD SAVED SLEEP SCHEDULE
// ==========================================

function loadSavedSleepSchedule() {

    try {

        const sleepStorageKey =
        getUserStorageKey(
           "nutriTrackSleepDetails"
        );

        if (!sleepStorageKey) {

            return;

        }

        const savedData =
        localStorage.getItem(
            sleepStorageKey
        );


        if (!savedData) {

            return;

        }


        const sleepDetails =
            JSON.parse(savedData);


        // --------------------------------------
        // RESTORE INPUT VALUES
        // --------------------------------------

        if (
            sleepTimeInput &&
            sleepDetails.usualSleepTime
        ) {

            sleepTimeInput.value =
                sleepDetails.usualSleepTime;

        }


        if (
            wakeTimeInput &&
            sleepDetails.usualWakeTime
        ) {

            wakeTimeInput.value =
                sleepDetails.usualWakeTime;

        }


        // --------------------------------------
        // RESTORE CURRENT RESULT
        // --------------------------------------

        if (sleepDetails.sleepDuration) {

            if (sleepDurationElement) {

                sleepDurationElement.textContent =
                    sleepDetails.sleepDuration;

            }


            if (sleepResultTitle) {

                sleepResultTitle.textContent =
                    sleepDetails.evaluation ||
                    "Your Sleep Routine";

            }


            if (sleepResultMessage) {

                sleepResultMessage.textContent =
                    sleepDetails.recommendation ||
                    "Your sleep information has been saved.";

            }


            if (sleepResultSection) {

                sleepResultSection.classList.remove(
                    "hidden"
                );

            }


            if (sleepRecommendMessage) {

                sleepRecommendMessage.classList.remove(
                    "hidden"
                );

            }

        }


        // --------------------------------------
        // RESTORE RECOMMENDED SCHEDULE
        // --------------------------------------

        if (
            sleepDetails.recommendedBedtime &&
            sleepDetails.recommendedWakeTime &&
            sleepDetails.recommendedDuration
        ) {

            if (recommendedSleepTime) {

                recommendedSleepTime.textContent =
                    sleepDetails.recommendedBedtime;

            }


            if (recommendedWakeTime) {

                recommendedWakeTime.textContent =
                    sleepDetails.recommendedWakeTime;

            }


            if (recommendedSleepDuration) {

                recommendedSleepDuration.textContent =
                    sleepDetails.recommendedDuration;

            }


            if (recommendedSleepSection) {

                recommendedSleepSection.classList.remove(
                    "hidden"
                );

            }

        }

    } catch (error) {

        console.error(
            "Unable to load saved sleep schedule:",
            error
        );

    }

}
// ==========================================
// COMPLETE SLEEP BUTTON
// ==========================================

if (completeSleepButton) {

    completeSleepButton.addEventListener(
        "click",
        function () {

            completeSleepSchedule();

        }
    );

}
// ==========================================
// COMPLETE TODAY'S SLEEP SCHEDULE
// ==========================================

async function completeSleepSchedule() {

    try {

        const response =
            await fetch(
                "/api/progress/complete",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials:
                        "same-origin",

                    body: JSON.stringify({

                        completion_type:
                            "sleep",

                        plan_name:
                            "Daily Sleep Schedule",

                        description:
                            "Completed today's recommended sleep schedule."

                    })

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
            await response.json();


        // --------------------------------------
        // ERROR
        // --------------------------------------

        if (!response.ok || data.success === false) {

            console.error(
                "Sleep completion error:",
                data.message
            );

            if (sleepCompletionMessage) {

                sleepCompletionMessage.textContent =
                    "Something went wrong. Please try again.";

            }

            return;

        }


        // --------------------------------------
        // ALREADY COMPLETED
        // --------------------------------------

        if (data.already_completed) {

            showSleepCompletedMessage(
                "✓ You have already completed today's sleep schedule."
            );

            return;

        }


        // --------------------------------------
        // SUCCESS
        // --------------------------------------

        showSleepCompletedMessage(
            "✓ Today's sleep schedule completed!"
        );


        console.log(
            "Sleep completed successfully:",
            data
        );


    } catch (error) {

        console.error(
            "Sleep completion error:",
            error
        );

        if (sleepCompletionMessage) {

            sleepCompletionMessage.textContent =
                "Something went wrong. Please try again.";

        }

    }

}


// ==========================================
// SHOW SLEEP COMPLETED
// ==========================================

function showSleepCompletedMessage(message) {

    if (completeSleepButton) {

        completeSleepButton.textContent =
            "✓ Completed Today";

        completeSleepButton.classList.add(
            "completed"
        );

        completeSleepButton.disabled =
            true;

    }


    if (sleepCompletionMessage) {

        sleepCompletionMessage.textContent =
            message;

    }

}
// ==========================================
// CHECK TODAY'S SLEEP COMPLETION
// ==========================================

async function checkSleepCompletion() {

    try {

        const response =
            await fetch(
                "/api/progress"
            );


        if (!response.ok) {

            return;

        }


        const data =
            await response.json();


        const records =
            data.progress ||
            data.records ||
            [];


        const today =
            getLocalDate();


        const completedToday =
            records.some(function (record) {

                return (
                    record.completion_type === "sleep" &&
                    record.status === "completed" &&
                    record.completion_date === today
                );

            });


        if (completedToday) {

            showSleepCompletedMessage(
                "✓ You have already completed today's sleep schedule."
            );

        }

    } catch (error) {

        console.error(
            "Unable to check sleep completion:",
            error
        );

    }

}


// ==========================================
// LOCAL DATE
// ==========================================

function getLocalDate() {

    const date =
        new Date();

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

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}