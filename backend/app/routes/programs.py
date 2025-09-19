from flask import Blueprint, jsonify
from app.models import Program, College, Student

programs_bp = Blueprint("programs", __name__, url_prefix="/dashboard")

@programs_bp.route("/programs", methods=["GET"])
def get_programs():
    programs = Program.all()
    all_colleges = {c.id: c.college_name for c in College.all()}
    all_students = Student.all()

    program_list = []
    for p in programs:
        # College name
        college_name = all_colleges.get(p.college_id, "N/A")

        # Count students in this program
        num_students = sum(1 for s in all_students if s.program_id == p.id)

        program_list.append({
            "id": p.id,
            "program_code": p.program_code,
            "program_name": p.program_name,
            "college_name": college_name,
            "num_students": num_students
        })

    return jsonify({"programs": program_list})
