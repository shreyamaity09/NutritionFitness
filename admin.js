document.addEventListener("DOMContentLoaded", function () {

    let users = [];


    // ==================================================
    // HELPER FUNCTIONS
    // ==================================================

    function getElement(id) {
        return document.getElementById(id);
    }


    function formatNumber(value) {
        return Number(value || 0).toLocaleString("en-IN");
    }


    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function formatDate(dateValue) {

        if (!dateValue) {
            return "N/A";
        }

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return "N/A";
        }

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }


    function formatValue(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "N/A";
        }

        if (Array.isArray(value)) {

            if (value.length === 0) {
                return "N/A";
            }

            return value.join(", ");
        }

        if (typeof value === "object") {
            return JSON.stringify(value);
        }

        return String(value);
    }


    // ==================================================
    // ADMIN AUTHENTICATION
    // ==================================================

    async function checkAdminLogin() {

        try {

            const response = await fetch(
                "/api/admin/me",
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                window.location.href = "/admin/login";
                return false;
            }

            const data = await response.json();

            if (
                response.ok &&
                data.success
            ) {
                return true;
            }

        } catch (error) {

            console.error(
                "Admin session check failed:",
                error
            );
        }

        return false;
    }


    // ==================================================
    // SHOW ADMIN SECTION
    // ==================================================

    window.showAdminSection = function (
        sectionId,
        clickedButton
    ) {

        const sections =
            document.querySelectorAll(".admin-section");

        sections.forEach(function (section) {
            section.classList.remove("active");
        });

        const selectedSection =
            getElement(sectionId);

        if (selectedSection) {
            selectedSection.classList.add("active");
        }

        const navButtons =
            document.querySelectorAll(".admin-nav-item");

        navButtons.forEach(function (button) {
            button.classList.remove("active");
        });

        if (clickedButton) {
            clickedButton.classList.add("active");
        }

        const main =
            document.querySelector(".admin-main");

        if (main) {
            main.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    };


    // ==================================================
    // GO TO HOME
    // ==================================================

    window.goToHome = function () {
        window.location.href = "/";
    };


    // ==================================================
    // ADMIN LOGOUT
    // ==================================================

    window.adminLogout = async function () {

        const confirmed =
            confirm("Are you sure you want to logout?");

        if (!confirmed) {
            return;
        }

        try {

            const response =
                await fetch(
                    "/api/admin/logout",
                    {
                        method: "POST",
                        credentials: "same-origin"
                    }
                );

            const data =
                await response.json();

            if (
                response.ok &&
                data.success
            ) {

                window.location.href =
                    data.redirect || "/";

                return;
            }

        } catch (error) {

            console.error(
                "Admin logout error:",
                error
            );
        }

        window.location.href = "/";
    };


    // ==================================================
    // LOAD DASHBOARD
    // ==================================================

    async function loadAdminDashboard() {

        try {

            const response =
                await fetch(
                    "/api/admin/dashboard",
                    {
                        method: "GET",
                        credentials: "same-origin"
                    }
                );

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                window.location.href =
                    "/admin/login";

                return;
            }

            const data =
                await response.json();

            if (
                response.ok &&
                data.success
            ) {

                updateDashboardStats(
                    data.statistics ||
                    data.stats ||
                    {}
                );

            } else {

                console.warn(
                    "Could not load dashboard:",
                    data.message
                );
            }

        } catch (error) {

            console.error(
                "Dashboard API error:",
                error
            );
        }
    }


    // ==================================================
    // UPDATE DASHBOARD STATISTICS
    // ==================================================

    function updateDashboardStats(stats) {

        const totalUsers =
            stats.total_users || 0;

        const totalMealPlans =
            stats.total_meal_plans || 0;

        const totalExercisePlans =
            stats.total_exercise_plans || 0;

        const totalSleepSchedules =
            stats.total_sleep_schedules || 0;

        const totalWaterRecords =
            stats.total_water_records || 0;

        const totalProgressRecords =
            stats.total_progress_records || 0;


        setStatistic(
            "totalUsers",
            totalUsers
        );

        setStatistic(
            "totalMealPlans",
            totalMealPlans
        );

        setStatistic(
            "totalExercisePlans",
            totalExercisePlans
        );

        setStatistic(
            "totalProgress",
            totalProgressRecords
        );


        setStatistic(
            "mealPlanNumber",
            totalMealPlans
        );

        setStatistic(
            "exercisePlanNumber",
            totalExercisePlans
        );

        setStatistic(
            "sleepNumber",
            totalSleepSchedules
        );

        setStatistic(
            "waterNumber",
            totalWaterRecords
        );


        setStatistic(
            "recordProgress",
            totalProgressRecords
        );

        setStatistic(
            "recordWater",
            totalWaterRecords
        );

        setStatistic(
            "recordSleep",
            totalSleepSchedules
        );

        setStatistic(
            "recordMeals",
            totalMealPlans
        );
    }


    function setStatistic(id, value) {

        const element =
            getElement(id);

        if (element) {
            element.textContent =
                formatNumber(value);
        }
    }


    // ==================================================
    // LOAD USERS
    // ==================================================

    async function loadUsers() {

        try {

            const response =
                await fetch(
                    "/api/admin/users",
                    {
                        method: "GET",
                        credentials: "same-origin"
                    }
                );

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                window.location.href =
                    "/admin/login";

                return;
            }

            const data =
                await response.json();

            if (
                response.ok &&
                data.success
            ) {

                users =
                    Array.isArray(data.users)
                        ? data.users
                        : [];

                displayUsers(users);

                updateUserCount(
                    users.length
                );

            } else {

                console.warn(
                    "Could not load users:",
                    data.message
                );
            }

        } catch (error) {

            console.error(
                "Users API error:",
                error
            );
        }
    }


    // ==================================================
    // DISPLAY USERS
    // ==================================================

