from flask import jsonify, request
from . import program_bp
from app.models import Program, College
from app import csrf
import traceback


@program_bp.route("/programs", methods=["GET"], strict_slashes=False)
def get_programs():
    programs = Program.all()
    program_list = [
        {
            "id": p.id,
            "program_code": p.program_code,
            "program_name": p.program_name,
            "college_id": p.college_id,
            "college_name": getattr(p, "college_name", "N/A"),
            "num_students": getattr(p, "num_students", 0)
        }
        for p in programs
    ]
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


@program_bp.route("/programs/<int:program_id>", methods=["DELETE"], strict_slashes=False)
@csrf.exempt
def delete_program(program_id):
    try:
        success, message = Program.delete_program(program_id)
        if success:
            return jsonify({"message": message}), 200
        else:
            return jsonify({"error": message}), 404
    except Exception as e:
        print(f"Error in delete_program route: {e}")
        return jsonify({"error": "Failed to delete program"}), 500

@program_bp.route("/programs/<int:program_id>", methods=["PUT"])
@csrf.exempt
def update_program(program_id):
    try:
        data = request.get_json(force=True)
        program_code = data.get("program_code")
        program_name = data.get("program_name")
        college_id = data.get("college_id")

        if not (program_code and program_name and college_id):
            return jsonify({"error": "All fields required"}), 400

        success = Program.update_program(program_id, program_code, program_name, college_id)
        if success:
            return jsonify({"message": "Program updated successfully"}), 200
        else:
            return jsonify({"error": "Failed to update program"}), 400
    except Exception as e:
        print(f"Error updating program: {e}")
        return jsonify({"error": "Server error"}), 500
