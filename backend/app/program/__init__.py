from flask import Blueprint

program_bp = Blueprint("programs", __name__, url_prefix="/dashboard")

from . import controller
