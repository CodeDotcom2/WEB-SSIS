from flask import Flask, send_from_directory
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from . import database
import setup_db
import os
from .config import DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT, SECRET_KEY

JWT_SECRET_KEY = "YourSuperSecretJWTKey"
BLOCKLIST = set()

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"]=SECRET_KEY
    app.config["DATABASE_URL"]=f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]

    app.config["JWT_BLACKLIST_ENABLED"] = True
    app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access"]

    CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:5000"])

    database.init_app(app)
    jwt = JWTManager(app)

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

    frontend_dir = os.path.join(os.path.dirname(__file__), "../../frontend/out")

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        file_path = os.path.join(frontend_dir, path)
        if os.path.isfile(file_path):
            return send_from_directory(frontend_dir, path)
        else:
            return send_from_directory(frontend_dir, "index.html")

    return app
