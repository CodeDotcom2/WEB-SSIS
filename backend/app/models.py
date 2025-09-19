from app.database import get_db
from flask_login import UserMixin
import hashlib


class Users(UserMixin):

    def __init__(self, id=None, username=None, password=None, email=None):
        self.id = id
        self.username = username
        self.password = password
        self.email = email

    def add(self):
        db = get_db()
        cursor = db.cursor()
        
        password_hash = hashlib.md5(self.password.encode()).hexdigest()

        sql = "INSERT INTO users(username, user_password, email) VALUES (%s, %s, %s)"
        cursor.execute(sql, (self.username, password_hash, self.email))
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
                # Update with new password
                password_hash = hashlib.md5(password.encode()).hexdigest()
                sql = "UPDATE users SET username = %s, email = %s, user_password = %s WHERE id = %s"
                cursor.execute(sql, (username, email, password_hash, user_id))
            else:
                # Update without changing password
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
        password_hash = hashlib.md5(password.encode()).hexdigest()
        return self.password == password_hash

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
        cursor.execute("SELECT id, program_code, program_name, college_id FROM programs")
        result = cursor.fetchall()
        cursor.close()
        return [cls(id=row[0], program_code=row[1], program_name=row[2], college_id=row[3]) for row in result]


class Student:
    def __init__(self, id_number=None, last_name=None, first_name=None, gender=None, year_level=None, college_id=None, program_id=None, program_name=None):
        self.id_number = id_number
        self.last_name = last_name
        self.first_name = first_name
        self.gender = gender
        self.year_level = year_level
        self.college_id = college_id
        self.program_id = program_id
        self.program_name = program_name

    def add(self):
        db = get_db()
        cursor = db.cursor()
        sql = """INSERT INTO students (id_number, last_name, first_name, gender, year_level, college_id, program_id)
                 VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(sql, (self.id_number, self.last_name, self.first_name, self.gender, self.year_level, self.college_id, self.program_id))
        db.commit()
        cursor.close()

    @classmethod
    def all(cls):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT id_number, last_name, first_name, gender, year_level, college_id, program_id FROM students")
        result = cursor.fetchall()
        cursor.close()
        return [cls(id_number=row[0], last_name=row[1], first_name=row[2], gender=row[3], year_level=row[4], college_id=row[5], program_id=row[6]) for row in result]
