// ==========================================
// NUTRITRACK - MEAL PLAN
// ==========================================


const mealPlans = [

    // ==========================================
    // MEAL PLAN 1
    // ==========================================

    {
        breakfast: "Oatmeal with banana and almonds smoo",
        lunch: "Grilled chicken with brown rice and vegetables",
        dinner: "Paneer with roti and mixed vegetables",

        breakfastImage:
            "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=900&q=85",

        lunchImage:
            "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_300%2Ch_300%2Cc_fit/FOOD_CATALOG/IMAGES/CMS/2025/11/2/f01f8c26-6e30-4f26-a62a-6f13a7586d2e_10a29f8f-2167-431b-bdfc-d002ea606f06.jpg",

        dinnerImage:
            "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_300%2Ch_300%2Ce_grayscale%2Cc_fit/FOOD_CATALOG/IMAGES/CMS/2025/12/11/cef859da-4a8e-40ce-b516-aa0e1cdfc5a9_d0b90a3d-4cd1-4063-b4a9-18c82599faef.jpeg",

        breakfastVideo:
            "https://www.youtube.com/watch?v=TywIQRspW98",
        lunchVideo:
            "https://www.youtube.com/watch?v=JqAYN1i0a4Y",

        dinnerVideo:
            "https://www.youtube.com/watch?v=gBlBuj_rBuw"
    },


    // ==========================================
    // MEAL PLAN 2
    // ==========================================

    {
        breakfast: "Boiled eggs with whole wheat toast and avacado",
        lunch: "Chicken salad with avocado and vegetables",
        dinner: "Dal, roti and vegetable salad",

        breakfastImage:
            "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85",

        lunchImage:
            "https://homechefrecipes.com/wp-content/uploads/2026/02/avocado_chicken_salad_3.png",

        dinnerImage:
            "https://img.magnific.com/premium-photo/indian-mini-meal-parcel-platter-combo-thali-with-rajma-masala-roti-dal-tadka-jeera-rice-salad_974732-15821.jpg?w=2000",

        breakfastVideo:
            "https://www.youtube.com/watch?v=7z96ide2-no",

        lunchVideo:
            "https://www.youtube.com/watch?v=zCdMp1rBAdg",

        dinnerVideo:
            "https://www.youtube.com/watch?v=k0Y4HjghVv8"
    },


    // ==========================================
    // MEAL PLAN 3
    // ==========================================

    {
        breakfast: "Greek yogurt with fruits and nuts",
        lunch: "Brown rice, dal and mixed vegetables",
        dinner: "Palak paneer with roti and salad",

        breakfastImage:
            "https://as1.ftcdn.net/v2/jpg/05/91/06/28/1000_F_591062810_ccQ5kmNgkaoNnKWyhsV4TZWujcVkMaqp.jpg",

        lunchImage:
            "https://www.cookwithkushi.com/wp-content/uploads/2016/02/IMG_7743_-1.jpg",

        dinnerImage:
            "https://thumbs.dreamstime.com/z/indian-meal-palak-paneer-served-roti-salad-traditional-popular-dish-spinach-cheese-tandoori-glutenfree-curry-112712503.jpg",

        breakfastVideo:
            "https://www.youtube.com/shorts/g8LE5vF-_J8",

        lunchVideo:
            "https://www.youtube.com/watch?v=toQIeHQ_FPE",

        dinnerVideo:
            "https://www.youtube.com/watch?v=wUiPqOmtkwc"
    },


    // ==========================================
    // MEAL PLAN 4
    // ==========================================

    {
        breakfast: "Vegetable omelette with toast",
        lunch: "creamy veggis, herbal rice and panneer",
        dinner: "Vegetable dal with whole wheat roti",

        breakfastImage:
            "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=900&q=85",

        lunchImage:
            "https://naturallynidhi.com/wp-content/uploads/2020/04/TandooriPaneerBowl_Cover.jpg",

        dinnerImage:
            "https://tse1.mm.bing.net/th/id/OIP.2LhppK7Yc97Yldu07kZbJAHaEa?r=0&pid=Api&h=220&P=0",

        breakfastVideo:
            "https://www.youtube.com/watch?v=I5Kavhsv1kc",

        lunchVideo:
            "https://www.youtube.com/results?search_query=grilled+chicken+rice+vegetables+recipe",

        dinnerVideo:
            "https://www.youtube.com/watch?v=k0Y4HjghVv8&t=4s"
    },


    // ==========================================
    // MEAL PLAN 5
    // ==========================================

    {
        breakfast: "Banana-chocolate almond oatmeal",
        lunch: "Paneer rice bowl with vegetables",
        dinner: "Moong Dal khichdi with curd and salad",

        breakfastImage:
            "https://i.pinimg.com/originals/3d/06/4a/3d064af20be97405cf522e8a38749c18.jpg",

        lunchImage:
            "https://tse1.mm.bing.net/th/id/OIP.jZN9crgmh9f3zzdfAHtaHAHaE7?r=0&pid=Api&h=220&P=0",

        dinnerImage:
            "https://www.flavourstreat.com/wp-content/uploads/2020/08/dal-khichdi-recipe-05.jpg",

        breakfastVideo:
            "http://youtube.com/shorts/R8fJnDPRz2o",

        lunchVideo:
            "https://www.youtube.com/shorts/F9A8pJjlq1g",

        dinnerVideo:
            "https://www.youtube.com/watch?v=kt7MVTjbl4A"
    }

];


