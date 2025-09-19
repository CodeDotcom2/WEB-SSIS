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