function displayUsers(userList) {

    const tableBody = getElement("usersTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    if (!userList || userList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-users">
                    No users found.
                </td>
            </tr>
        `;
        return;
    }

    userList.forEach(function (user) {

        const row = document.createElement("tr");

        const userId = user._id || user.user_id || "";
        const name = user.name || user.full_name || "Unknown User";
        const username = user.username || "N/A";
        const email = user.email || "N/A";

        const questionnaire = user.questionnaire || {};

        let goal =
            questionnaire.main_fitness_goal ||
            questionnaire.fitness_goal ||
            user.goal ||
            "Not specified";

        if (Array.isArray(goal)) {
            goal = goal.join(", ");
        }

        // Account activity is separate from track completion.
        const activity = user.activity_status || "Unknown";

        let activityClass = "status-user-unknown";

        if (activity === "Active") {
            activityClass = "status-user-active";
        } else if (activity === "Inactive") {
            activityClass = "status-user-inactive";
        }

        const trackStatus = user.track_status || "Not started";

        let trackClass = "track-status-not-started";

        if (trackStatus === "Completed") {
            trackClass = "track-status-completed";
        } else if (trackStatus === "In progress") {
            trackClass = "track-status-in-progress";
        }

        row.innerHTML = `
            <td>
                <strong>${escapeHTML(name)}</strong>
            </td>

            <td>${escapeHTML(username)}</td>

            <td>${escapeHTML(email)}</td>

            <td>
                <span class="goal-badge">
                    ${escapeHTML(goal)}
                </span>
            </td>

            <td>
                <span class="${activityClass}">
                    ${escapeHTML(activity)}
                </span>
            </td>

            <td>
                <span class="track-status ${trackClass}">
                    ${escapeHTML(trackStatus)}
                </span>
            </td>

            <td>
                <div class="user-actions">
                    <button
                        type="button"
                        class="view-user-btn"
                        data-user-id="${escapeHTML(userId)}"
                        title="View user details"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        class="delete-user-btn"
                        data-user-id="${escapeHTML(userId)}"
                        title="Delete user"
                    >
                        Delete
                    </button>
                </div>
            </td>
        `;

        const viewButton = row.querySelector(".view-user-btn");
        const deleteButton = row.querySelector(".delete-user-btn");

        viewButton.addEventListener("click", function () {
            window.viewUser(userId);
        });

        deleteButton.addEventListener("click", function () {
            window.deleteUser(userId);
        });

        tableBody.appendChild(row);
    });
}



    // ==================================================
    // USER COUNT
    // ==================================================

    function updateUserCount(count) {

        const element =
            getElement("userCountText");

        if (element) {

            element.textContent =
                `${formatNumber(count)} ${
                    count === 1
                        ? "User"
                        : "Users"
                }`;
        }
    }


    // ==================================================
    // SEARCH USERS
    // ==================================================

    window.searchUsers = function (searchText) {

        const input =
            getElement("userSearch");

        const text =
            String(
                searchText !== undefined
                    ? searchText
                    : input
                        ? input.value
                        : ""
            )
            .toLowerCase()
            .trim();

        if (!text) {

            displayUsers(users);

            updateUserCount(
                users.length
            );

            return;
        }

        const filteredUsers =
            users.filter(function (user) {

                const name =
                    String(
                        user.name || ""
                    ).toLowerCase();

                const username =
                    String(
                        user.username || ""
                    ).toLowerCase();

                const email =
                    String(
                        user.email || ""
                    ).toLowerCase();

                return (
                    name.includes(text) ||
                    username.includes(text) ||
                    email.includes(text)
                );
            });

        displayUsers(filteredUsers);

        updateUserCount(
            filteredUsers.length
        );
    };


    // ==================================================
    // SEARCH INPUT
    // ==================================================

    const searchInput =
        getElement("userSearch");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                searchUsers(
                    searchInput.value
                );
            }
        );
    }


    // ==================================================
    // VIEW USER
    // ==================================================

    window.viewUser = async function (userId) {

        if (!userId) {
            alert("User ID not found.");
            return;
        }

        try {

            const response =
                await fetch(
                    `/api/admin/users/${encodeURIComponent(userId)}`,
                    {
                        method: "GET",
                        credentials: "same-origin"
                    }
                );

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                alert(
                    "Admin access is required."
                );

                return;
            }

            const data =
                await response.json();

            console.log(
                "Admin user details response:",
                data
            );

            if (
                response.ok &&
                data.success
            ) {

                const user =
                    data.user || {};

                openUserDetailsModal(user);

            } else {

                alert(
                    data.message ||
                    "Unable to load user details."
                );
            }

        } catch (error) {

            console.error(
                "View user error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        }
    };


    // ==================================================
    // OPEN USER DETAILS MODAL
    // ==================================================

    function openUserDetailsModal(user) {

        const oldModal =
            getElement("userDetailsModal");

        if (oldModal) {
            oldModal.remove();
        }


        const questionnaire =
            user.questionnaire || {};


        const mealPlans =
            Array.isArray(user.meal_plans)
                ? user.meal_plans
                : [];


        const exercisePlans =
            Array.isArray(user.exercise_plans)
                ? user.exercise_plans
                : [];


        const sleepSchedules =
            Array.isArray(user.sleep_schedules)
                ? user.sleep_schedules
                : [];


        const waterRecords =
            Array.isArray(user.water_intake)
                ? user.water_intake
                : [];


        const progressRecords =
            Array.isArray(user.progress)
                ? user.progress
                : [];


        let goals =
            questionnaire.main_fitness_goal ||
            questionnaire.fitness_goal ||
            "Not specified";

        if (Array.isArray(goals)) {
            goals = goals.join(", ");
        }


        const modal =
            document.createElement("div");

        modal.id =
            "userDetailsModal";


        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            padding: 20px;
            overflow-y: auto;
        `;


        modal.innerHTML = `

            <div
                id="adminUserDetailsBox"
                style="
                    width: min(1000px, 95vw);
                    max-height: 90vh;
                    overflow-y: auto;
                    background: white;
                    border-radius: 20px;
                    padding: 30px;
                    position: relative;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
                "
            >

                <button
                    id="closeUserModal"
                    type="button"
                    style="
                        position: absolute;
                        top: 15px;
                        right: 20px;
                        border: none;
                        background: transparent;
                        font-size: 32px;
                        cursor: pointer;
                    "
                >
                    ×
                </button>


                <h2 style="margin-bottom: 5px;">
                    User Details
                </h2>

                <p style="margin-bottom: 25px; opacity: 0.7;">
                    Complete information for
                    <strong>
                        ${escapeHTML(
                            user.name || "User"
                        )}
                    </strong>
                </p>

                
                <h3>Account Activity & Track Status</h3>

                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin: 15px 0 25px;
                ">
                    ${detailCard(
                        "Account Activity",
                        user.activity_status || "Inactive"
                    )}                    
                   
                    ${detailCard(
                        "Last Login",
                        user.last_login
                            ? new Date(user.last_login).toLocaleString("en-IN")
                            : "No login recorded"
                    )}

                    ${detailCard(
                        "Today's Track Status",
                        user.track_status || "Not started"
                    )}

                    ${detailCard(
                        "Completed Activities",
                        `${user.completed_tracks || 0} / ${user.total_tracks || 4}`
                    )}
                </div>

                <h3>Account Information</h3>

                <div style="
                    display: grid;
                    grid-template-columns:
                        repeat(auto-fit, minmax(220px, 1fr));
                    gap: 15px;
                    margin: 15px 0 25px;
                ">

                    ${detailCard(
                        "Name",
                        user.name
                    )}

                    ${detailCard(
                        "Username",
                        user.username
                    )}

                    ${detailCard(
                        "Email",
                        user.email
                    )}

                </div>


                <h3>Questionnaire Information</h3>

                <div style="
                    display: grid;
                    grid-template-columns:
                        repeat(auto-fit, minmax(220px, 1fr));
                    gap: 15px;
                    margin: 15px 0 25px;
                ">

                    ${detailCard(
                        "Age",
                        questionnaire.age
                    )}

                    ${detailCard(
                        "Height",
                        questionnaire.height
                    )}

                    ${detailCard(
                        "Weight",
                        questionnaire.weight
                    )}

                    ${detailCard(
                        "Target Weight",
                        questionnaire.target_weight
                    )}

                    ${detailCard(
                        "Date of Birth",
                        questionnaire.date_of_birth ||
                        questionnaire.dob
                    )}

                    ${detailCard(
                        "Allergies",
                        questionnaire.allergies
                    )}

                    ${detailCard(
                        "Fitness Meaning",
                        questionnaire.fitness_meaning ||
                        questionnaire.what_fitness_means
                    )}

                    ${detailCard(
                        "Exercise Importance",
                        questionnaire.exercise_important
                    )}

                    ${detailCard(
                        "Exercise Frequency",
                        questionnaire.exercise_frequency
                    )}

                    ${detailCard(
                        "Fitness Goal",
                        goals
                    )}

                    ${detailCard(
                        "Biggest Challenge",
                        questionnaire.biggest_challenge
                    )}

                    ${detailCard(
                        "Sleep Hours",
                        questionnaire.sleep_hours
                    )}

                </div>


                <h3>Stored Records</h3>

                <div style="
                    display: grid;
                    grid-template-columns:
                        repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    margin: 15px 0 25px;
                ">

                    ${recordCard(
                        mealPlans.length,
                        "Meal Plans"
                    )}

                    ${recordCard(
                        exercisePlans.length,
                        "Exercise Plans"
                    )}

                    ${recordCard(
                        sleepSchedules.length,
                        "Sleep Records"
                    )}

                    ${recordCard(
                        waterRecords.length,
                        "Water Records"
                    )}

                    ${recordCard(
                        progressRecords.length,
                        "Progress Records"
                    )}

                </div>


                ${createRecordSection(
                    "Meal Plans",
                    mealPlans,
                    "meal"
                )}

                ${createRecordSection(
                    "Exercise Plans",
                    exercisePlans,
                    "exercise"
                )}

                ${createRecordSection(
                    "Sleep Records",
                    sleepSchedules,
                    "sleep"
                )}

                ${createRecordSection(
                    "Water Records",
                    waterRecords,
                    "water"
                )}

                ${createRecordSection(
                    "Progress Records",
                    progressRecords,
                    "progress"
                )}

            </div>
        `;


        document.body.appendChild(modal);


        const closeButton =
            getElement("closeUserModal");

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function () {
                    modal.remove();
                }
            );
        }


        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {
                    modal.remove();
                }
            }
        );
    }


    // ==================================================
    // DETAIL CARD
    // ==================================================

    function detailCard(label, value) {

        return `
            <div style="
                padding: 15px;
                border-radius: 12px;
                background: #f5f9fc;
                border: 1px solid #e1edf3;
            ">

                <div style="
                    font-size: 12px;
                    opacity: 0.65;
                    margin-bottom: 5px;
                ">
                    ${escapeHTML(label)}
                </div>

                <strong>
                    ${escapeHTML(
                        formatValue(value)
                    )}
                </strong>

            </div>
        `;
    }


    // ==================================================
    // RECORD CARD
    // ==================================================

    function recordCard(number, label) {

        return `
            <div style="
                padding: 18px;
                text-align: center;
                border-radius: 14px;
                background: #f5f9fc;
                border: 1px solid #e1edf3;
            ">

                <strong style="
                    display: block;
                    font-size: 24px;
                    margin-bottom: 5px;
                ">
                    ${formatNumber(number)}
                </strong>

                <span>
                    ${escapeHTML(label)}
                </span>

            </div>
        `;
    }


    // ==================================================
    // RECORD SECTIONS
    // ==================================================

    function createRecordSection(
        title,
        records,
        type
    ) {

        if (
            !records ||
            records.length === 0
        ) {

            return `
                <div style="
                    margin-top: 25px;
                    padding: 18px;
                    background: #f8fafb;
                    border-radius: 14px;
                ">

                    <h3>
                        ${escapeHTML(title)}
                    </h3>

                    <p>
                        No ${escapeHTML(
                            title.toLowerCase()
                        )} found for this user.
                    </p>

                </div>
            `;
        }


        let recordsHTML = "";


        records.forEach(function (record, index) {

            const createdAt =
                record.created_at ||
                record.updated_at ||
                record.date;


            recordsHTML += `
                <div style="
                    margin-top: 10px;
                    padding: 15px;
                    border-radius: 12px;
                    background: #f8fbfd;
                    border: 1px solid #e4eef3;
                ">

                    <strong>
                        Record ${index + 1}
                    </strong>

                    <span style="
                        margin-left: 10px;
                        opacity: 0.65;
                    ">
                        ${escapeHTML(
                            formatDate(createdAt)
                        )}
                    </span>

                    <div style="
                        margin-top: 10px;
                        font-size: 14px;
                        line-height: 1.7;
                    ">
                        ${formatRecordData(
                            record,
                            type
                        )}
                    </div>

                </div>
            `;
        });


        return `
            <div style="
                margin-top: 25px;
            ">

                <h3>
                    ${escapeHTML(title)}
                </h3>

                ${recordsHTML}

            </div>
        `;
    }


    // ==================================================
    // FORMAT RECORD DATA
    // ==================================================

    function formatRecordData(record, type) {

        const ignoredFields = [
            "_id",
            "user_id",
            "created_at",
            "updated_at"
        ];


        const entries =
            Object.entries(record)
                .filter(function ([key]) {
                    return !ignoredFields.includes(key);
                });


        if (entries.length === 0) {
            return "No additional information.";
        }


        return entries.map(
            function ([key, value]) {

                const label =
                    key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, function (letter) {
                            return letter.toUpperCase();
                        });


                return `
                    <div>
                        <strong>
                            ${escapeHTML(label)}:
                        </strong>

                        ${escapeHTML(
                            formatValue(value)
                        )}
                    </div>
                `;
            }
        ).join("");
    }


    // ==================================================
    // DELETE USER
    // ==================================================

    window.deleteUser = async function (
        userId
    ) {

        if (!userId) {
            return;
        }

        const user =
            users.find(function (item) {

                return String(
                    item._id ||
                    item.user_id
                ) === String(userId);

            });


        const userName =
            user
                ? (
                    user.name ||
                    user.username ||
                    "this user"
                )
                : "this user";


        const confirmed =
            confirm(
                `Are you sure you want to delete ${userName}?\n\nThis will also delete the user's meal plans, exercise plans, sleep records, water records and progress records.`
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `/api/admin/users/${encodeURIComponent(userId)}`,
                    {
                        method: "DELETE",
                        credentials: "same-origin"
                    }
                );


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                alert(
                    "Admin access is required."
                );

                return;
            }


            const data =
                await response.json();


            if (
                response.ok &&
                data.success
            ) {

                alert(
                    "User deleted successfully."
                );


                await loadUsers();

                await loadAdminDashboard();

            } else {

                alert(
                    data.message ||
                    "Unable to delete user."
                );
            }


        } catch (error) {

            console.error(
                "Delete user error:",
                error
            );


            alert(
                "Unable to connect to the server."
            );
        }
    };


    // ==================================================
    // PLAN DETAILS
    // ==================================================

    window.viewPlanInfo = function (
        planType
    ) {

        let message = "";

        if (planType === "meal") {

            message =
                "Meal plans are stored in the meal_plans collection.";
        }

        else if (planType === "exercise") {

            message =
                "Exercise plans are stored in the exercise_plans collection.";
        }

        else if (planType === "sleep") {

            message =
                "Sleep schedules are stored in the sleep_schedules collection.";
        }

        else if (planType === "water") {

            message =
                "Water intake records are stored in the water_intake collection.";
        }

        else {

            message =
                "This information is stored in MongoDB.";
        }

        alert(message);
    };


    // ==================================================
    // INITIALIZE
    // ==================================================

    async function initializeAdmin() {

        const loggedIn =
            await checkAdminLogin();

        if (!loggedIn) {
            return;
        }

        await loadAdminDashboard();

        await loadUsers();
    }


    initializeAdmin();

});