// ==========================================
// CURRENT PLAN
// ==========================================

let currentMealPlanIndex = 0;

// ==========================================
// CURRENT LOGGED-IN USER
// ==========================================

let currentUserId = null;


// ==========================================
// LOAD CURRENT USER FROM FLASK SESSION
// ==========================================

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


        // This is the SAME MongoDB _id
        // that the Flask backend uses as user_id.

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


    return `${key}_${currentUserId}`;

}

// ==========================================
// FOOD CARD BACKGROUND IMAGES
// ==========================================

function applyMealCardBackgrounds(mealPlan) {

    const breakfastCard =
        document.getElementById("breakfastCard");

    const lunchCard =
        document.getElementById("lunchCard");

    const dinnerCard =
        document.getElementById("dinnerCard");


    if (breakfastCard && mealPlan.breakfastImage) {

        breakfastCard.style.backgroundImage =
            `url("${mealPlan.breakfastImage}")`;

    }


    if (lunchCard && mealPlan.lunchImage) {

        lunchCard.style.backgroundImage =
            `url("${mealPlan.lunchImage}")`;

    }


    if (dinnerCard && mealPlan.dinnerImage) {

        dinnerCard.style.backgroundImage =
            `url("${mealPlan.dinnerImage}")`;

    }

}


// ==========================================
// YOUTUBE VIDEO LINKS
// ==========================================

function applyMealVideoLinks(mealPlan) {

    const breakfastCard =
        document.getElementById("breakfastCard");

    const lunchCard =
        document.getElementById("lunchCard");

    const dinnerCard =
        document.getElementById("dinnerCard");


    if (breakfastCard) {

        breakfastCard.onclick = function () {

            if (mealPlan.breakfastVideo) {

                window.open(
                    mealPlan.breakfastVideo,
                    "_blank"
                );

            }

        };

    }


    if (lunchCard) {

        lunchCard.onclick = function () {

            if (mealPlan.lunchVideo) {

                window.open(
                    mealPlan.lunchVideo,
                    "_blank"
                );

            }

        };

    }


    if (dinnerCard) {

        dinnerCard.onclick = function () {

            if (mealPlan.dinnerVideo) {

                window.open(
                    mealPlan.dinnerVideo,
                    "_blank"
                );

            }

        };

    }

}


// ==========================================
// DOM ELEMENTS
// ==========================================

const originalWeightInput =
    document.getElementById("originalWeight");

const targetWeightInput =
    document.getElementById("targetWeight");

const allergiesInput =
    document.getElementById("allergies");

const calculateWeeksButton =
    document.getElementById("calculateWeeksBtn");

const estimateSection =
    document.getElementById("estimateSection");

const estimateMessage =
    document.getElementById("estimateMessage");

const estimatedWeeksElement =
    document.getElementById("estimatedWeeks");

const recommendButton =
    document.getElementById("recommendBtn");

const recommendMessage =
    document.getElementById("recommendMessage");

const mealPlanSection =
    document.getElementById("mealPlanSection");

const recommendAgainButton =
    document.getElementById("recommendAgainBtn");

const completeMealButton =
    document.getElementById("completeMealButton");

const mealCompletionMessage =
    document.getElementById("mealCompletionMessage");


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


        loadSavedMealPlan();

        checkMealCompletion();

    }
);


// ==========================================
// CALCULATE WEEKS BUTTON
// ==========================================

if (calculateWeeksButton) {
    calculateWeeksButton.addEventListener("click", function () {
        calculateEstimatedWeeks();
    });
}

