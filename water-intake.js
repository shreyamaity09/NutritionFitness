// ==========================================
// NUTRITRACK - WATER INTAKE
// Matches current water-intake.html
// ==========================================


// ==========================================
// DOM ELEMENTS
// ==========================================

const waterAmountInput =
    document.getElementById("waterAmount");

const checkWaterButton =
    document.getElementById("checkWaterBtn");

const waterResultSection =
    document.getElementById("waterResultSection");

const waterResultIcon =
    document.getElementById("waterResultIcon");

const waterResultTitle =
    document.getElementById("waterResultTitle");

const waterResultMessage =
    document.getElementById("waterResultMessage");

const currentWaterAmount =
    document.getElementById("currentWaterAmount");

const waterRecommendButton =
    document.getElementById("waterRecommendBtn");

const waterRecommendMessage =
    document.getElementById("waterRecommendMessage");

const recommendedWaterSection =
    document.getElementById("recommendedWaterSection");

const recommendedWaterAmount =
    document.getElementById("recommendedWaterAmount");

const recommendedWaterLitres =
    document.getElementById("recommendedWaterLitres");

const hydrationStatus =
    document.getElementById("hydrationStatus");

const completeWaterButton =
    document.getElementById("completeWaterButton");

const waterCompletionMessage =
    document.getElementById("waterCompletionMessage");

const waterGlassesContainer =
    document.getElementById("waterGlassesContainer");

const completedWaterGlasses =
    document.getElementById("completedWaterGlasses");

const totalWaterGlasses =
    document.getElementById("totalWaterGlasses");


// ==========================================
// DEFAULT RECOMMENDED WATER
// ==========================================

const DEFAULT_WATER = 2000;


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


        loadSavedWaterData();

        checkWaterCompletion();

    }
);


// ==========================================
// CHECK WATER BUTTON
// ==========================================

if (checkWaterButton) {

    checkWaterButton.addEventListener(
        "click",
        function () {

            checkWaterIntake();

        }
    );

}


// ==========================================
// CHECK WATER INTAKE
// ==========================================

