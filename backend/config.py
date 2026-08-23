import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get(
    "SECRET_KEY",
    "contactflow-development-key"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173"]
)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
db = SQLAlchemy(app)