// ==========================================
// CALCULATE ESTIMATED WEEKS
// ==========================================

function calculateEstimatedWeeks() {
    const originalWeight = Number(originalWeightInput?.value);
    const targetWeight = Number(targetWeightInput?.value);
    const allergies = allergiesInput
        ? allergiesInput.value.trim()
        : "";

    if (
        !originalWeightInput.value.trim() ||
        !targetWeightInput.value.trim()
    ) {
        alert("Please enter your original weight and target weight.");
        return;
    }

    if (
        !Number.isFinite(originalWeight) ||
        !Number.isFinite(targetWeight) ||
        originalWeight <= 0 ||
        targetWeight <= 0
    ) {
        alert("Please enter valid weight values.");
        return;
    }

    // If the target weight is already reached
    if (originalWeight === targetWeight) {
        if (estimatedWeeksElement) {
            estimatedWeeksElement.textContent = "0";
        }

        if (estimateMessage) {
            estimateMessage.textContent =
                "You've reached your target weight! Your plan can focus on maintaining it.";
        }

        saveMealWeightDetails({
            originalWeight,
            targetWeight,
            allergies: allergies || "None",
            estimatedWeeks: 0
        });

        showMealEstimate();
        return;
    }

    // Illustrative planning rate, not a guaranteed result
    const assumedKgPerWeek = 0.5;

    const weightDifference = Math.abs(
        originalWeight - targetWeight
    );

    const estimatedWeeks = Math.ceil(
        weightDifference / assumedKgPerWeek
    );

    if (estimatedWeeksElement) {
        estimatedWeeksElement.textContent = estimatedWeeks;
    }

    if (estimateMessage) {
        if (originalWeight > targetWeight) {
            estimateMessage.textContent =
                "This is an approximate timeline for working toward your target through gradual weight loss.";
        } else {
            estimateMessage.textContent =
                "This is an approximate timeline for working toward your target through gradual weight gain.";
        }
    }

    saveMealWeightDetails({
        originalWeight,
        targetWeight,
        allergies: allergies || "None",
        estimatedWeeks
    });

    showMealEstimate();
}

// ==========================================
// SAVE WEIGHT DETAILS
// ==========================================

function saveMealWeightDetails(mealDetails) {
    const mealStorageKey = getUserStorageKey(
        "nutriTrackMealDetails"
    );

    if (mealStorageKey) {
        const previousData = JSON.parse(
            localStorage.getItem(mealStorageKey) || "{}"
        );

        localStorage.setItem(
            mealStorageKey,
            JSON.stringify({
                ...previousData,
                ...mealDetails
            })
        );
    }

    currentMealPlanIndex = 0;
}

// ==========================================
// SHOW ESTIMATE SECTION
// ==========================================

