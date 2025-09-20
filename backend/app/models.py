from app.database import get_db
from flask_login import UserMixin
import hashlib


class Users(UserMixin):
    USE_HASH = False  

    def __init__(self, id=None, username=None, password=None, email=None):
        self.id = id
        self.username = username
        self.password = password
        self.email = email

    def add(self):
        db = get_db()
        cursor = db.cursor()

        # decide password storage based on USE_HASH
        password_to_store = hashlib.md5(self.password.encode()).hexdigest() if self.USE_HASH else self.password

        sql = "INSERT INTO users(username, user_password, email) VALUES (%s, %s, %s)"
        cursor.execute(sql, (self.username, password_to_store, self.email))
        db.commit()
        cursor.close()

    @classmethod
    def all(cls):
        db = get_db()
        cursor = db.cursor()

        sql = "SELECT * FROM users"
        cursor.execute(sql)
        result = cursor.fetchall()
        cursor.close()
        return result

    @classmethod
    def delete(cls, id):
        try:
            db = get_db()
            cursor = db.cursor()
            sql = "DELETE FROM users WHERE id = %s"
            cursor.execute(sql, (id,))
            db.commit()
            cursor.close()
            return True
        except Exception as e:
            return False

    @classmethod
    def update(cls, user_id, username, email, password=None):
        try:
            db = get_db()
            cursor = db.cursor()

            if password:
                password_to_store = hashlib.md5(password.encode()).hexdigest() if cls.USE_HASH else password
                sql = "UPDATE users SET username = %s, email = %s, user_password = %s WHERE id = %s"
                cursor.execute(sql, (username, email, password_to_store, user_id))
            else:
                sql = "UPDATE users SET username = %s, email = %s WHERE id = %s"
                cursor.execute(sql, (username, email, user_id))


            db.commit()
            cursor.close()
            return True
        except Exception as e:
            print(f"Error updating user: {e}")
            return False

    @classmethod
    def get_by_id(cls, user_id):
        db = get_db()
        cursor = db.cursor()
        sql = "SELECT id, username, email, user_password FROM users WHERE id = %s"
        cursor.execute(sql, (user_id,))
        result = cursor.fetchone()
        cursor.close()

        if result:
            return cls(id=result[0], username=result[1], email=result[2], password=result[3])
        return None

    @classmethod
    def get_by_username(cls, username):
        db = get_db()
        cursor = db.cursor()
        sql = "SELECT id, username, email, user_password FROM users WHERE username = %s"
        cursor.execute(sql, (username,))
        result = cursor.fetchone()
        cursor.close()

        if result:
            return cls(id=result[0], username=result[1], email=result[2], password=result[3])
        return None

    def check_password(self, password):
        password_to_check = hashlib.md5(password.encode()).hexdigest() if self.USE_HASH else password
        return self.password == password_to_check


    def get_id(self):
        return str(self.id)


