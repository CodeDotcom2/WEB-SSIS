from flask import Flask, send_from_directory, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from . import database
import setup_db
import os
from .config import DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT, SECRET_KEY

JWT_SECRET_KEY = "YourSuperSecretJWTKey"
BLOCKLIST = set()

def create_app():
    app = Flask(__name__, static_folder=None)

    app.config["SECRET_KEY"]=SECRET_KEY
    app.config["DATABASE_URL"]=f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]

    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"

    app.config["JWT_BLACKLIST_ENABLED"] = True
    app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access"]

    CORS(app, supports_credentials=True, origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5000",
    ], allow_headers=["Authorization", "Content-Type"])

    database.init_app(app)
    jwt = JWTManager(app)

    @jwt.unauthorized_loader
    def handle_missing_token(err_msg):
        print(f"[JWT] Missing/unauthorized token: {err_msg} | Authorization: {request.headers.get('Authorization')}")
        return jsonify({"error": "Missing Authorization Header", "detail": err_msg}), 401

    @jwt.invalid_token_loader
    def handle_invalid_token(err_msg):
        print(f"[JWT] Invalid token: {err_msg} | Authorization: {request.headers.get('Authorization')}")
        return jsonify({"error": "Invalid token", "detail": err_msg}), 422

    @jwt.expired_token_loader
    def handle_expired_token(jwt_header, jwt_payload):
        print(f"[JWT] Expired token for payload: {jwt_payload}")
        return jsonify({"error": "Token has expired"}), 401

    @jwt.token_in_blocklist_loader
    def check_if_token_is_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return jti in BLOCKLIST
    
    from .user import user_bp
    from .student import student_bp
    from .college import college_bp
    from .program import program_bp

    app.register_blueprint(user_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(college_bp)
    app.register_blueprint(program_bp)

    setup_db.create_tables()

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        if path.startswith("api/"):
            return {"error": "API route not found"}, 404

        static_folder_path = os.path.join(os.path.dirname(__file__), "static")

        print(f"[serve_frontend] Requested path: '{path}'")
        requested_file = os.path.join(static_folder_path, path)
        exists = os.path.exists(requested_file)
        print(f"[serve_frontend] Checking file: {requested_file} - exists={exists}")

        if exists and os.path.isfile(requested_file):
            return send_from_directory(static_folder_path, path)


        index_file = os.path.join(static_folder_path, "index.html")
        print(f"[serve_frontend] Falling back to index: {index_file} - exists={os.path.exists(index_file)}")
        return send_from_directory(static_folder_path, "index.html")


    return app