function showMealEstimate() {
    if (estimateSection) {
        estimateSection.classList.remove("hidden");
    }

    if (recommendMessage) {
        recommendMessage.classList.remove("hidden");
    }

    if (estimateSection) {
        setTimeout(function () {
            estimateSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 100);
    }
}


// ==========================================
// RECOMMEND BUTTON
// ==========================================

if (recommendButton) {

    recommendButton.addEventListener(
        "click",
        function () {

            showRecommendedMealPlan();

        }
    );

}


// ==========================================
// SHOW RECOMMENDED MEAL PLAN
// ==========================================

async function showRecommendedMealPlan() {

    let savedDetails = null;


    try {

        const mealStorageKey =
            getUserStorageKey(
                "nutriTrackMealDetails"
            );


        const savedData =
            mealStorageKey
               ? localStorage.getItem(
                    mealStorageKey
                )
                : null;


        if (savedData) {

            savedDetails =
                JSON.parse(savedData);

        }

    }

    catch (error) {

        console.error(
            "Unable to read saved meal details:",
            error
        );

    }


    // ==========================================
    // CHECK DETAILS
    // ==========================================

    if (!savedDetails) {

        alert(
            "Please enter your weight details first."
        );

        return;

    }


    // ==========================================
    // SELECT CURRENT MEAL PLAN
    // ==========================================

    const mealPlan =
        mealPlans[currentMealPlanIndex];


    // ==========================================
    // APPLY IMAGE
    // ==========================================

    applyMealCardBackgrounds(
        mealPlan
    );


    // ==========================================
    // APPLY VIDEO LINKS
    // ==========================================

    applyMealVideoLinks(
        mealPlan
    );


    // ==========================================
    // GET DISPLAY ELEMENTS
    // ==========================================

    const breakfastName =
        document.getElementById(
            "breakfastName"
        );


    const breakfastDescription =
        document.getElementById(
            "breakfastDescription"
        );


    const lunchName =
        document.getElementById(
            "lunchName"
        );


    const lunchDescription =
        document.getElementById(
            "lunchDescription"
        );


    const dinnerName =
        document.getElementById(
            "dinnerName"
        );


    const dinnerDescription =
        document.getElementById(
            "dinnerDescription"
        );


    // ==========================================
    // BREAKFAST
    // ==========================================

    if (breakfastName) {

        breakfastName.textContent =
            "Healthy Breakfast";

    }


    if (breakfastDescription) {

        breakfastDescription.textContent =
            mealPlan.breakfast;

    }


    // ==========================================
    // LUNCH
    // ==========================================

    if (lunchName) {

        lunchName.textContent =
            "Healthy Lunch";

    }


    if (lunchDescription) {

        lunchDescription.textContent =
            mealPlan.lunch;

    }


    // ==========================================
    // DINNER
    // ==========================================

    if (dinnerName) {

        dinnerName.textContent =
            "Healthy Dinner";

    }


    if (dinnerDescription) {

        dinnerDescription.textContent =
            mealPlan.dinner;

    }


    // ==========================================
    // CREATE COMPLETE MEAL DETAILS
    // ==========================================

    const completeMealDetails = {

        originalWeight:
            savedDetails.originalWeight,

        targetWeight:
            savedDetails.targetWeight,

        allergies:
            savedDetails.allergies ||
            "None",

        estimatedWeeks:
            savedDetails.estimatedWeeks,

        breakfast:
            mealPlan.breakfast,

        lunch:
            mealPlan.lunch,

        dinner:
            mealPlan.dinner,

        breakfastImage:
            mealPlan.breakfastImage,

        lunchImage:
            mealPlan.lunchImage,

        dinnerImage:
            mealPlan.dinnerImage,

        createdAt:
            new Date().toISOString()

    };


    // ==========================================
    // SAVE LOCALLY
    // ==========================================

    const mealStorageKey =
    getUserStorageKey(
        "nutriTrackMealDetails"
    );


    if (mealStorageKey) {

        localStorage.setItem(
            mealStorageKey,
            JSON.stringify(
               completeMealDetails
            )
        );

    }

    // ==========================================
    // SHOW MEAL PLAN
    // ==========================================

    if (mealPlanSection) {

        mealPlanSection.classList.remove(
            "hidden"
        );

    }


    // ==========================================
    // SCROLL TO MEAL PLAN
    // ==========================================

    if (mealPlanSection) {

        setTimeout(
            function () {

                mealPlanSection.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            },
            100
        );

    }


    // ==========================================
    // SAVE TO DATABASE
    // ==========================================

    await saveMealPlanToDatabase(
        completeMealDetails
    );

}


// ==========================================
// SAVE MEAL PLAN TO DATABASE
// ==========================================

async function saveMealPlanToDatabase(
    mealDetails
) {

    try {

        const response =
            await fetch(
                "/api/meal-plans",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        original_weight:
                            mealDetails.originalWeight,

                        target_weight:
                            mealDetails.targetWeight,

                        allergies:
                            mealDetails.allergies,

                        estimated_weeks:
                            mealDetails.estimatedWeeks,

                        breakfast:
                            mealDetails.breakfast,

                        lunch:
                            mealDetails.lunch,

                        dinner:
                            mealDetails.dinner,

                        created_at:
                            mealDetails.createdAt

                    })

                }
            );


        // ==========================================
        // LOGIN REQUIRED
        // ==========================================

        if (response.status === 401) {

            window.location.href =
                "/login";

            return;

        }


        const data =
            await response.json()
                .catch(
                    function () {

                        return {};

                    }
                );


        // ==========================================
        // ERROR
        // ==========================================

        if (
            !response.ok ||
            data.success === false
        ) {

            console.error(
                "Meal plan database error:",
                data.message ||
                "Unable to save meal plan."
            );

            return;

        }


        console.log(
            "Meal plan saved successfully:",
            data
        );

    }

    catch (error) {

        console.error(
            "Meal plan API error:",
            error
        );

    }

}


// ==========================================
// RECOMMEND AGAIN
// ==========================================

