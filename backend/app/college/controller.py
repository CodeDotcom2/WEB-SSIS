from flask import request, jsonify
from . import college_bp
from app.models import College, Program, Student
from app import csrf


# GET /dashboard/colleges
@college_bp.route("/colleges", methods=["GET"], strict_slashes=False)
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

# POST /dashboard/colleges
@college_bp.route("/colleges", methods=["POST"])
@csrf.exempt
def add_college():
    import re
    from app.database import get_db
    
    data = request.json
    college_code = data.get("college_code").strip()
    college_name = data.get("college_name", "").strip().lower()
    
    if not college_name or not college_code:
        return jsonify({"error": "College name and code are required"}), 400

    name_regex = r"^[A-Za-z\s]+$"
    if not re.match(name_regex, data["college_name"]) or not re.match(name_regex, data["college_code"]):
        return jsonify({"error": "Names should contain only letters and spaces"}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT college_name FROM colleges WHERE LOWER(college_name) = %s", (college_name,))
    existing = cursor.fetchone()
    cursor.close()

    if existing:
        return jsonify({"error": "College already exists"}), 400
    
    formatted_name =  data["college_name"].strip().title()
    
    new_college = College(
        college_code=data.get("college_code"),
        college_name=formatted_name
    )
    new_college.add()

    return jsonify({
        "message": "College added successfully",
        "college": {
            "id": new_college.id,
            "college_code": new_college.college_code,
            "college_name": new_college.college_name
        }
    }),201

# DELETE /dashboard/colleges/<college_id>
@college_bp.route("/colleges/<int:college_id>", methods=["DELETE"])
@csrf.exempt
def delete_college(college_id):
    success, msg = College.delete_college(college_id)
    if success:
        return jsonify({"message": msg})
    return jsonify({"error": msg}), 404


# PUT /dashboard/colleges/<college_id>
@college_bp.route("/colleges/<int:college_id>", methods=["PUT"])
@csrf.exempt
def update_college(college_id):
    import re
    from app.database import get_db
    
    data = request.json

    college_name = data.get("college_name", "").strip().lower()
    
    if not college_name or not data.get("college_code"):
        return jsonify({"error": "College name and code are required"}), 400

    name_regex = r"^[a-z\s]+$"
    if not re.match(name_regex, data["college_name"]) or not re.match(name_regex, data["college_code"]):
        return jsonify({"error": "Names should contain only letters and spaces"}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT college_name FROM colleges WHERE LOWER(college_name) = %s AND id != %s",(college_name, college_id),)
    existing = cursor.fetchone()
    cursor.close()

    if existing:
        return jsonify({"error": "College already exists"}), 400

    formatted_name =  data["college_name"].strip().title()

    success = College.update_college(college_id, data["college_code"], formatted_name)
    if success:
        return jsonify({
            "message": "College updated successfully",
            "college":{
                "id": college_id,
                "college_code": data["college_code"],
                "college_name": formatted_name
            }}), 200
    return jsonify({"error": "Failed to update college"}), 400