function checkWaterIntake() {

    const amount =
        waterAmountInput
            ? Number(waterAmountInput.value)
            : 0;


    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    if (!amount || amount <= 0) {

        alert(
            "Please select your daily water intake."
        );

        return;

    }


    // --------------------------------------
    // EVALUATE WATER
    // --------------------------------------

    const result =
        evaluateWaterIntake(amount);


    // --------------------------------------
    // DISPLAY CURRENT RESULT
    // --------------------------------------

    if (waterResultIcon) {

        waterResultIcon.textContent =
            result.icon;

    }


    if (waterResultTitle) {

        waterResultTitle.textContent =
            result.title;

    }


    if (waterResultMessage) {

        waterResultMessage.textContent =
            result.message;

    }


    if (currentWaterAmount) {

        currentWaterAmount.textContent =
            amount.toLocaleString();

    }


    // --------------------------------------
    // SHOW CURRENT RESULT
    // --------------------------------------

    if (waterResultSection) {

        waterResultSection.classList.remove(
            "hidden"
        );

    }


    // --------------------------------------
    // SHOW RECOMMENDATION MESSAGE
    // --------------------------------------

    if (waterRecommendMessage) {

        waterRecommendMessage.classList.remove(
            "hidden"
        );

    }


    // --------------------------------------
    // SAVE LOCALLY
    // --------------------------------------

    const waterDetails = {

        waterAmount:
            amount,

        recommendedWater:
            DEFAULT_WATER,

        litres:
            amount / 1000,

        evaluation:
            result.title,

        recommendation:
            result.message,

        createdAt:
            new Date().toISOString()

    };


    const waterDetailsStorageKey =
        getUserStorageKey(
            "nutriTrackWaterDetails"
        );


    if (waterDetailsStorageKey) {

        localStorage.setItem(
            waterDetailsStorageKey,
            JSON.stringify(waterDetails)
        );

    }


    const recommendedWaterStorageKey =
        getUserStorageKey(
            "nutriTrackRecommendedWater"
        );


    if (recommendedWaterStorageKey) {

        localStorage.setItem(
            recommendedWaterStorageKey,
            JSON.stringify({

                amount:
                    DEFAULT_WATER,

                litres:
                    DEFAULT_WATER / 1000

            })
        );

    }


    // --------------------------------------
    // SCROLL TO RESULT
    // --------------------------------------

    setTimeout(function () {

        if (waterResultSection) {

            waterResultSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }, 100);

}


// ==========================================
// EVALUATE WATER INTAKE
// ==========================================

function evaluateWaterIntake(amount) {

    amount = Number(amount);


    // --------------------------------------
    // LOW WATER
    // --------------------------------------

    if (amount < 1500) {

        return {

            title:
                "Your water intake is low",

            message:
                "Your current water intake is below the recommended amount. Try drinking more water throughout the day.",

            icon:
                "💧"

        };

    }


    // --------------------------------------
    // MODERATE WATER
    // --------------------------------------

    if (
        amount >= 1500 &&
        amount < 2000
    ) {

        return {

            title:
                "Your hydration is good",

            message:
                "Your water intake is good, but increasing it slightly can help you stay better hydrated.",

            icon:
                "🌊"

        };

    }


    // --------------------------------------
    // GOOD WATER
    // --------------------------------------

    if (
        amount >= 2000 &&
        amount <= 3000
    ) {

        return {

            title:
                "Excellent hydration",

            message:
                "Great job! You are maintaining a healthy level of hydration.",

            icon:
                "💧"

        };

    }


    // --------------------------------------
    // HIGH WATER
    // --------------------------------------

    return {

        title:
            "Your water intake is quite high",

        message:
            "Your water intake is relatively high. Drink according to your body's needs and avoid excessive water intake.",

        icon:
            "🌊"

    };

}


// ==========================================
// RECOMMENDATION ARROW
// ==========================================

if (waterRecommendButton) {

    waterRecommendButton.addEventListener(
        "click",
        function () {

            showRecommendedWater();

        }
    );

}


// ==========================================
// SHOW RECOMMENDED WATER
// ==========================================

async function showRecommendedWater() {

    const waterDetailsStorageKey =
        getUserStorageKey(
            "nutriTrackWaterDetails"
        );


    if (!waterDetailsStorageKey) {

        return;

    }


    const savedData =
        localStorage.getItem(
            waterDetailsStorageKey
        );


    // --------------------------------------
    // CHECK SAVED DATA
    // --------------------------------------

    if (!savedData) {

        alert(
            "Please enter your current water intake first."
        );

        return;

    }


    let waterDetails;


    try {

        waterDetails =
            JSON.parse(savedData);

    } catch (error) {

        console.error(
            "Unable to read saved water details:",
            error
        );

        alert(
            "Unable to load your water information."
        );

        return;

    }


    // --------------------------------------
    // RECOMMENDED WATER
    // --------------------------------------

    const recommendedAmount =
        DEFAULT_WATER;

    const litres =
        recommendedAmount / 1000;


    // --------------------------------------
    // DISPLAY RECOMMENDED AMOUNT
    // --------------------------------------

    if (recommendedWaterAmount) {

        recommendedWaterAmount.textContent =
            recommendedAmount.toLocaleString() + " ml";

    }


    // --------------------------------------
    // DISPLAY LITRES
    // --------------------------------------

    if (recommendedWaterLitres) {

        recommendedWaterLitres.textContent =
            litres.toFixed(1) + " L";

    }


    // --------------------------------------
    // DISPLAY HYDRATION STATUS
    // --------------------------------------

    if (hydrationStatus) {

        hydrationStatus.textContent =
            "Stay Hydrated";

    }


    // --------------------------------------
    // UPDATE SAVED DATA
    // --------------------------------------

    waterDetails.recommendedWater =
        recommendedAmount;

    waterDetails.recommendedLitres =
        litres;


    localStorage.setItem(
        waterDetailsStorageKey,
        JSON.stringify(waterDetails)
    );


    const recommendedWaterStorageKey =
        getUserStorageKey(
            "nutriTrackRecommendedWater"
        );


    if (recommendedWaterStorageKey) {

        localStorage.setItem(
            recommendedWaterStorageKey,
            JSON.stringify({

                amount:
                    recommendedAmount,

                litres:
                    litres

            })
        );

    }


    // --------------------------------------
    // SHOW RECOMMENDED SECTION
    // --------------------------------------

    if (recommendedWaterSection) {

        recommendedWaterSection.classList.remove(
            "hidden"
        );

    }


    createWaterGlasses(
        recommendedAmount
    );


    // --------------------------------------
    // SAVE TO DATABASE
    // --------------------------------------

    await saveWaterToDatabase(
        waterDetails
    );


    // --------------------------------------
    // SCROLL TO RECOMMENDATION
    // --------------------------------------

    setTimeout(function () {

        if (recommendedWaterSection) {

            recommendedWaterSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }, 100);

}


// ==========================================
// SAVE WATER TO DATABASE
// ==========================================

async function saveWaterToDatabase(
    waterDetails
) {

    try {

        const result =
            evaluateWaterIntake(
                waterDetails.waterAmount
            );


        const response =
            await fetch(
                "/api/water-intake",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials:
                        "same-origin",

                    body: JSON.stringify({

                        water_amount_ml:
                            Number(
                                waterDetails.waterAmount
                            ),

                        recommended_water_ml:
                            DEFAULT_WATER,

                        water_litres:
                            Number(
                                waterDetails.waterAmount
                            ) / 1000,

                        evaluation:
                            result.title,

                        recommendation:
                            result.message,

                        created_at:
                            waterDetails.createdAt ||
                            new Date().toISOString()

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
                "Water database error:",
                data.message ||
                "Unable to save water intake."
            );

            return;

        }


        console.log(
            "Water intake saved successfully:",
            data
        );


    } catch (error) {

        console.error(
            "Water API error:",
            error
        );

    }

}


// ==========================================
// LOAD SAVED WATER DATA
// ==========================================

function loadSavedWaterData() {

    try {

        const waterDetailsStorageKey =
            getUserStorageKey(
                "nutriTrackWaterDetails"
            );


        if (!waterDetailsStorageKey) {

            return;

        }


        const savedData =
            localStorage.getItem(
                waterDetailsStorageKey
            );


        if (!savedData) {

            return;

        }


        const waterDetails =
            JSON.parse(savedData);


        // --------------------------------------
        // RESTORE DROPDOWN
        // --------------------------------------

        if (
            waterAmountInput &&
            waterDetails.waterAmount
        ) {

            waterAmountInput.value =
                waterDetails.waterAmount;

        }


        // --------------------------------------
        // RESTORE CURRENT RESULT
        // --------------------------------------

        if (waterDetails.waterAmount) {

            const result =
                evaluateWaterIntake(
                    waterDetails.waterAmount
                );


            if (waterResultIcon) {

                waterResultIcon.textContent =
                    result.icon;

            }


            if (waterResultTitle) {

                waterResultTitle.textContent =
                    result.title;

            }


            if (waterResultMessage) {

                waterResultMessage.textContent =
                    result.message;

            }


            if (currentWaterAmount) {

                currentWaterAmount.textContent =
                    Number(
                        waterDetails.waterAmount
                    ).toLocaleString();

            }


            if (waterResultSection) {

                waterResultSection.classList.remove(
                    "hidden"
                );

            }


            if (waterRecommendMessage) {

                waterRecommendMessage.classList.remove(
                    "hidden"
                );

            }

        }


        // --------------------------------------
        // RESTORE RECOMMENDATION
        // --------------------------------------

        if (
            waterDetails.recommendedWater
        ) {

            const recommendedAmount =
                Number(
                    waterDetails.recommendedWater
                );

            const litres =
                recommendedAmount / 1000;


            if (recommendedWaterAmount) {

                recommendedWaterAmount.textContent =
                    recommendedAmount.toLocaleString() +
                    " ml";

            }


            if (recommendedWaterLitres) {

                recommendedWaterLitres.textContent =
                    litres.toFixed(1) +
                    " L";

            }


            if (hydrationStatus) {

                hydrationStatus.textContent =
                    "Stay Hydrated";

            }


            if (recommendedWaterSection) {

                recommendedWaterSection.classList.remove(
                    "hidden"
                );

            }


            createWaterGlasses(
                recommendedAmount
            );

        }

    } catch (error) {

        console.error(
            "Unable to load saved water data:",
            error
        );

    }

}


// ==========================================
// COMPLETE WATER BUTTON
// ==========================================

if (completeWaterButton) {

    completeWaterButton.addEventListener(
        "click",
        function () {

            completeWaterIntake();

        }
    );

}


// ==========================================
// COMPLETE TODAY'S WATER INTAKE
// ==========================================

async function completeWaterIntake() {

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
                            "water",

                        plan_name:
                            "Daily Water Intake",

                        description:
                            "Completed today's recommended water intake."

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
                "Water completion error:",
                data.message
            );

            if (waterCompletionMessage) {

                waterCompletionMessage.textContent =
                    "Something went wrong. Please try again.";

            }

            return;

        }


        // --------------------------------------
        // ALREADY COMPLETED
        // --------------------------------------

        if (data.already_completed) {

            showWaterCompletedMessage(
                "✓ You have already completed today's water intake."
            );

            return;

        }


        // --------------------------------------
        // SUCCESS
        // --------------------------------------

        showWaterCompletedMessage(
            "✓ Today's water intake completed!"
        );


        console.log(
            "Water completed successfully:",
            data
        );


    } catch (error) {

        console.error(
            "Water completion error:",
            error
        );

        if (waterCompletionMessage) {

            waterCompletionMessage.textContent =
                "Something went wrong. Please try again.";

        }

    }

}