class College:
    def __init__(self, id=None, college_code=None, college_name=None):
        self.id = id
        self.college_code = college_code
        self.college_name = college_name

    def add(self):
        db = get_db()
        cursor = db.cursor()
        sql = "INSERT INTO colleges (college_code, college_name) VALUES (%s, %s) RETURNING id"
        cursor.execute(sql, (self.college_code, self.college_name))
        self.id = cursor.fetchone()[0]
        db.commit()
        cursor.close()

    @classmethod
    def all(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT id, college_code, college_name FROM colleges")
        result = cursor.fetchall()
        cursor.close()
        return [cls(id=row[0], college_code=row[1], college_name=row[2]) for row in result]

    @staticmethod
    def delete_college(college_id: int):
        db = get_db()
        cursor = db.cursor()
        try:
            # Check if college exists
            cursor.execute("SELECT college_code FROM colleges WHERE id = %s", (college_id,))
            college = cursor.fetchone()
            if not college:
                cursor.close()
                return False, "College not found"

            # Nullify foreign key reference in programs
            cursor.execute(
                "UPDATE programs SET college_id = NULL WHERE college_id = %s",
                (college_id,)
            )

            # Delete the college
            cursor.execute("DELETE FROM colleges WHERE id = %s", (college_id,))

            db.commit()
            cursor.close()
            return True, f"College '{college[0]}' deleted successfully"

        except Exception as e:
            db.rollback()
            cursor.close()
            print(f"Error deleting college: {e}")
            return False, str(e)


class Program:
    def __init__(self, id=None, program_code=None, program_name=None, college_id=None):
        self.id = id
        self.program_code = program_code
        self.program_name = program_name
        self.college_id = college_id

    def add(self):
        db = get_db()
        cursor = db.cursor()
        sql = "INSERT INTO programs (program_code, program_name, college_id) VALUES (%s, %s, %s) RETURNING id"
        cursor.execute(sql, (self.program_code, self.program_name, self.college_id))
        self.id = cursor.fetchone()[0]
        db.commit()
        cursor.close()

    @classmethod
    def all(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT p.id, p.program_code, p.program_name, p.college_id,
                c.college_name,
                COUNT(s.student_id) AS num_students
            FROM programs p
            LEFT JOIN colleges c ON p.college_id = c.id
            LEFT JOIN students s ON s.program_id = p.id
            GROUP BY p.id, c.college_name
            ORDER BY p.program_name
        """)
        result = cursor.fetchall()
        cursor.close()

        programs = []
        for row in result:
            program = cls(
                id=row[0],
                program_code=row[1],
                program_name=row[2],
                college_id=row[3]
            )
            # Add extra attributes for JSON
            program.college_name = row[4] or "N/A"
            program.num_students = row[5] or 0
            programs.append(program)
        return programs

    def delete_program(program_id: int):
        db = get_db()
        cursor = db.cursor()
        try:
            # Check if program exists
            cursor.execute("SELECT program_code FROM programs WHERE id = %s", (program_id,))
            program = cursor.fetchone()
            if not program:
                cursor.close()
                return False, "Program not found"

            # Nullify foreign key reference in students but keep program_code
            cursor.execute(
                "UPDATE students SET program_id = NULL WHERE program_id = %s",
                (program_id,)
            )

            # Delete the program
            cursor.execute("DELETE FROM programs WHERE id = %s", (program_id,))

            db.commit()
            cursor.close()
            return True, f"Program '{program[0]}' deleted successfully"

        except Exception as e:
            db.rollback()
            cursor.close()
            print(f"Error deleting program: {e}")
            return False, str(e)
        
    @classmethod
    def update_program(cls, program_id, program_code, program_name, college_id):
        try:
            db = get_db()
            cursor = db.cursor()
            sql = """
                UPDATE programs
                SET program_code = %s, program_name = %s, college_id = %s
                WHERE id = %s
            """
            cursor.execute(sql, (program_code, program_name, college_id, program_id))
            db.commit()
            cursor.close()
            return True
        except Exception as e:
            db.rollback()
            cursor.close()
            print(f"Error updating program: {e}")
            return False



class Student:
    def __init__(self, student_id=None, id_number=None, last_name=None, first_name=None, gender=None, year_level=None, college_id=None, program_id=None, program_code=None, program_name=None):
        self.student_id = student_id
        self.id_number = id_number
        self.last_name = last_name
        self.first_name = first_name
        self.gender = gender
        self.year_level = year_level
        self.college_id = college_id
        self.program_id = program_id
        self.program_name = program_name
        self.program_code = program_code

    def add(self):
        db = get_db()
        cursor = db.cursor()
        sql = """INSERT INTO students (id_number, last_name, first_name, gender, year_level, college_id, program_id)
                 VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(sql, (self.id_number, self.last_name, self.first_name, self.gender, self.year_level, self.college_id, self.program_id))
        db.commit()
        cursor.close()

    @classmethod
    def delete_by_id_number(cls, id_number):
        try:
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT student_id FROM students WHERE id_number = %s", (id_number,))
            result = cursor.fetchone()
            if not result:
                return False  # no student found

            student_id = result[0]
            cursor.execute("DELETE FROM students WHERE student_id = %s", (student_id,))
            db.commit()
            cursor.close()
            return True
        except Exception as e:
            print(f"Error deleting student: {e}")
            return False
        
    @classmethod
    def update_by_id_number(cls, id_number, last_name, first_name, gender, year_level, college_id, program_id):
        try:
            db = get_db()
            cursor = db.cursor()
            sql = """
                UPDATE students
                SET last_name = %s, first_name = %s, gender = %s, year_level = %s,
                    college_id = %s, program_id = %s
                WHERE id_number = %s
            """
            cursor.execute(sql, (last_name, first_name, gender, year_level, college_id, program_id, id_number))
            db.commit()
            cursor.close()
            return cursor.rowcount > 0
        except Exception as e:
            print(f"Error updating student: {e}")
            return False

    @classmethod
    def all(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
        SELECT s.student_id, s.id_number, s.last_name, s.first_name, s.gender, s.year_level,
            s.college_id, s.program_id,
            COALESCE(p.program_code, 'N/A') AS program_code,
            COALESCE(p.program_name, 'N/A') AS program_name
        FROM students s
        LEFT JOIN programs p ON s.program_id = p.id
        LEFT JOIN colleges c ON s.college_id = c.id
        """)
        result = cursor.fetchall()
        cursor.close()

        return [
            cls(
                student_id=row[0],
                id_number=row[1],
                last_name=row[2],
                first_name=row[3],
                gender=row[4],
                year_level=row[5],
                college_id=row[6],
                program_id=row[7],
                program_code=row[8],
                program_name=row[9]
            )
            for row in result
        ]

