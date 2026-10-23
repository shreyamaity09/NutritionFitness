// =====================================================
// NUTRITRACK - EXERCISE PLAN
// =====================================================


// -----------------------------------------------------
// GET ELEMENTS
// -----------------------------------------------------

const originalWeightInput =
    document.getElementById("originalWeight");

const targetWeightInput =
    document.getElementById("targetWeight");

const heightInput =
    document.getElementById("height");

const calculateExerciseDaysBtn =
    document.getElementById("calculateExerciseWeekssBtn");

const exerciseRecommendBtn =
    document.getElementById("exerciseRecommendBtn");

const exerciseAgainBtn =
    document.getElementById("exerciseAgainBtn");

const exerciseEstimateSection =
    document.getElementById("exerciseEstimateSection");

const exerciseRecommendMessage =
    document.getElementById("exerciseRecommendMessage");

const exercisePlanSection =
    document.getElementById("exercisePlanSection");

const exerciseEstimatedDays =
    document.getElementById("exerciseEstimatedWeeks");

const exerciseEstimateMessage =
    document.getElementById("exerciseEstimateMessage");

const exerciseGrid =
    document.getElementById("exerciseGrid");

const completeExerciseButton =
    document.getElementById("completeExerciseButton");

const exerciseCompletionMessage =
    document.getElementById("exerciseCompletionMessage");


// -----------------------------------------------------
// EXERCISE PLANS
// -----------------------------------------------------

