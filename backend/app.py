from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route("/")
def message():
    return jsonify({"msg": "Hello from Flask backend!"})

@app.route("/students")
def get_students():
    students = [
        {"id": "2025-0001", "first_name": "Sheldon Ed", "last_name": "Enario", "gender": "Male", "year_level": "1st Year", "program": "BSCS"},
        {"id": "2025-0002", "first_name": "Alice", "last_name": "Wonderland", "gender": "Female", "year_level": "2nd Year", "program": "BSIT"},
    ]
    return jsonify({"students": students})

@app.route("/colleges")
def get_colleges():
    colleges = [
        {"code": "CCS", "name": "College of Computer Studies", "num_program": "4", "num_students": 80},
        {"code": "CED", "name": "College of Education", "num_program": "8", "num_students": 120},
    ]
    return jsonify({"colleges": colleges})

@app.route("/programs")
def get_programs():
    programs = [
        {"code": "BSCS", "name": "Bachelor of Science in Computer Science", "college_code": "CCS", "num_students": 80},
        {"code": "BSN", "name": "Bachelor of Science in Nursing", "college_code": "CN", "num_students": 120},
    ]
    return jsonify({"programs": programs})


if __name__ == "__main__":
    app.run(debug=True)   