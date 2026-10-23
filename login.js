// ==========================================
// NUTRITRACK - LOGIN
// Backend connected with Flask API
// ==========================================

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");


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
// LOGIN FORM
// ------------------------------------------

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // Get values from form
        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;


        // Remember me checkbox
        const rememberMeElement =
            document.getElementById("rememberMe");

        const rememberMe =
            rememberMeElement
                ? rememberMeElement.checked
                : false;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (!username || !password) {

            showLoginMessage(
                "Please enter your username and password.",
                "error"
            );

            return;
        }


        // ------------------------------------------
        // SHOW LOADING
        // ------------------------------------------

        showLoginMessage(
            "Logging you in...",
            "success"
        );


        const submitButton =
            loginForm.querySelector("button[type='submit']");


        if (submitButton) {
            submitButton.disabled = true;
        }


        // ------------------------------------------
        // SEND LOGIN REQUEST TO FLASK
        // ------------------------------------------

        try {

            const response = await fetch("/api/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username: username,
                    password: password

                })

            });


            // Read server response
            const data = await response.json()
                .catch(function () {
                    return {};
                });


            // ------------------------------------------
            // LOGIN FAILED
            // ------------------------------------------

            if (!response.ok || data.success === false) {

                showLoginMessage(
                    data.message ||
                    "Invalid username or password.",
                    "error"
                );


                if (submitButton) {
                    submitButton.disabled = false;
                }

                return;
            }


            // ------------------------------------------
            // SAVE USER INFORMATION
            // ------------------------------------------
            // Password is NOT saved.

            const userFromServer =
                data.user || {};


            const userData = {

                name:
                    userFromServer.name || "",

                username:
                    userFromServer.username || username,

                email:
                    userFromServer.email || ""

            };


            localStorage.setItem(
                "nutriTrackUser",
                JSON.stringify(userData)
            );


            // Store remember-me preference only
            if (rememberMe) {

                localStorage.setItem(
                    "nutriTrackRememberMe",
                    "true"
                );

            } else {

                localStorage.removeItem(
                    "nutriTrackRememberMe"
                );

            }


            // ------------------------------------------
            // SUCCESS
            // ------------------------------------------

            showLoginMessage(
                "Login successful! Redirecting...",
                "success"
            );


            // Redirect to dashboard
            setTimeout(function () {

                window.location.href = "/dashboard";

            }, 700);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            showLoginMessage(
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

function showLoginMessage(message, type) {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent = message;


    if (type === "error") {

        loginMessage.style.color = "#d9534f";

    } else {

        loginMessage.style.color = "#29946d";

    }

}


// ------------------------------------------
// GOOGLE LOGIN
// ------------------------------------------

function googleLogin() {

    alert(
        "Google Login will be connected later."
    );

}