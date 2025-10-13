import os
from dotenv import load_dotenv

base_dir = os.path.abspath(os.path.dirname(__file__))
dotenv_path = os.path.join(base_dir, "..", ".env")
load_dotenv(dotenv_path)

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
SECRET_KEY = os.getenv("SECRET_KEY")
