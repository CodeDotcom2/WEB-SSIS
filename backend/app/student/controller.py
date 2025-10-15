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
    import re
    from app.database import get_db
    
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id_number FROM students WHERE id_number = %s", (data["id_number"],))
    existing = cursor.fetchone()
    cursor.close()

    if existing:
        return jsonify({"error": "ID number already exists"}), 400
    name_regex = r"^[A-Za-z\s]+$"
    id_regex = r"^\d{4}-\d{4}$"
    
    required_fields = ["id_number", "last_name", "first_name", "gender", "year_level", "college_id", "program_id"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required"}), 400

    # Validate names
    if not re.match(name_regex, data["first_name"]) or not re.match(name_regex, data["last_name"]):
        return jsonify({"error": "Names should contain only letters and spaces"}), 400

    # Validate ID format
    if not re.match(id_regex, data["id_number"]):
        return jsonify({"error": "ID number must follow the format XXXX-XXXX (digits only)"}), 400

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
    print("✅ Student added route reached")
    return jsonify({
        "message": "Student added successfully",
        "student":{
            "id_number": student.id_number,
            "id_number": student.id_number,
            "last_name": student.last_name,
            "first_name": student.first_name,
            "gender": student.gender,
            "year_level": student.year_level,
            "college_id": student.college_id,
            "program_id": student.program_id
        }}), 201

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



