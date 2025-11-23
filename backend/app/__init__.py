from flask import Flask, send_from_directory
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS
from . import database
import setup_db
import os
from .config import DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT, SECRET_KEY

login_manager = LoginManager()
csrf = CSRFProtect()

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"]=SECRET_KEY
    app.config["DATABASE_URL"]=f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    CORS(app, supports_credentials=True, origins=["http://localhost:5000", "http://127.0.0.1:5000"])

    csrf.init_app(app)
    database.init_app(app)


    login_manager.init_app(app)
    login_manager.login_view = 'user.login'

    from .user import user_bp
    from .student import student_bp
    from .college import college_bp
    from .program import program_bp

    app.register_blueprint(user_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(college_bp)
    app.register_blueprint(program_bp)

    setup_db.create_tables()
    
    @login_manager.user_loader
    def load_user(user_id):
        from .models import Users
        return Users.get_by_id(user_id)
    

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
