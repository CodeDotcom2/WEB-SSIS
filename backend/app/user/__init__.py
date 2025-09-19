from flask import Blueprint

user_bp = Blueprint("user", __name__, url_prefix="/auth")

from . import controller