// ==========================================
// SHOW WATER COMPLETED
// ==========================================

function showWaterCompletedMessage(message) {

    if (completeWaterButton) {

        completeWaterButton.textContent =
            "✓ Completed Today";

        completeWaterButton.classList.add(
            "completed"
        );

        completeWaterButton.disabled =
            true;

    }


    if (waterCompletionMessage) {

        waterCompletionMessage.textContent =
            message;

    }

}


// ==========================================
// CHECK TODAY'S WATER COMPLETION
// ==========================================

async function checkWaterCompletion() {

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
            getWaterLocalDate();


        const completedToday =
            records.some(function (record) {

                return (
                    record.completion_type === "water" &&
                    record.status === "completed" &&
                    record.completion_date === today
                );

            });


        if (completedToday) {

            showWaterCompletedMessage(
                "✓ You have already completed today's water intake."
            );

        }

    } catch (error) {

        console.error(
            "Unable to check water completion:",
            error
        );

    }

}


// ==========================================
// LOCAL DATE
// ==========================================

function getWaterLocalDate() {

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


// ==========================================
// DAILY WATER GLASSES
// ==========================================

const WATER_GLASS_SIZE = 250;


// ==========================================
// CREATE WATER GLASSES
// ==========================================

function createWaterGlasses(recommendedAmount) {

    if (!waterGlassesContainer) {

        return;

    }


    recommendedAmount =
        Number(recommendedAmount) || DEFAULT_WATER;


    // --------------------------------------
    // CALCULATE NUMBER OF GLASSES
    // --------------------------------------

    const totalGlasses =
        Math.ceil(
            recommendedAmount /
            WATER_GLASS_SIZE
        );


    if (totalWaterGlasses) {

        totalWaterGlasses.textContent =
            totalGlasses;

    }


    // --------------------------------------
    // GET TODAY'S SAVED PROGRESS
    // --------------------------------------

    const savedProgress =
        getSavedWaterGlassProgress(
            totalGlasses
        );


    // --------------------------------------
    // CLEAR OLD GLASSES
    // --------------------------------------

    waterGlassesContainer.innerHTML = "";


    // --------------------------------------
    // CREATE EACH GLASS
    // --------------------------------------

    for (
        let glassNumber = 1;
        glassNumber <= totalGlasses;
        glassNumber++
    ) {

        const glassCard =
            document.createElement("div");


        glassCard.className =
            "water-glass-card";


        const glassIcon =
            document.createElement("div");


        glassIcon.className =
            "water-glass-icon";


        glassIcon.textContent =
            "💧";


        const glassInfo =
            document.createElement("div");


        glassInfo.className =
            "water-glass-info";


        const glassTitle =
            document.createElement("h3");


        glassTitle.textContent =
            "Glass " + glassNumber;


        const glassDescription =
            document.createElement("p");


        const remainingAmount =
            recommendedAmount -
            (
                (glassNumber - 1) *
                WATER_GLASS_SIZE
            );


        const glassAmount =
            Math.min(
                WATER_GLASS_SIZE,
                remainingAmount
            );


        glassDescription.textContent =
            glassAmount +
            " ml of water";


        glassInfo.appendChild(
            glassTitle
        );


        glassInfo.appendChild(
            glassDescription
        );


        const doneButton =
            document.createElement("button");


        doneButton.className =
            "water-glass-done";


        doneButton.type =
            "button";


        doneButton.textContent =
            "Done";


        doneButton.dataset.glassNumber =
            glassNumber;


        // ----------------------------------
        // COMPLETED GLASS
        // ----------------------------------

        if (
            savedProgress.includes(
                glassNumber
            )
        ) {

            glassCard.classList.add(
                "completed"
            );

            doneButton.textContent =
                "✓ Done";

            doneButton.disabled =
                true;

        }


        // ----------------------------------
        // CHECK IF THIS GLASS IS AVAILABLE
        // ----------------------------------

        if (
            glassNumber !==
            getNextWaterGlassNumber(
                totalGlasses
            ) &&
            !savedProgress.includes(
                glassNumber
            )
        ) {

            doneButton.disabled =
                true;

        }


        // ----------------------------------
        // DONE BUTTON
        // ----------------------------------

        doneButton.addEventListener(
            "click",
            function () {

                completeWaterGlass(
                    glassNumber,
                    recommendedAmount
                );

            }
        );


        glassCard.appendChild(
            glassIcon
        );


        glassCard.appendChild(
            glassInfo
        );


        glassCard.appendChild(
            doneButton
        );


        waterGlassesContainer.appendChild(
            glassCard
        );


        // ----------------------------------
        // ADD NEXT GLASS MESSAGE
        // ----------------------------------

        if (
            glassNumber <
            totalGlasses
        ) {

            const nextMessage =
                document.createElement("div");


            nextMessage.className =
                "water-next-message";


            nextMessage.textContent =
                "After this glass, wait 30–40 minutes before drinking the next glass.";


            glassInfo.appendChild(
                nextMessage
            );

        }

    }


    updateWaterGlassCounter(
        totalGlasses
    );


    updateCompleteWaterButton(
        totalGlasses
    );

}


// ==========================================
// COMPLETE ONE WATER GLASS
// ==========================================

function completeWaterGlass(
    glassNumber,
    recommendedAmount
) {

    const totalGlasses =
        Math.ceil(
            Number(recommendedAmount) /
            WATER_GLASS_SIZE
        );


    const savedProgress =
        getSavedWaterGlassProgress(
            totalGlasses
        );


    // --------------------------------------
    // PREVENT SKIPPING GLASSES
    // --------------------------------------

    const nextGlass =
        getNextWaterGlassNumber(
            totalGlasses
        );


    if (
        glassNumber !==
        nextGlass
    ) {

        return;

    }


    // --------------------------------------
    // ADD COMPLETED GLASS
    // --------------------------------------

    savedProgress.push(
        glassNumber
    );


    savedProgress.sort(
        function (a, b) {
            return a - b;
        }
    );


    saveWaterGlassProgress(
        savedProgress,
        recommendedAmount
    );


    // --------------------------------------
    // RECREATE GLASSES
    // --------------------------------------

    createWaterGlasses(
        recommendedAmount
    );


    // --------------------------------------
    // SCROLL TO NEXT GLASS
    // --------------------------------------

    setTimeout(
        function () {

            const nextButton =
                waterGlassesContainer.querySelector(
                    ".water-glass-done:not(:disabled)"
                );


            if (nextButton) {

                nextButton.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        },
        150
    );

}


// ==========================================
// GET NEXT GLASS
// ==========================================

function getNextWaterGlassNumber(
    totalGlasses
) {

    const savedProgress =
        getSavedWaterGlassProgress(
            totalGlasses
        );


    for (
        let glassNumber = 1;
        glassNumber <= totalGlasses;
        glassNumber++
    ) {

        if (
            !savedProgress.includes(
                glassNumber
            )
        ) {

            return glassNumber;

        }

    }


    return totalGlasses + 1;

}


// ==========================================
// SAVE WATER GLASS PROGRESS
// ==========================================

function saveWaterGlassProgress(
    progress,
    recommendedAmount
) {

    const waterGlassData = {

        date:
            getWaterLocalDate(),

        recommendedAmount:
            Number(recommendedAmount),

        completedGlasses:
            progress

    };


    const waterGlassStorageKey =
        getUserStorageKey(
            "nutriTrackWaterGlasses"
        );


    if (!waterGlassStorageKey) {

        return;

    }


    localStorage.setItem(
        waterGlassStorageKey,
        JSON.stringify(
            waterGlassData
        )
    );

}


// ==========================================
// GET SAVED WATER GLASS PROGRESS
// ==========================================

function getSavedWaterGlassProgress(
    totalGlasses
) {

    try {

        const waterGlassStorageKey =
            getUserStorageKey(
                "nutriTrackWaterGlasses"
            );


        if (!waterGlassStorageKey) {

            return [];

        }


        const savedData =
            localStorage.getItem(
                waterGlassStorageKey
            );


        if (!savedData) {

            return [];

        }


        const waterGlassData =
            JSON.parse(
                savedData
            );


        // ----------------------------------
        // RESET FOR NEW DAY
        // ----------------------------------

        if (
            waterGlassData.date !==
            getWaterLocalDate()
        ) {

            return [];

        }


        // ----------------------------------
        // GET CURRENT USER'S WATER DETAILS
        // ----------------------------------

        const waterDetailsStorageKey =
            getUserStorageKey(
                "nutriTrackWaterDetails"
            );


        if (!waterDetailsStorageKey) {

            return [];

        }


        let currentWaterDetails = {};

        try {

            currentWaterDetails =
                JSON.parse(
                    localStorage.getItem(
                        waterDetailsStorageKey
                    ) || "{}"
                );

        } catch (error) {

            currentWaterDetails = {};

        }


        // ----------------------------------
        // RESET IF TARGET CHANGED
        // ----------------------------------

        if (
            Number(
                waterGlassData.recommendedAmount
            ) !==
            Number(
                currentWaterDetails.recommendedWater
            )
        ) {

            return [];

        }


        return Array.isArray(
            waterGlassData.completedGlasses
        )
            ? waterGlassData.completedGlasses
            : [];

    } catch (error) {

        console.error(
            "Unable to load water glass progress:",
            error
        );


        return [];

    }

}


// ==========================================
// UPDATE GLASS COUNTER
// ==========================================

function updateWaterGlassCounter(
    totalGlasses
) {

    if (!completedWaterGlasses) {

        return;

    }


    const progress =
        getSavedWaterGlassProgress(
            totalGlasses
        );


    completedWaterGlasses.textContent =
        progress.length;

}


// ==========================================
// UPDATE COMPLETE BUTTON
// ==========================================

function updateCompleteWaterButton(
    totalGlasses
) {

    if (!completeWaterButton) {

        return;

    }


    const progress =
        getSavedWaterGlassProgress(
            totalGlasses
        );


    if (
        progress.length >=
        totalGlasses
    ) {

        // -------------------------------
        // ALL GLASSES COMPLETED
        // -------------------------------

        completeWaterButton.disabled =
            false;

        completeWaterButton.style.opacity =
            "1";

        completeWaterButton.style.cursor =
            "pointer";

    } else {

        // -------------------------------
        // GLASSES STILL REMAIN
        // -------------------------------

        completeWaterButton.disabled =
            true;

        completeWaterButton.style.opacity =
            "0.5";

        completeWaterButton.style.cursor =
            "not-allowed";

    }

}