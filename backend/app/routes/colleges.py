from flask import Blueprint, jsonify
from app.models import College, Program, Student

colleges_bp = Blueprint("colleges", __name__, url_prefix="/dashboard")

@colleges_bp.route("/colleges", methods=["GET"])
def get_colleges():
    colleges = College.all()
    programs = Program.all()
    students = Student.all()

    college_list = []
    for c in colleges:
        # Count programs in this college
        num_programs = sum(1 for p in programs if p.college_id == c.id)

        # Count students in programs of this college
        program_ids = [p.id for p in programs if p.college_id == c.id]
        num_students = sum(1 for s in students if s.program_id in program_ids)

        college_list.append({
            "id": c.id,
            "college_code": c.college_code,
            "college_name": c.college_name,
            "num_programs": num_programs,
            "num_students": num_students
        })

    return jsonify({"colleges": college_list})
