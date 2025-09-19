from flask import Blueprint, jsonify
from app.models import Student, College, Program
from app.database import get_db

students_bp = Blueprint("students", __name__, url_prefix="/dashboard")

@students_bp.route("/students", methods=["GET"])
def get_students():
    students = Student.all()
    student_list = []
    for s in students:
        # Get program name
        program_name = "N/A"
        if s.program_id:
            program = next((p for p in Program.all() if p.id == s.program_id), None)
            if program:
                program_name = program.program_name

        student_list.append({
            "id_number": s.id_number,
            "first_name": s.first_name,
            "last_name": s.last_name,
            "gender": s.gender,
            "year_level": s.year_level,
            "program": program_name
        })
    return jsonify({"students": student_list})
