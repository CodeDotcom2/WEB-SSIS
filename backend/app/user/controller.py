# app/user/controller.py
from flask import request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
import app.models as models
from . import user_bp
from app import csrf

@user_bp.route("/login", methods=["POST"])
@csrf.exempt
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    # Example DB authentication logic (adjust to your models)
    user = models.Users.get_by_username(username)
    if user and user.check_password(password):  # assumes you have check_password()
        login_user(user)
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401


@user_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True, "message": "Logged out successfully"}), 200


@user_bp.route("/me", methods=["GET"])
@login_required
def get_current_user():
    return jsonify({
        "id": current_user.id,
        "username": current_user.username
    }), 200
