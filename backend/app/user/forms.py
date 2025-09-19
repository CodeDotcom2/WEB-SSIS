from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators, SubmitField, BooleanField


class UserForm(FlaskForm):
    username = StringField('Username', [validators.DataRequired(), validators.Length(min=3, max=20)])
    email = StringField('Email Address', [validators.Length(min=10, max=50)])
    password = PasswordField('Password', [validators.DataRequired()])
    submit = SubmitField("Submit")


class LoginForm(FlaskForm):
    username = StringField('Username', [validators.DataRequired(), validators.Length(min=3, max=20)])
    password = PasswordField('Password', [validators.DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField("Login")