document.addEventListener("DOMContentLoaded", function () {

    const adminLoginForm = document.getElementById("adminLoginForm");
    const adminLoginError = document.getElementById("adminLoginError");

    adminLoginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username = document.getElementById("adminUsername").value.trim();
        const password = document.getElementById("adminPassword").value;

        adminLoginError.style.display = "none";
        adminLoginError.textContent = "";

        if (!username || !password) {
            adminLoginError.textContent =
                "Please enter username and password.";

            adminLoginError.style.display = "block";
            return;
        }

        try {

            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {

                adminLoginError.textContent =
                    data.message || "Invalid admin username or password.";

                adminLoginError.style.display = "block";

                return;
            }

            // Admin login successful
            window.location.href = "/admin";

        } catch (error) {

            console.error("Admin login error:", error);

            adminLoginError.textContent =
                "Unable to connect to the server.";

            adminLoginError.style.display = "block";
        }
    });

});