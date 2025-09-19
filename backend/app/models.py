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