if (recommendAgainButton) {

    recommendAgainButton.addEventListener(
        "click",
        async function () {

            let savedDetails = null;


            try {

                const mealStorageKey =
                    getUserStorageKey(
                        "nutriTrackMealDetails"
                    );


                const savedData =
                    mealStorageKey
                        ? localStorage.getItem(
                            mealStorageKey
                        )
                        : null;


                if (savedData) {

                    savedDetails =
                        JSON.parse(savedData);

                }

            }

            catch (error) {

                console.error(
                    "Saved meal data error:",
                    error
                );

            }


            // ==========================================
            // CHECK DETAILS
            // ==========================================

            if (!savedDetails) {

                alert(
                    "Please enter your details first."
                );

                return;

            }


            // ==========================================
            // MOVE TO NEXT PLAN
            // ==========================================

            currentMealPlanIndex++;


            if (
                currentMealPlanIndex >=
                mealPlans.length
            ) {

                currentMealPlanIndex = 0;

            }


            // ==========================================
            // SELECT NEW MEAL PLAN
            // ==========================================

            const mealPlan =
                mealPlans[currentMealPlanIndex];


            // ==========================================
            // APPLY NEW IMAGES
            // ==========================================

            applyMealCardBackgrounds(
                mealPlan
            );


            // ==========================================
            // APPLY NEW VIDEO LINKS
            // ==========================================

            applyMealVideoLinks(
                mealPlan
            );


            // ==========================================
            // GET DISPLAY ELEMENTS
            // ==========================================

            const breakfastDescription =
                document.getElementById(
                    "breakfastDescription"
                );


            const lunchDescription =
                document.getElementById(
                    "lunchDescription"
                );


            const dinnerDescription =
                document.getElementById(
                    "dinnerDescription"
                );


            // ==========================================
            // UPDATE BREAKFAST
            // ==========================================

            if (breakfastDescription) {

                breakfastDescription.textContent =
                    mealPlan.breakfast;

            }


            // ==========================================
            // UPDATE LUNCH
            // ==========================================

            if (lunchDescription) {

                lunchDescription.textContent =
                    mealPlan.lunch;

            }


            // ==========================================
            // UPDATE DINNER
            // ==========================================

            if (dinnerDescription) {

                dinnerDescription.textContent =
                    mealPlan.dinner;

            }


            // ==========================================
            // CREATE NEW DETAILS
            // ==========================================

            const newMealDetails = {

                originalWeight:
                    savedDetails.originalWeight,

                targetWeight:
                    savedDetails.targetWeight,

                allergies:
                    savedDetails.allergies ||
                    "None",

                estimatedWeeks:
                    savedDetails.estimatedWeeks,

                breakfast:
                    mealPlan.breakfast,

                lunch:
                    mealPlan.lunch,

                dinner:
                    mealPlan.dinner,

                breakfastImage:
                    mealPlan.breakfastImage,

                lunchImage:
                    mealPlan.lunchImage,

                dinnerImage:
                    mealPlan.dinnerImage,

                createdAt:
                    new Date().toISOString()

            };


            // ==========================================
            // SAVE LOCALLY
            // ==========================================

            const mealStorageKey =
                getUserStorageKey(
                   "nutriTrackMealDetails"
                );

 
            if (mealStorageKey) {

               localStorage.setItem(
               mealStorageKey,
                   JSON.stringify(
                        newMealDetails
                    )
                );
            }


            // ==========================================
            // SAVE TO DATABASE
            // ==========================================

            await saveMealPlanToDatabase(
                newMealDetails
            );

        }
    );

}


// ==========================================
// LOAD SAVED MEAL PLAN
// ==========================================

