from flask import Flask
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS
from . import database
from .config import DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT, SECRET_KEY

login_manager = LoginManager()
csrf = CSRFProtect()

def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY=SECRET_KEY,
        DATABASE_URL=f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    csrf.init_app(app)
    database.init_app(app)
    CORS(app, supports_credentials=True)

    login_manager.init_app(app)
    login_manager.login_view = 'user.login'

    from .user import user_bp
    app.register_blueprint(user_bp)

    from .routes.students import students_bp
    app.register_blueprint(students_bp)

    from .routes.colleges import colleges_bp
    app.register_blueprint(colleges_bp)

    from .routes.programs import programs_bp
    app.register_blueprint(programs_bp)

    @login_manager.user_loader
    def load_user(user_id):
        from .models import Users
        return Users.get_by_id(user_id)

    return app
