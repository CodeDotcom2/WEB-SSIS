from flask import request, jsonify
from . import student_bp
from app import csrf
import app.models as models

@student_bp.route("/students", methods=["GET"])
def list_students():
    students = models.Student.all()
    return jsonify([s.__dict__ for s in students])


@student_bp.route("/students", methods=["POST"])
@csrf.exempt
def add_student():
    data = request.get_json()
    student = models.Student(
        id_number=data.get("id_number"),
        last_name=data.get("last_name"),
        first_name=data.get("first_name"),
        gender=data.get("gender"),
        year_level=data.get("year_level"),
        college_id=data.get("college_id"),
        program_id=data.get("program_id"),
    )
    student.add()
    return jsonify({"message": "Student added successfully"}), 201

@student_bp.route("/students/<string:id_number>", methods=["DELETE"])
@csrf.exempt
def delete_student(id_number):
    success = models.Student.delete_by_id_number(id_number)
    if success:
        return jsonify({"message": f"Student {id_number} deleted successfully"}), 200
    return jsonify({"error": f"Failed to delete student {id_number}"}), 400


@student_bp.route("/students/<string:id_number>", methods=["PUT"])
@csrf.exempt
def update_student(id_number):
    data = request.get_json()
    success = models.Student.update_by_id_number(
        id_number=id_number,
        last_name=data.get("last_name"),
        first_name=data.get("first_name"),
        gender=data.get("gender"),
        year_level=data.get("year_level"),
        college_id=data.get("college_id"),
        program_id=data.get("program_id"),
    )
    if success:
        return jsonify({"message": f"Student {id_number} updated successfully"}), 200
    return jsonify({"error": f"Failed to update student {id_number}"}), 400