function loadSavedMealPlan() {

    try {

        const mealStorageKey =
            getUserStorageKey(
                "nutriTrackMealDetails"
            );


        const savedData =
            mealStorageKey
                ? localStorage.getItem(
                    mealStorageKey
                )
                : null;


        if (!savedData) {

            return;

        }


        const mealDetails =
            JSON.parse(savedData);


        // ==========================================
        // RESTORE INPUTS
        // ==========================================

        if (
            originalWeightInput &&
            mealDetails.originalWeight
        ) {

            originalWeightInput.value =
                mealDetails.originalWeight;

        }


        if (
            targetWeightInput &&
            mealDetails.targetWeight
        ) {

            targetWeightInput.value =
                mealDetails.targetWeight;

        }


        if (allergiesInput) {

            allergiesInput.value =
                mealDetails.allergies === "None"
                    ? ""
                    : mealDetails.allergies || "";

        }


        // ==========================================
        // RESTORE ESTIMATED DAYS
        // ==========================================

        if (
            mealDetails.estimatedWeeks &&
            estimateSection
        ) {

            if (estimatedWeeksElement) {

                estimatedDaysElement.textContent =
                    mealDetails.estimatedWeeks;

            }


            if (estimateMessage) {

                estimateMessage.textContent =
                    "Based on your saved weight goal, this is your estimated journey.";

            }


            estimateSection.classList.remove(
                "hidden"
            );

        }


        // ==========================================
        // RESTORE SAVED MEAL PLAN
        // ==========================================

        if (
            mealDetails.breakfast &&
            mealDetails.lunch &&
            mealDetails.dinner
        ) {

            const breakfastDescription =
                document.getElementById(
                    "breakfastDescription"
                );


            const lunchDescription =
                document.getElementById(
                    "lunchDescription"
                );


            const dinnerDescription =
                document.getElementById(
                    "dinnerDescription"
                );


            if (breakfastDescription) {

                breakfastDescription.textContent =
                    mealDetails.breakfast;

            }


            if (lunchDescription) {

                lunchDescription.textContent =
                    mealDetails.lunch;

            }


            if (dinnerDescription) {

                dinnerDescription.textContent =
                    mealDetails.dinner;

            }


            // ==========================================
            // RESTORE SAVED IMAGES
            // ==========================================

            if (
                mealDetails.breakfastImage ||
                mealDetails.lunchImage ||
                mealDetails.dinnerImage
            ) {

                applyMealCardBackgrounds({

                    breakfastImage:
                        mealDetails.breakfastImage,

                    lunchImage:
                        mealDetails.lunchImage,

                    dinnerImage:
                        mealDetails.dinnerImage

                });

            }


            if (mealPlanSection) {

                mealPlanSection.classList.remove(
                    "hidden"
                );

            }

        }

    }

    catch (error) {

        console.error(
            "Unable to load saved meal plan:",
            error
        );

    }

}


// ==========================================
// CHECK TODAY'S MEAL COMPLETION
// ==========================================

async function checkMealCompletion() {

    if (!completeMealButton) {

        return;

    }


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
            (data.progress || [])
                .some(
                    function (record) {

                        return (

                            record.status ===
                                "completed" &&

                            record.completion_type ===
                                "meal" &&

                            record.completion_date ===
                                today

                        );

                    }
                );


        if (completed) {

            setMealCompleted();

        }

    }

    catch (error) {

        console.warn(
            "Could not check meal completion:",
            error
        );

    }

}


// ==========================================
// SET MEAL AS COMPLETED
// ==========================================

function setMealCompleted() {

    if (!completeMealButton) {

        return;

    }


    completeMealButton.textContent =
        "✓ Completed Today";


    completeMealButton.disabled =
        true;


    completeMealButton.classList.add(
        "completed"
    );


    if (mealCompletionMessage) {

        mealCompletionMessage.textContent =
            "Your meal plan has been completed for today.";


        mealCompletionMessage.className =
            "completion-message success";

    }

}


// ==========================================
// COMPLETE MEAL PLAN
// ==========================================

async function completeMealPlan() {

    if (!completeMealButton) {

        return;

    }


    completeMealButton.disabled =
        true;


    try {

        const mealStorageKey =
            getUserStorageKey(
                "nutriTrackMealDetails"
            );


        const mealDetails =
            JSON.parse(
                mealStorageKey
                ? (
                   localStorage.getItem(
                        mealStorageKey
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
                                "meal",

                            plan_name:
                                "Daily Meal Plan",

                            plan_id:
                                mealDetails.plan_id ||
                                null

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

            setMealCompleted();

            return;

        }


        completeMealButton.disabled =
            false;


        if (mealCompletionMessage) {

            mealCompletionMessage.textContent =
                data.message ||
                "Unable to complete the meal plan.";


            mealCompletionMessage.className =
                "completion-message info";

        }

    }

    catch (error) {

        console.error(
            "Meal completion error:",
            error
        );


        completeMealButton.disabled =
            false;


        if (mealCompletionMessage) {

            mealCompletionMessage.textContent =
                "Something went wrong. Please try again.";


            mealCompletionMessage.className =
                "completion-message info";

        }

    }

}


// ==========================================
// MEAL COMPLETION BUTTON
// ==========================================

if (completeMealButton) {

    completeMealButton.addEventListener(
        "click",
        completeMealPlan
    );

}