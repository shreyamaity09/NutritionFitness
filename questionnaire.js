// ==========================================
// NUTRITRACK - QUESTIONNAIRE
// Backend connected with Flask API
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const questionnaireForm =
        document.getElementById("questionnaireForm");

    const steps =
        document.querySelectorAll(".question-step");

    const nextButton =
        document.getElementById("nextButton");

    const backButton =
        document.getElementById("backButton");

    const progressFill =
        document.getElementById("progressFill");

    const currentStepText =
        document.getElementById("currentStep");

    const totalStepsText =
        document.getElementById("totalSteps");

    const questionError =
        document.getElementById("questionError");

    let currentStep = 0;


    // ==========================================
    // INITIAL SETUP
    // ==========================================

    if (totalStepsText) {

        totalStepsText.textContent =
            steps.length;

    }

    showStep(currentStep);


    // ==========================================
    // NEXT BUTTON
    // ==========================================

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            async function () {

                clearQuestionError();


                if (!validateCurrentStep()) {

                    return;

                }


                // Last question
                if (
                    currentStep ===
                    steps.length - 1
                ) {

                    await submitQuestionnaire();

                    return;

                }


                currentStep++;

                showStep(currentStep);

            }
        );

    }


    // ==========================================
    // BACK BUTTON
    // ==========================================

    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                clearQuestionError();


                if (currentStep > 0) {

                    currentStep--;

                    showStep(currentStep);

                }

            }
        );

    }


    // ==========================================
    // SHOW CURRENT STEP
    // ==========================================

    function showStep(stepNumber) {

        steps.forEach(
            function (step, index) {

                if (index === stepNumber) {

                    step.classList.add("active");

                } else {

                    step.classList.remove("active");

                }

            }
        );


        // Current step number

        if (currentStepText) {

            currentStepText.textContent =
                stepNumber + 1;

        }


        // Total steps

        if (totalStepsText) {

            totalStepsText.textContent =
                steps.length;

        }


        // Progress bar

        if (progressFill) {

            const progressPercentage =
                ((stepNumber + 1) /
                steps.length) * 100;

            progressFill.style.width =
                progressPercentage + "%";

        }


        // Back button

        if (backButton) {

            if (stepNumber === 0) {

                backButton.style.visibility =
                    "hidden";

            } else {

                backButton.style.visibility =
                    "visible";

            }

        }


        // Next button

        if (nextButton) {

            if (
                stepNumber ===
                steps.length - 1
            ) {

                nextButton.textContent =
                    "Complete ✓";

            } else {

                nextButton.textContent =
                    "Next →";

            }

        }

    }


    // ==========================================
    // VALIDATE CURRENT QUESTION
    // ==========================================

    function validateCurrentStep() {

        const currentQuestion =
            steps[currentStep];


        if (!currentQuestion) {

            return true;

        }


        // --------------------------------------
        // NUMBER / DATE INPUTS
        // --------------------------------------

        const normalInputs =
            currentQuestion.querySelectorAll(
                "input[type='number'], input[type='date']"
            );


        for (let input of normalInputs) {

            if (!input.value.trim()) {

                showQuestionError(
                    "Please answer this question before continuing."
                );

                input.focus();

                return false;

            }

        }


        // --------------------------------------
        // RADIO BUTTONS
        // --------------------------------------

        const radioButtons =
            currentQuestion.querySelectorAll(
                "input[type='radio']"
            );


        if (radioButtons.length > 0) {

            const radioNames = [];


            radioButtons.forEach(
                function (radio) {

                    if (
                        !radioNames.includes(
                            radio.name
                        )
                    ) {

                        radioNames.push(
                            radio.name
                        );

                    }

                }
            );


            for (let name of radioNames) {

                const selected =
                    currentQuestion.querySelector(
                        "input[name='" +
                        name +
                        "']:checked"
                    );


                if (!selected) {

                    showQuestionError(
                        "Please select an option before continuing."
                    );

                    return false;

                }

            }

        }


        // --------------------------------------
        // CHECKBOXES
        // --------------------------------------

        const checkboxButtons =
            currentQuestion.querySelectorAll(
                "input[type='checkbox']"
            );


        if (checkboxButtons.length > 0) {

            let checkboxSelected =
                false;


            checkboxButtons.forEach(
                function (checkbox) {

                    if (checkbox.checked) {

                        checkboxSelected =
                            true;

                    }

                }
            );


            if (!checkboxSelected) {

                showQuestionError(
                    "Please select at least one option."
                );

                return false;

            }

        }


        return true;

    }


    // ==========================================
    // SHOW ERROR
    // ==========================================

    function showQuestionError(message) {

        if (questionError) {

            questionError.textContent =
                message;

            questionError.style.display =
                "block";

        }

    }


    // ==========================================
    // CLEAR ERROR
    // ==========================================

    function clearQuestionError() {

        if (questionError) {

            questionError.textContent =
                "";

            questionError.style.display =
                "none";

        }

    }


    // ==========================================
    // GET RADIO VALUE
    // ==========================================

    function getSelectedRadioValue(name) {

        const selected =
            document.querySelector(
                "input[name='" +
                name +
                "']:checked"
            );


        if (selected) {

            return selected.value;

        }


        return "";

    }


    // ==========================================
    // GET CHECKBOX VALUES
    // ==========================================

    function getSelectedValues(name) {

        const selected =
            document.querySelectorAll(
                "input[name='" +
                name +
                "']:checked"
            );


        const values = [];


        selected.forEach(
            function (checkbox) {

                values.push(
                    checkbox.value
                );

            }
        );


        return values;

    }


    // ==========================================
    // COLLECT QUESTIONNAIRE DATA
    // ==========================================

    function collectQuestionnaireData() {

        const ageInput =
            document.getElementById("age");

        const heightInput =
            document.getElementById("height");

        const weightInput =
            document.getElementById("weight");

        const dateOfBirthInput =
            document.getElementById("dateOfBirth");


        // --------------------------------------
        // GET ALL ANSWERS
        // --------------------------------------

        const allergies =
            getSelectedValues("allergy");


        const fitnessMeaning =
            getSelectedRadioValue(
                "fitnessMeaning"
            );


        const exerciseImportance =
            getSelectedRadioValue(
                "exerciseImportance"
            );


        const exerciseFrequency =
            getSelectedRadioValue(
                "exerciseFrequency"
            );


        const fitnessGoals =
            getSelectedValues(
                "fitnessGoal"
            );


        const fitnessChallenge =
            getSelectedRadioValue(
                "fitnessChallenge"
            );


        const sleepHours =
            getSelectedRadioValue(
                "sleepHours"
            );


        // --------------------------------------
        // IMPORTANT:
        // Use the SAME field names that
        // Flask user_routes.py expects.
        // --------------------------------------

        return {

            // Basic information

            age:
                ageInput
                    ? ageInput.value
                    : "",

            height:
                heightInput
                    ? heightInput.value
                    : "",

            weight:
                weightInput
                    ? weightInput.value
                    : "",

            date_of_birth:
                dateOfBirthInput
                    ? dateOfBirthInput.value
                    : "",


            // Allergies

            allergies:
                allergies,


            // Fitness meaning

            fitness_meaning:
                fitnessMeaning,


            // Exercise importance

            exercise_important:
                exerciseImportance,


            // Exercise frequency

            exercise_frequency:
                exerciseFrequency,


            // Fitness goals

            main_fitness_goal:
                fitnessGoals,


            // Biggest challenge

            biggest_challenge:
                fitnessChallenge,


            // Sleep

            sleep_hours:
                sleepHours

        };

    }


    // ==========================================
    // SUBMIT QUESTIONNAIRE
    // ==========================================

    async function submitQuestionnaire() {

        clearQuestionError();


        const questionnaireData =
            collectQuestionnaireData();


        console.log(
            "Questionnaire data being sent:",
            questionnaireData
        );


        // --------------------------------------
        // DISABLE BUTTON
        // --------------------------------------

        if (nextButton) {

            nextButton.disabled =
                true;

            nextButton.textContent =
                "Saving...";

        }


        try {

            const response =
                await fetch(
                    "/api/user/questionnaire",
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
                                questionnaireData
                            )

                    }
                );


            const data =
                await response.json()
                    .catch(
                        function () {

                            return {};

                        }
                    );


            // ----------------------------------
            // SERVER ERROR
            // ----------------------------------

            if (
                !response.ok ||
                data.success === false
            ) {

                showQuestionError(
                    data.message ||
                    "Unable to save your questionnaire. Please try again."
                );


                if (nextButton) {

                    nextButton.disabled =
                        false;

                    nextButton.textContent =
                        "Complete ✓";

                }

                return;

            }


            // ----------------------------------
            // SAVE LOCAL COPY
            // ----------------------------------

            localStorage.setItem(
                "nutriTrackQuestionnaire",
                JSON.stringify(
                    questionnaireData
                )
            );


            localStorage.setItem(
                "questionnaireCompleted",
                "true"
            );


            // ----------------------------------
            // SUCCESS
            // ----------------------------------

            if (nextButton) {

                nextButton.textContent =
                    "Completed ✓";

            }


            // ----------------------------------
            // REDIRECT
            // ----------------------------------

            setTimeout(
                function () {

                    window.location.href =
                        "/dashboard";

                },
                800
            );


        } catch (error) {

            console.error(
                "Questionnaire error:",
                error
            );


            showQuestionError(
                "Unable to connect to the server. Please make sure Flask is running."
            );


            if (nextButton) {

                nextButton.disabled =
                    false;

                nextButton.textContent =
                    "Complete ✓";

            }

        }

    }

});