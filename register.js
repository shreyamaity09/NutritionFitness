// ==========================================
// NUTRITRACK - REGISTRATION
// Backend connected with Flask API
// ==========================================

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

// ------------------------------------------
// PASSWORD VISIBILITY
// ------------------------------------------

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "Hide";
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "Show";
        }

    });
}


// ------------------------------------------
// CONFIRM PASSWORD VISIBILITY
// ------------------------------------------

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

if (toggleConfirmPassword && confirmPasswordInput) {

    toggleConfirmPassword.addEventListener("click", function () {

        if (confirmPasswordInput.type === "password") {
            confirmPasswordInput.type = "text";
            toggleConfirmPassword.textContent = "Hide";
        } else {
            confirmPasswordInput.type = "password";
            toggleConfirmPassword.textContent = "Show";
        }

    });

}


// ------------------------------------------
// REGISTRATION
// ------------------------------------------

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Get form values
        const name =
            document.getElementById("name").value.trim();

        const username =
            document.getElementById("username").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const terms =
            document.getElementById("terms");


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (!name || !username || !email || !password || !confirmPassword) {

            showMessage(
                "Please fill in all the fields.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Password must be at least 6 characters long.",
                "error"
            );

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            return;
        }


        if (terms && !terms.checked) {

            showMessage(
                "Please accept the Terms & Conditions.",
                "error"
            );

            return;
        }


        // ------------------------------------------
        // EMAIL VALIDATION
        // ------------------------------------------

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showMessage(
                "Please enter a valid email address.",
                "error"
            );

            return;
        }


        // ------------------------------------------
        // SHOW LOADING MESSAGE
        // ------------------------------------------

        showMessage(
            "Creating your account...",
            "success"
        );


        // Disable button while request is running
        const submitButton =
            registerForm.querySelector("button[type='submit']");

        if (submitButton) {
            submitButton.disabled = true;
        }


        // ------------------------------------------
        // SEND DATA TO FLASK
        // ------------------------------------------

        try {

            const response = await fetch("/api/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,
                    username: username,
                    email: email,
                    password: password

                })

            });


            // Try to read JSON response
            const data = await response.json()
                .catch(function () {
                    return {};
                });


            // ------------------------------------------
            // REGISTRATION FAILED
            // ------------------------------------------

            if (!response.ok || data.success === false) {

                showMessage(
                    data.message ||
                    "Registration failed. Please try again.",
                    "error"
                );

                if (submitButton) {
                    submitButton.disabled = false;
                }

                return;
            }


            // ------------------------------------------
            // SAVE BASIC USER INFORMATION
            // ------------------------------------------
            // Password is NEVER saved in localStorage.

            const userFromServer =
                data.user || {};

            const userData = {

                name:
                    userFromServer.name || name,

                username:
                    userFromServer.username || username,

                email:
                    userFromServer.email || email

            };


            localStorage.setItem(
                "nutriTrackUser",
                JSON.stringify(userData)
            );


            // Remove old questionnaire information
            localStorage.removeItem(
                "nutriTrackQuestionnaire"
            );

            localStorage.removeItem(
                "questionnaireCompleted"
            );


            // ------------------------------------------
            // SUCCESS
            // ------------------------------------------

            showMessage(
                "Account created! Let's personalize your plan...",
                "success"
            );


            // Go to questionnaire
            setTimeout(function () {

                window.location.href = "/questionnaire";

            }, 1000);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showMessage(
                "Unable to connect to the server. Please make sure Flask is running.",
                "error"
            );


            if (submitButton) {
                submitButton.disabled = false;
            }

        }

    });

}


// ------------------------------------------
// MESSAGE FUNCTION
// ------------------------------------------

function showMessage(message, type) {

    if (!registerMessage) {
        return;
    }

    registerMessage.textContent = message;

    if (type === "error") {

        registerMessage.style.color = "#d9534f";

    } else {

        registerMessage.style.color = "#29946d";

    }

}