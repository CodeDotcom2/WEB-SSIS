from flask import Blueprint

college_bp = Blueprint("colleges", __name__, url_prefix="/api/dashboard")

from . import controller
