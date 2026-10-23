// ==========================================
// NUTRITRACK - PROFILE
// Loads, displays and edits profile data
// from Flask + MongoDB
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==================================================
    // GET ELEMENT
    // ==================================================

    function getElement(id) {
        return document.getElementById(id);
    }


    // ==================================================
    // LOCAL USER
    // ==================================================

    function getLocalUser() {

        try {

            const savedUser =
                localStorage.getItem("nutriTrackUser");

            if (savedUser) {
                return JSON.parse(savedUser);
            }

        } catch (error) {

            console.warn(
                "Could not read saved user data.",
                error
            );

        }

        return {};

    }


    // ==================================================
    // LOCAL QUESTIONNAIRE
    // ==================================================

    function getLocalQuestionnaire() {

        try {

            const savedQuestionnaire =
                localStorage.getItem(
                    "nutriTrackQuestionnaire"
                );

            if (savedQuestionnaire) {

                return JSON.parse(
                    savedQuestionnaire
                );

            }

        } catch (error) {

            console.warn(
                "Could not read questionnaire data.",
                error
            );

        }

        return {};

    }


    // ==================================================
    // GET QUESTIONNAIRE VALUE
    // ==================================================

    function getQuestionnaireValue(
        questionnaire,
        possibleNames
    ) {

        for (
            let i = 0;
            i < possibleNames.length;
            i++
        ) {

            const name =
                possibleNames[i];

            if (
                questionnaire[name] !== undefined &&
                questionnaire[name] !== null &&
                questionnaire[name] !== ""
            ) {

                return questionnaire[name];

            }

        }

        return "";

    }


    // ==================================================
    // FORMAT VALUE
    // ==================================================

    function formatValue(value) {

        if (Array.isArray(value)) {

            return value.join(", ");

        }

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "Not available";

        }

        return String(value);

    }


    // ==================================================
    // SET TEXT
    // ==================================================

    function setText(id, value) {

        const element =
            getElement(id);

        if (element) {

            element.textContent =
                formatValue(value);

        }

    }


    // ==================================================
    // DISPLAY PROFILE
    // ==================================================

    function displayProfile(
        user,
        questionnaire
    ) {

        user =
            user || {};

        questionnaire =
            questionnaire || {};


        console.log(
            "Profile user data:",
            user
        );

        console.log(
            "Profile questionnaire data:",
            questionnaire
        );


        // ==================================================
        // USER INFORMATION
        // ==================================================

        const name =
            user.name ||
            user.full_name ||
            user.fullName ||
            "NutriTrack User";


        const username =
            user.username ||
            "Not available";


        const email =
            user.email ||
            "Not available";


        setText(
            "profileName",
            name
        );


        setText(
            "profileUsername",
            username
                ? `@${username}`
                : "Not available"
        );


        setText(
            "profileFullName",
            name
        );


        setText(
            "profileUserName",
            username
        );


        setText(
            "profileEmail",
            email
        );


        // ==================================================
        // AVATAR
        // ==================================================

        const avatar =
            document.querySelector(
                ".profile-avatar"
            );


        if (avatar) {

            const firstLetter =
                name
                    .trim()
                    .charAt(0)
                    .toUpperCase();


            avatar.textContent =
                firstLetter || "U";

        }


        // ==================================================
        // BODY INFORMATION
        // ==================================================

        const age =
            getQuestionnaireValue(
                questionnaire,
                ["age"]
            );


        const height =
            getQuestionnaireValue(
                questionnaire,
                ["height"]
            );


        const currentWeight =
            getQuestionnaireValue(
                questionnaire,
                [
                    "weight",
                    "currentWeight",
                    "current_weight"
                ]
            );


        const targetWeight =
            getQuestionnaireValue(
                questionnaire,
                [
                    "target_weight",
                    "targetWeight",
                    "target_weight_kg"
                ]
            );


        setText(
            "profileAge",
            age
                ? `${age} years`
                : "Not available"
        );


        setText(
            "profileHeight",
            height
                ? `${height} cm`
                : "Not available"
        );


        setText(
            "profileWeight",
            currentWeight
                ? `${currentWeight} kg`
                : "Not available"
        );


        setText(
            "profileTargetWeight",
            targetWeight
                ? `${targetWeight} kg`
                : "Not available"
        );


        // ==================================================
        // FITNESS INFORMATION
        // ==================================================

        const fitnessGoals =
            getQuestionnaireValue(
                questionnaire,
                [
                    "main_fitness_goal",
                    "mainFitnessGoal",
                    "main_fitness_goals",
                    "mainFitnessGoals",
                    "fitnessGoals",
                    "fitnessGoal"
                ]
            );


        const exerciseFrequency =
            getQuestionnaireValue(
                questionnaire,
                [
                    "exercise_frequency",
                    "exerciseFrequency"
                ]
            );


        const sleepHours =
            getQuestionnaireValue(
                questionnaire,
                [
                    "sleep_hours",
                    "sleepHours"
                ]
            );


        const allergies =
            getQuestionnaireValue(
                questionnaire,
                [
                    "allergies",
                    "allergy"
                ]
            );


        setText(
            "profileGoal",
            fitnessGoals
        );


        setText(
            "profileExercise",
            exerciseFrequency
        );


        setText(
            "profileSleep",
            sleepHours
                ? `${sleepHours} hours`
                : "Not available"
        );


        if (
            allergies &&
            (
                Array.isArray(allergies)
                    ? allergies.length > 0
                    : String(allergies).trim() !== ""
            )
        ) {

            setText(
                "profileAllergies",
                allergies
            );

        } else {

            setText(
                "profileAllergies",
                "None specified"
            );

        }

    }


    // ==================================================
    // LOAD PROFILE FROM DATABASE
    // ==================================================

    async function loadProfileFromAPI() {

        try {

            const response =
                await fetch(
                    "/api/user/profile",
                    {
                        method: "GET",
                        credentials: "same-origin"
                    }
                );


            if (response.status === 401) {

                window.location.href =
                    "/login";

                return false;

            }


            const data =
                await response.json();


            console.log(
                "Profile API response:",
                data
            );


            if (
                response.ok &&
                data.success
            ) {

                const user =
                    data.user || {};


                const questionnaire =
                    data.questionnaire ||
                    user.questionnaire ||
                    {};


                localStorage.setItem(
                    "nutriTrackUser",
                    JSON.stringify({
                        name:
                            user.name ||
                            user.full_name ||
                            "",
                        username:
                            user.username ||
                            "",
                        email:
                            user.email ||
                            ""
                    })
                );


                localStorage.setItem(
                    "nutriTrackQuestionnaire",
                    JSON.stringify(
                        questionnaire
                    )
                );


                displayProfile(
                    user,
                    questionnaire
                );


                return true;

            }


            console.warn(
                "Could not load profile:",
                data.message
            );

        } catch (error) {

            console.error(
                "Profile API error:",
                error
            );

        }


        return false;

    }


    // ==================================================
    // CREATE EDIT FORM
    // ==================================================

    function createEditForm() {

        const user =
            getLocalUser();


        const questionnaire =
            getLocalQuestionnaire();


        const name =
            user.name || "";


        const username =
            user.username || "";


        const email =
            user.email || "";


        const age =
            getQuestionnaireValue(
                questionnaire,
                ["age"]
            );


        const height =
            getQuestionnaireValue(
                questionnaire,
                ["height"]
            );


        const weight =
            getQuestionnaireValue(
                questionnaire,
                [
                    "weight",
                    "currentWeight",
                    "current_weight"
                ]
            );


        const targetWeight =
            getQuestionnaireValue(
                questionnaire,
                [
                    "target_weight",
                    "targetWeight",
                    "target_weight_kg"
                ]
            );


        const fitnessGoal =
            getQuestionnaireValue(
                questionnaire,
                [
                    "main_fitness_goal",
                    "mainFitnessGoal",
                    "main_fitness_goals",
                    "fitnessGoals",
                    "fitnessGoal"
                ]
            );


        const exerciseFrequency =
            getQuestionnaireValue(
                questionnaire,
                [
                    "exercise_frequency",
                    "exerciseFrequency"
                ]
            );


        const sleepHours =
            getQuestionnaireValue(
                questionnaire,
                [
                    "sleep_hours",
                    "sleepHours"
                ]
            );


        let allergies =
            getQuestionnaireValue(
                questionnaire,
                [
                    "allergies",
                    "allergy"
                ]
            );


        if (Array.isArray(allergies)) {

            allergies =
                allergies.join(", ");

        }


        const profileSections =
            document.querySelectorAll(
                ".profile-section"
            );


        profileSections.forEach(function (section) {

            section.style.display =
                "none";

        });


        const profileMainCard =
            document.querySelector(
                ".profile-main-card"
            );


        if (profileMainCard) {

            profileMainCard.style.display =
                "none";

        }


        const profileActions =
            document.querySelector(
                ".profile-actions"
            );


        if (profileActions) {

            profileActions.style.display =
                "none";

        }


        const existingForm =
            document.getElementById(
                "profileEditForm"
            );


        if (existingForm) {

            existingForm.remove();

        }


        const form =
            document.createElement("div");


        form.id =
            "profileEditForm";


        form.className =
            "profile-edit-form";


        form.innerHTML = `

            <div class="profile-section">

                <div class="profile-section-title">

                    <div class="profile-title-icon">
                        ✏️
                    </div>

                    <div>

                        <h2>Edit Profile</h2>

                        <p>
                            Update your personal and fitness information.
                        </p>

                    </div>

                </div>


                <div class="profile-info-grid">


                    <div class="profile-info-card">

                        <label class="profile-label">
                            Full Name
                        </label>

                        <input
                            type="text"
                            id="editName"
                            value="${escapeHTML(name)}"
                        >

                    </div>


                    <div class="profile-info-card">

                        <label class="profile-label">
                            Username
                        </label>

                        <input
                            type="text"
                            id="editUsername"
                            value="${escapeHTML(username)}"
                        >

                    </div>


                    <div class="profile-info-card">

                        <label class="profile-label">
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="editEmail"
                            value="${escapeHTML(email)}"
                        >

                    </div>


                    <div class="profile-info-card">

                        <label class="profile-label">
                            Age
                        </label>

                        <input
                            type="number"
                            id="editAge"
                            min="1"
                            max="120"
                            value="${escapeHTML(age)}"
                        >

                    </div>


                    <div class="profile-info-card">

                        <label class="profile-label">
                            Height (cm)
                        </label>

                        <input
                            type="number"
                            id="editHeight"
                            min="50"
                            max="250"
                            value="${escapeHTML(height)}"
                        >

                    </div>


                    <div class="profile-info-card">

                        <label class="profile-label">
                            Current Weight (kg)
                        </label>

                        <input
                            type="number"
                            id="editWeight"
                            min="20"
                            max="300"
                            step="0.1"
                            value="${escapeHTML(weight)}"
                        >

                    </div>


                    <div class="profile-info-card">

                        <label class="profile-label">
                            Target Weight (kg)
                        </label>

                        <input
                            type="number"
                            id="editTargetWeight"
                            min="20"
                            max="300"
                            step="0.1"
                            value="${escapeHTML(targetWeight)}"
                        >

                    </div>


                    <div class="profile-info-card">

                        <label class="profile-label">
                            Main Fitness Goal
                        </label>

                        <select id="editFitnessGoal">

                            <option value="">
                                Select goal
                            </option>

                            <option value="Lose Weight">
                                Lose Weight
                            </option>

                            <option value="Build Muscle">
                                Build Muscle
                            </option>

                            <option value="Maintain Weight">
                                Maintain Weight
                            </option>

                            <option value="Improve Fitness">
                                Improve Fitness
                            </option>

                            <option value="Improve Endurance">
                                Improve Endurance
                            </option>

                        </select>

                    </div>


                    <div class="profile-info-card">

                        <label class="profile-label">
                            Exercise Frequency
                        </label>

                        <select id="editExerciseFrequency">

                            <option value="">
                                Select frequency
                            </option>

                            <option value="Never">
                                Never
                            </option>

                            <option value="1-2 days per week">
                                1-2 days per week
                            </option>

                            <option value="3-4 days per week">
                                3-4 days per week
                            </option>

                            <option value="5-6 days per week">
                                5-6 days per week
                            </option>

                            <option value="Every day">
                                Every day
                            </option>

                        </select>

                    </div>


                    <div class="profile-info-card">

                        <label class="profile-label">
                            Sleep Duration (hours)
                        </label>

                        <input
                            type="number"
                            id="editSleepHours"
                            min="1"
                            max="24"
                            step="0.5"
                            value="${escapeHTML(sleepHours)}"
                        >

                    </div>


                    <div class="profile-info-card profile-wide-card">

                        <label class="profile-label">
                            Allergies
                        </label>

                        <input
                            type="text"
                            id="editAllergies"
                            placeholder="Example: Dairy, Nuts"
                            value="${escapeHTML(allergies)}"
                        >

                        <small>
                            Separate multiple allergies with commas.
                        </small>

                    </div>


                </div>


                <div class="profile-edit-actions">

                    <button
                        type="button"
                        class="profile-save-button"
                        id="saveProfileButton"
                    >
                        💾 Save Changes
                    </button>


                    <button
                        type="button"
                        class="profile-cancel-button"
                        id="cancelProfileButton"
                    >
                        ✕ Cancel
                    </button>

                </div>

            </div>

        `;


        const featurePage =
            document.querySelector(
                ".feature-page"
            );


        const footer =
            document.querySelector(
                ".feature-page-footer"
            );


        if (footer) {

            featurePage.insertBefore(
                form,
                footer
            );

        } else {

            featurePage.appendChild(
                form
            );

        }


        // Set existing goal

        const goalSelect =
            getElement(
                "editFitnessGoal"
            );


        if (goalSelect) {

            goalSelect.value =
                fitnessGoal;

        }


        // Set existing exercise frequency

        const exerciseSelect =
            getElement(
                "editExerciseFrequency"
            );


        if (exerciseSelect) {

            exerciseSelect.value =
                exerciseFrequency;

        }


        // Save

        const saveButton =
            getElement(
                "saveProfileButton"
            );


        if (saveButton) {

            saveButton.addEventListener(
                "click",
                saveEditedProfile
            );

        }


        // Cancel

        const cancelButton =
            getElement(
                "cancelProfileButton"
            );


        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                cancelEdit
            );

        }

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
    // SAVE EDITED PROFILE
    // ==================================================

    async function saveEditedProfile() {

        const saveButton =
            getElement(
                "saveProfileButton"
            );


        if (saveButton) {

            saveButton.disabled =
                true;

            saveButton.textContent =
                "Saving...";

        }


        // ----------------------------------------------
        // GET VALUES
        // ----------------------------------------------

        const name =
            getElement("editName").value.trim();


        const username =
            getElement("editUsername").value.trim();


        const email =
            getElement("editEmail").value.trim();


        const age =
            getElement("editAge").value;


        const height =
            getElement("editHeight").value;


        const weight =
            getElement("editWeight").value;


        const targetWeight =
            getElement("editTargetWeight").value;


        const fitnessGoal =
            getElement("editFitnessGoal").value;


        const exerciseFrequency =
            getElement("editExerciseFrequency").value;


        const sleepHours =
            getElement("editSleepHours").value;


        const allergiesText =
            getElement("editAllergies").value.trim();


        // ----------------------------------------------
        // BASIC VALIDATION
        // ----------------------------------------------

        if (!name || !username || !email) {

            alert(
                "Name, username and email are required."
            );

            restoreSaveButton();

            return;

        }


        // ----------------------------------------------
        // ALLERGIES
        // ----------------------------------------------

        let allergies = [];


        if (allergiesText) {

            allergies =
                allergiesText
                    .split(",")
                    .map(function (item) {
                        return item.trim();
                    })
                    .filter(function (item) {
                        return item !== "";
                    });

        }


        // ----------------------------------------------
        // DATA TO SEND
        // ----------------------------------------------

        const updatedData = {

            name: name,

            username: username,

            email: email,

            age: age
                ? Number(age)
                : "",

            height: height
                ? Number(height)
                : "",

            weight: weight
                ? Number(weight)
                : "",

            target_weight: targetWeight
                ? Number(targetWeight)
                : "",

            main_fitness_goal:
                fitnessGoal,

            exercise_frequency:
                exerciseFrequency,

            sleep_hours: sleepHours
                ? Number(sleepHours)
                : "",

            allergies: allergies

        };


        console.log(
            "Updating profile:",
            updatedData
        );


        // ----------------------------------------------
        // SEND TO FLASK
        // ----------------------------------------------

        try {

            const response =
                await fetch(
                    "/api/user/profile",
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials:
                            "same-origin",

                        body:
                            JSON.stringify(
                                updatedData
                            )

                    }
                );


            if (response.status === 401) {

                window.location.href =
                    "/login";

                return;

            }


            const data =
                await response.json();


            console.log(
                "Update response:",
                data
            );


            if (
                response.ok &&
                data.success
            ) {

                const updatedUser =
                    data.user || {};


                const updatedQuestionnaire =
                    data.questionnaire ||
                    updatedUser.questionnaire ||
                    {};


                // Save locally

                localStorage.setItem(
                    "nutriTrackUser",
                    JSON.stringify({
                        name:
                            updatedUser.name ||
                            name,
                        username:
                            updatedUser.username ||
                            username,
                        email:
                            updatedUser.email ||
                            email
                    })
                );


                localStorage.setItem(
                    "nutriTrackQuestionnaire",
                    JSON.stringify(
                        updatedQuestionnaire
                    )
                );


                // Display updated information

                displayProfile(
                    updatedUser,
                    updatedQuestionnaire
                );


                // Remove edit form

                const editForm =
                    getElement(
                        "profileEditForm"
                    );


                if (editForm) {

                    editForm.remove();

                }


                // Show profile again

                showProfileSections();


                alert(
                    "Profile updated successfully!"
                );


                return;

            }


            alert(
                data.message ||
                "Unable to update profile."
            );


            restoreSaveButton();

        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );


            alert(
                "Unable to update profile. Please try again."
            );


            restoreSaveButton();

        }

    }


    // ==================================================
    // RESTORE SAVE BUTTON
    // ==================================================

    function restoreSaveButton() {

        const saveButton =
            getElement(
                "saveProfileButton"
            );


        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "💾 Save Changes";

        }

    }


    // ==================================================
    // CANCEL EDIT
    // ==================================================

    function cancelEdit() {

        const editForm =
            getElement(
                "profileEditForm"
            );


        if (editForm) {

            editForm.remove();

        }


        showProfileSections();

    }


    // ==================================================
    // SHOW PROFILE SECTIONS
    // ==================================================

    function showProfileSections() {

        const profileSections =
            document.querySelectorAll(
                ".profile-section"
            );


        profileSections.forEach(function (section) {

            section.style.display =
                "";

        });


        const profileMainCard =
            document.querySelector(
                ".profile-main-card"
            );


        if (profileMainCard) {

            profileMainCard.style.display =
                "";

        }


        const profileActions =
            document.querySelector(
                ".profile-actions"
            );


        if (profileActions) {

            profileActions.style.display =
                "";

        }

    }


    // ==================================================
    // EDIT PROFILE
    // ==================================================

    async function editProfile() {

        createEditForm();

    }


    // ==================================================
    // MAKE EDIT PROFILE AVAILABLE TO HTML
    // ==================================================

    window.editProfile =
        editProfile;


    // ==================================================
    // BACK TO DASHBOARD
    // ==================================================

    function goToDashboard() {

        window.location.href =
            "/dashboard";

    }


    window.goToDashboard =
        goToDashboard;


    // ==================================================
    // INITIAL DISPLAY
    // ==================================================

    displayProfile(
        getLocalUser(),
        getLocalQuestionnaire()
    );


    // ==================================================
    // LOAD REAL DATABASE DATA
    // ==================================================

    async function initializeProfile() {

        const profileLoaded =
            await loadProfileFromAPI();


        if (!profileLoaded) {

            console.warn(
                "Could not load profile from database."
            );

        }

    }


    initializeProfile();

});