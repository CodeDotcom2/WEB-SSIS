from flask import request, jsonify
from . import college_bp
from app.models import College, Program, Student

@college_bp.route("/", methods=["GET"])
def get_colleges():
    colleges = College.all()
    programs = Program.all()
    students = Student.all()

    college_list = []
    for c in colleges:
        num_programs = sum(1 for p in programs if p.college_id == c.id)
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


@college_bp.route("/colleges", methods=["POST"])
def add_college():
    data = request.json
    new_college = College(college_code=data.get("college_code"), college_name=data.get("college_name"))
    new_college.add()
    return jsonify({"message": "College added successfully", "id": new_college.id})