const exercisePlans = [

    // =================================================
    // PLAN 1
    // =================================================

    [
        {
            name: "Jumping Jacks",
            duration: "30 secs",
            icon: "🤸",
            image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/yg3KQQn3QWg"
        },

        {
            name: "Reverse Lunge Kick",
            duration: "30 secs",
            icon: "🦵",
            image: "https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/cunAA8PLEAY"
        },

        {
            name: "Burpees",
            duration: "30 secs",
            icon: "🔥",
            image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/52e6CxY7siw"
        },

        {
            name: "Reverse Plank Tap",
            duration: "30 secs",
            icon: "💪",
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/D3P0ZWBbxKs"
        },

        {
            name: "Air Cycles",
            duration: "30 secs",
            icon: "🚴",
            image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/aNQSbgKNGwg"
        },

        {
            name: "Mountain Climber",
            duration: "30 secs",
            icon: "🏃",
            image: "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/7W4JEfEKuC4"
        },

        {
            name: "Reach Through",
            duration: "30 secs",
            icon: "🙆",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/TuFjDAPMTLE"
        },

        {
            name: "Curtsy Lunge",
            duration: "30 secs",
            icon: "🦵",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/d5qAtCjyzAQ"
        },

        {
            name: "Plank to Squat",
            duration: "30 secs",
            icon: "🏋️",
            image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/xUyky6gJy-Q"
        },

        {
            name: "Reverse Crunch Variation",
            duration: "30 secs",
            icon: "🔥",
            image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/ifsJAV9mLS0"
        }
    ],


    // =================================================
    // PLAN 2
    // =================================================

    [
        {
            name: "High Knees",
            duration: "30 secs",
            icon: "🏃",
            image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/mTIvJgQK7Ec"
        },

        {
            name: "Squats",
            duration: "30 secs",
            icon: "🦵",
            image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/4Ntle88WdKU"
        },

        {
            name: "Push Ups",
            duration: "30 secs",
            icon: "💪",
            image: "https://cdn.mos.cms.futurecdn.net/oYDbf5hQAePHEBNZTQMXRA.jpg",
            video: "https://www.youtube.com/shorts/pKZ-lkKKMws"
        },

        {
            name: "Mountain Climber",
            duration: "30 secs",
            icon: "🔥",
            image: "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/7W4JEfEKuC4"
        },

        {
            name: "Reverse Lunge Kick",
            duration: "30 secs",
            icon: "🦵",
            image: "https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/cunAA8PLEAY"
        },

        {
            name: "Knee Plank Shoulder Tap",
            duration: "30 secs",
            icon: "🏋️",
            image: "https://tse3.mm.bing.net/th/id/OIP.MYZbSXutRTp1d7WWNqDpaAHaFb?r=0&pid=Api&h=220&P=0",
            video: "https://www.youtube.com/shorts/SfbrliLKkqs"
        },

        {
            name: "Ladder Jumping Jacks",
            duration: "30 secs",
            icon: "🤸",
            image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/eNHiiacA3NQ"
        },

        {
            name: "Glute Bridge",
            duration: "30 secs",
            icon: "💪",
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/RrU4zx4ysnI"
        },

        {
            name: "Bicycle Crunches",
            duration: "30 secs",
            icon: "🔥",
            image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/cFDS2S6Vqis"
        },

        {
            name: "High Plank to Squat",
            duration: "30 secs",
            icon: "🏋️",
            image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/B1IgZbM-6dI"
        }
    ],


    // =================================================
    // PLAN 3
    // =================================================

    [
        {
            name: "Overhead Jumping Jacks",
            duration: "30 secs",
            icon: "🤸",
            image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/Nu5fGy-5EtA"
        },

        {
            name: "Curtsy Lunge to knee drive",
            duration: "30 secs",
            icon: "🦵",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/isy8OKYtXbs"
        },

        {
            name: "high Burpees and low impact burpees",
            duration: "30 secs",
            icon: "🔥",
            image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/52e6CxY7siw"
        },

        {
            name: "Crunh Reach Through",
            duration: "30 secs",
            icon: "🙆",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/uy3z_cq6EGc"
        },

        {
            name: "Bicycles Crunh",
            duration: "30 secs",
            icon: "🚴",
            image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/CakPX7X-mSw"
        },

        {
            name: "Plank Shoulder Tap",
            duration: "30 secs",
            icon: "💪",
            image: "https://manup.vn/wp-content/uploads/2025/08/Plank-shoulder-tap.jpg",
            video: "https://www.youtube.com/shorts/VfwCQ14soUo"
        },

        {
            name: "Reverse Crunch Variation",
            duration: "30 secs",
            icon: "🔥",
            image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/ifsJAV9mLS0"
        },

        {
            name: "DB Glute Bridge",
            duration: "30 secs",
            icon: "🏋️",
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/iOrJXNUH3to"
        },

        {
            name: "Mountain Climber",
            duration: "30 secs",
            icon: "🏃",
            image: "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/tQkpdUWK8KU"
        },

        {
            name: "Reverse Plank Tap",
            duration: "30 secs",
            icon: "💪",
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/rC5fgSL7x0o"
        }
    ],


    // =================================================
    // PLAN 4
    // =================================================

    [
        {
            name: "Jumping Jacks",
            duration: "30 secs",
            icon: "🤸",
            image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/yg3KQQn3QWg"
        },

        {
            name: "Bodyweight Squats",
            duration: "30 secs",
            icon: "🦵",
            image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/3fl7uYmiMVw"
        },

        {
            name: "Mountain Climber",
            duration: "30 secs",
            icon: "🔥",
            image: "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/tQkpdUWK8KU"
        },

        {
            name: "Reverse Lunge Kick",
            duration: "30 secs",
            icon: "🦵",
            image: "https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/cunAA8PLEA"
        },

        {
            name: "Push Ups",
            duration: "30 secs",
            icon: "💪",
            image: "https://cdn.mos.cms.futurecdn.net/oYDbf5hQAePHEBNZTQMXRA.jpg",
            video: "https://www.youtube.com/shorts/pKZ-lkKKMws"
        },

        {
            name: "Air Cycles",
            duration: "30 secs",
            icon: "🚴",
            image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/aNQSbgKNGwg"
        },

        {
            name: "Plank to Squat",
            duration: "30 secs",
            icon: "🏋️",
            image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/B1IgZbM-6dI"
        },

        {
            name: "Curtsy Lunge",
            duration: "30 secs",
            icon: "🦵",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/d5qAtCjyzAQ"
        },

        {
            name: "Bicycle Crunches",
            duration: "30 secs",
            icon: "🔥",
            image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/CakPX7X-mSw"
        },

        {
            name: "Reach Through",
            duration: "30 secs",
            icon: "🙆",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85",
            video: "https://www.youtube.com/shorts/TuFjDAPMTLE"
        }
    ]

];


// -----------------------------------------------------
// CURRENT PLAN
// -----------------------------------------------------

let currentExercisePlan = 0;

// -----------------------------------------------------
// CURRENT LOGGED-IN USER
// -----------------------------------------------------

let currentUserId = null;


// -----------------------------------------------------
// LOAD CURRENT USER FROM FLASK SESSION
// -----------------------------------------------------

