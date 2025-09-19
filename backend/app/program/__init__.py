from flask import Blueprint

programs_bp = Blueprint("program", __name__, url_prefix="/API/programs")

from . import controller
