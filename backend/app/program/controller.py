from flask import jsonify, request
from . import programs_bp
from app.models import Program, College

# Get all programs
@programs_bp.route("/", methods=["GET"])
def get_programs():
    programs = Program.all()
    all_colleges = {c.id: c.college_name for c in College.all()}

    program_list = []
    for p in programs:
        # College name
        college_name = all_colleges.get(p.college_id, "N/A")

        # Count students in this program (if needed)
        num_students = getattr(p, "num_students", 0)  # default 0

        program_list.append({
            "id": p.id,
            "program_code": p.program_code,
            "program_name": p.program_name,
            "college_name": college_name,
            "num_students": num_students
        })

    return jsonify({"programs": program_list})


# Add a new program
@programs_bp.route("/add", methods=["POST"])
def add_program():
    data = request.json

    program_code = data.get("program_code")
    program_name = data.get("program_name")
    college_id = data.get("college_id")

    if not (program_code and program_name and college_id):
        return jsonify({"error": "Missing fields"}), 400

    # Add program to DB
    program = Program(program_code=program_code, program_name=program_name, college_id=college_id)
    program.add()

    return jsonify({
        "message": "Program added successfully",
        "program": {
            "id": program.id,
            "program_code": program.program_code,
            "program_name": program.program_name,
            "college_id": program.college_id
        }
    }), 201