async function loadCurrentUser() {

    try {

        const response = await fetch(
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


        // This is the same MongoDB _id
        // used by the backend as user_id.

        currentUserId =
            data.user._id;


        console.log(
            "Current NutriTrack user:",
            currentUserId
        );


        return currentUserId;

    }

    catch (error) {

        console.error(
            "Unable to load current user:",
            error
        );


        window.location.href =
            "/login";


        return null;

    }

}


// -----------------------------------------------------
// USER-SPECIFIC LOCAL STORAGE KEY
// -----------------------------------------------------

function getUserStorageKey(key) {

    if (!currentUserId) {

        console.error(
            "User ID is not available."
        );

        return null;

    }


    return `${key}_${currentUserId}`;

}


/* =====================================================
   CALCULATE ESTIMATED WEEKS
===================================================== */

if (calculateExerciseWeeksBtn) {

    calculateExerciseWeeksBtn.addEventListener(
        "click",
        function () {

            const originalWeight =
                parseFloat(originalWeightInput.value);

            const targetWeight =
                parseFloat(targetWeightInput.value);

            const height =
                parseFloat(heightInput.value);

            // Validate original weight
            if (
                !Number.isFinite(originalWeight) ||
                originalWeight <= 0
            ) {
                alert("Please enter your original weight.");
                originalWeightInput.focus();
                return;
            }

            // Validate target weight
            if (
                !Number.isFinite(targetWeight) ||
                targetWeight <= 0
            ) {
                alert("Please enter your target weight.");
                targetWeightInput.focus();
                return;
            }

            // Validate height
            if (
                !Number.isFinite(height) ||
                height < 50 ||
                height > 250
            ) {
                alert("Please enter a valid height between 50 and 250 cm.");
                heightInput.focus();
                return;
            }

            // Calculate the difference between the weights
            const weightDifference = Math.abs(
                originalWeight - targetWeight
            );

            // Illustrative estimate: 0.5 kg per week
            const estimatedWeeks =
                weightDifference === 0
                    ? 0
                    : Math.ceil(weightDifference / 0.5);

            // Display the estimated weeks
            exerciseEstimatedWeeks.textContent =
                estimatedWeeks;

            // Display a suitable message
            if (weightDifference === 0) {

                exerciseEstimateMessage.textContent =
                    "Your current weight already matches your target weight. Focus on regular exercise and maintaining a healthy routine.";

            } else if (targetWeight < originalWeight) {

                exerciseEstimateMessage.textContent =
                    `You want to lose approximately ${weightDifference.toFixed(1)} kg. Regular exercise and a balanced routine can support your fitness journey.`;

            } else {

                exerciseEstimateMessage.textContent =
                    `You want to gain approximately ${weightDifference.toFixed(1)} kg. Appropriate exercise and balanced nutrition can support your fitness journey.`;

            }

            // Save the user's exercise details
            const exerciseDetails = {

                originalWeight: originalWeight,

                targetWeight: targetWeight,

                height: height,

                estimatedWeeks: estimatedWeeks

            };

            const exerciseStorageKey =
                getUserStorageKey(
                    "nutriTrackExerciseDetails"
                );

            if (exerciseStorageKey) {

                localStorage.setItem(
                    exerciseStorageKey,
                    JSON.stringify(exerciseDetails)
                );

            }

            // Show the estimate section
            exerciseEstimateSection.classList.remove(
                "hidden"
            );

            // Scroll to the estimate
            setTimeout(function () {

                exerciseEstimateSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }, 150);

        }
    );

}


// -----------------------------------------------------
// FIRST RECOMMENDATION
// -----------------------------------------------------

exerciseRecommendBtn.addEventListener(
    "click",
    function () {

        currentExercisePlan = 0;

        showExercisePlan(
            currentExercisePlan
        );


        exerciseRecommendMessage.classList.remove(
            "hidden"
        );


        exercisePlanSection.classList.remove(
            "hidden"
        );


        setTimeout(
            function () {

                exercisePlanSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            },
            150
        );

    }
);


// -----------------------------------------------------
// RECOMMEND AGAIN
// -----------------------------------------------------

exerciseAgainBtn.addEventListener(
    "click",
    function () {

        currentExercisePlan++;


        if (
            currentExercisePlan >=
            exercisePlans.length
        ) {

            currentExercisePlan = 0;

        }


        showExercisePlan(
            currentExercisePlan
        );


        saveExerciseHistory(
            currentExercisePlan
        );


        exercisePlanSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


// -----------------------------------------------------
// SHOW EXERCISE PLAN
// -----------------------------------------------------

function showExercisePlan(planIndex) {

    const plan =
        exercisePlans[planIndex];


    exerciseGrid.innerHTML = "";


    plan.forEach(
        function (exercise, index) {

            const exerciseCard =
                document.createElement("article");


            exerciseCard.className =
                "meal-card exercise-card";


            exerciseCard.innerHTML = `

                <div class="meal-card-top">

                    <div class="meal-emoji">
                        ${exercise.icon}
                    </div>

                    <div>

                        <span class="meal-time">
                            EXERCISE ${index + 1}
                        </span>

                        <h3>
                            ${exercise.name}
                        </h3>

                    </div>

                </div>


                <p>
                    Perform this exercise
                    continuously for ${exercise.duration}.
                </p>
                <p class="video-hint">
                   ▶ Click the card to watch the exercise video
                </p>

                <div class="meal-info">

                    <span>
                        ⏱️ ${exercise.duration}
                    </span>

                </div>

            `;


            // -----------------------------------------
            // APPLY BACKGROUND IMAGE
            // -----------------------------------------

            if (exercise.image) {

                exerciseCard.style.backgroundImage =
                    `url("${exercise.image}")`;

            }


            // -----------------------------------------
            // OPEN EXERCISE VIDEO
            // -----------------------------------------

            if (exercise.video) {

                exerciseCard.onclick =
                    function () {

                        window.open(
                            exercise.video,
                            "_blank"
                        );

                    };

            }


            exerciseGrid.appendChild(
                exerciseCard
            );

        }
    );

}


// -----------------------------------------------------
// TEMPORARY HISTORY
// -----------------------------------------------------

function saveExerciseHistory(planIndex) {

    const historyStorageKey =
    getUserStorageKey(
        "nutriTrackExerciseHistory"
    );


    if (!historyStorageKey) {

        return;

    }


    const existingHistory =
        JSON.parse(
            localStorage.getItem(
                historyStorageKey
            )
        ) || [];


    const historyItem = {

        planNumber:
            planIndex + 1,

        date:
            new Date().toLocaleDateString(),

        time:
            new Date().toLocaleTimeString(),

        exercises:
            exercisePlans[planIndex]

    };


    existingHistory.push(
        historyItem
    );


    localStorage.setItem(
        historyStorageKey,
        JSON.stringify(existingHistory)
    );

}
// =====================================================
// EXERCISE COMPLETION
// =====================================================

async function completeExercisePlan() {

    if (!completeExerciseButton) {
        return;
    }

    completeExerciseButton.disabled = true;

    try {

        const exerciseStorageKey =
           getUserStorageKey(
                "nutriTrackExerciseDetails"
            );


        const exerciseDetails =
            JSON.parse(
                exerciseStorageKey
                ? (
                   localStorage.getItem(
                        exerciseStorageKey
                    ) || "{}"
                )
                : "{}"
            );

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

                    body:
                        JSON.stringify({

                            completion_type:
                                "exercise",

                            plan_name:
                                "Daily Exercise Plan",

                            plan_id:
                                exerciseDetails.plan_id || null

                        })
                }
            );


        if (response.status === 401) {

            window.location.href =
                "/login";

            return;

        }


        const data =
            await response.json();


        if (
            response.ok &&
            data.success
        ) {

            setExerciseCompleted();

            return;

        }


        completeExerciseButton.disabled =
            false;


        if (exerciseCompletionMessage) {

            exerciseCompletionMessage.textContent =
                data.message ||
                "Unable to complete the exercise plan.";

            exerciseCompletionMessage.className =
                "completion-message info";

        }


    } catch (error) {

        console.error(
            "Exercise completion error:",
            error
        );


        completeExerciseButton.disabled =
            false;


        if (exerciseCompletionMessage) {

            exerciseCompletionMessage.textContent =
                "Something went wrong. Please try again.";

            exerciseCompletionMessage.className =
                "completion-message info";

        }

    }

}


// =====================================================
// SET EXERCISE AS COMPLETED
// =====================================================

function setExerciseCompleted() {

    if (!completeExerciseButton) {
        return;
    }


    completeExerciseButton.textContent =
        "✓ Completed Today";


    completeExerciseButton.disabled =
        true;


    completeExerciseButton.classList.add(
        "completed"
    );


    if (exerciseCompletionMessage) {

        exerciseCompletionMessage.textContent =
            "Your exercise plan has been completed for today.";

        exerciseCompletionMessage.className =
            "completion-message success";

    }

}


// =====================================================
// CHECK TODAY'S EXERCISE COMPLETION
// =====================================================

async function checkExerciseCompletion() {

    if (!completeExerciseButton) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/progress",
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );


        if (response.status === 401) {

            window.location.href =
                "/login";

            return;

        }


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            return;

        }


        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        const completed =
            (data.progress || []).some(
                function (record) {

                    return (
                        record.status === "completed" &&
                        record.completion_type === "exercise" &&
                        record.completion_date === today
                    );

                }
            );


        if (completed) {

            setExerciseCompleted();

        }

    } catch (error) {

        console.warn(
            "Could not check exercise completion:",
            error
        );

    }

}


// =====================================================
// EXERCISE COMPLETION BUTTON
// =====================================================

if (completeExerciseButton) {

    completeExerciseButton.addEventListener(
        "click",
        completeExercisePlan
    );

}


// =====================================================
// CHECK COMPLETION WHEN PAGE LOADS
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const userId =
            await loadCurrentUser();


        if (!userId) {

            return;

        }


        checkExerciseCompletion();

    }
);