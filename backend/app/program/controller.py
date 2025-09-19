from flask import jsonify, request
from . import program_bp
from app.models import Program, College
from app import csrf
import traceback


@program_bp.route("/programs", methods=["GET"], strict_slashes=False)
def get_programs():
    programs = Program.all()
    all_colleges = {c.id: c.college_name for c in College.all()}

    program_list = []
    for p in programs:
        college_name = all_colleges.get(p.college_id, "N/A")
        num_students = getattr(p, "num_students", 0)
        program_list.append({
            "id": p.id,
            "program_code": p.program_code,
            "program_name": p.program_name,
            "college_id": p.college_id,
            "college_name": college_name,
            "num_students": num_students
        })

    return jsonify({"programs": program_list}), 200


@program_bp.route("/programs", methods=["POST"])
@csrf.exempt
def add_program():
    try:
        data = request.get_json(force=True)  # safer parsing
        program_code = data.get("program_code")
        program_name = data.get("program_name")
        college_id = data.get("college_id")

        if not (program_code and program_name and college_id):
            return jsonify({"error": "program_code, program_name and college_id are required"}), 400

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

    except Exception as e:
        traceback.print_exc()
        err_msg = str(e)
        return jsonify({"error": "Failed to add program", "detail": err_msg}), 400
