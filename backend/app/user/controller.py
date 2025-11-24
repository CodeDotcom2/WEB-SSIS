# app/user/controller.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
import app.models as models
from . import user_bp
import datetime
from .. import BLOCKLIST

@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = models.Users.get_by_username(username)
    if user and user.check_password(password): 
        long_expiry = datetime.timedelta(minutes=5)
        access_token = create_access_token(
            identity=str(user.id), 
            expires_delta=long_expiry
        )
        return jsonify(message="Login successful",access_token=access_token), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401


@user_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    token_payload = get_jwt()
    jti = token_payload["jti"]
    BLOCKLIST.add(jti)
    return jsonify({"success": True, "message": "Token has been successfully blocklisted"}), 200


@user_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    try:
        user_id = int(get_jwt_identity())
    except Exception:
        user_id = get_jwt_identity()
    user = models.Users.get_by_id(user_id) 

    if user:
        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email
        }), 200
    
    return jsonify({"message": "User not found"}), 404
