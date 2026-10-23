#from routes.auth_routes import auth_routes
#from routes.history_routes import history_routes
from flask import Flask, render_template
from config import SECRET_KEY
app = Flask(__name__)

app.config["SECRET_KEY"] = "NutriTrack_Shreyas_Project_2026_!@#"


# ==========================================
# IMPORT ROUTES
# ==========================================

from routes.auth_routes import auth_routes
from routes.history_routes import history_routes
from routes.user_routes import user_routes
from routes.meal_routes import meal_routes
from routes.exercise_routes import exercise_routes
from routes.sleep_routes import sleep_routes
from routes.water_routes import water_routes
from routes.progress_routes import progress_routes
from routes.admin_routes import admin_routes


# ==========================================
# REGISTER BLUEPRINTS
# ==========================================

app.register_blueprint(auth_routes)
app.register_blueprint(history_routes)
app.register_blueprint(user_routes)
app.register_blueprint(meal_routes)
app.register_blueprint(exercise_routes)
app.register_blueprint(sleep_routes)
app.register_blueprint(water_routes)
app.register_blueprint(progress_routes)
app.register_blueprint(admin_routes)


# ==========================
# WEBSITE PAGES
# ==========================

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/register")
def register():
    return render_template("register.html")


@app.route("/questionnaire")
def questionnaire():
    return render_template("questionnaire.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/meal-plan")
def meal_plan():
    return render_template("meal-plan.html")


@app.route("/exercise-plan")
def exercise_plan():
    return render_template("exercise-plan.html")


@app.route("/sleep-schedule")
def sleep_schedule():
    return render_template("sleep-schedule.html")


@app.route("/water-intake")
def water_intake():
    return render_template("water-intake.html")


@app.route("/progress")
def progress():
    return render_template("progress.html")

@app.route("/history")
def history():
    return render_template("history.html")


@app.route("/profile")
def profile():
    return render_template("profile.html")

@app.route("/admin/login")
def admin_login():
    return render_template("admin-login.html")


@app.route("/admin")
def admin():
    return render_template("admin-dashboard.html")


if __name__ == "__main__":
    app.run(debug=True)