from flask import jsonify, request, session
from sqlalchemy import inspect, or_
from werkzeug.security import check_password_hash, generate_password_hash

from config import app, db
from models import Contact, Group, User


def require_user():
    user_id = session.get("user_id")
    user = db.session.get(User, user_id) if user_id else None
    if not user:
        return None, (jsonify({"message": "Authentication required"}), 401)
    return user, None


@app.post("/api/register")
def register():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "An account with that email already exists"}), 409
    user = User(email=email, password_hash=generate_password_hash(password))
    user.groups = [Group(name=name) for name in ("Home", "Friends", "Work")]
    db.session.add(user)
    db.session.commit()
    session["user_id"] = user.id
    return jsonify({"user": {"id": user.id, "email": user.email}}), 201


@app.post("/api/login")
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, data.get("password", "")):
        return jsonify({"message": "email or password is Invalid"}), 401
    session["user_id"] = user.id
    return jsonify({"user": {"id": user.id, "email": user.email}})


@app.post("/api/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out"})


@app.get("/api/me")
def me():
    user, error = require_user()
    if error:
        return error
    return jsonify({"user": {"id": user.id, "email": user.email}})


@app.get("/api/groups")
def get_groups():
    user, error = require_user()
    if error:
        return error
    return jsonify({"groups": [group.to_json() for group in user.groups]})


@app.post("/api/groups")
def create_group():
    user, error = require_user()
    if error:
        return error
    name = (request.get_json() or {}).get("name", "").strip()
    if not name:
        return jsonify({"message": "Group name is required"}), 400
    if Group.query.filter_by(user_id=user.id, name=name).first():
        return jsonify({"message": "Group already exists"}), 409
    group = Group(name=name, user_id=user.id)
    db.session.add(group)
    db.session.commit()
    return jsonify({"group": group.to_json()}), 201


@app.route("/api/groups/<int:group_id>", methods=["PATCH", "DELETE"])
def group_detail(group_id):
    user, error = require_user()
    if error:
        return error

    group = Group.query.filter_by(id=group_id, user_id=user.id).first()
    if not group:
        return jsonify({"message": "Group is not found"}), 404
    if group.name in {"Home", "Friends", "Work"}:
        return jsonify({"message": "Default groups cannot be altered"}), 403

    if request.method == "DELETE":
        Contact.query.filter_by(group_id=group.id, user_id=user.id).update(
            {Contact.group_id: None}, synchronize_session=False
        )
        db.session.delete(group)
        db.session.commit()
        return jsonify({"message": "Group deleted"})

    name = (request.get_json() or {}).get("name", "").strip()
    if not name:
        return jsonify({"message": "Group name is required"}), 400
    if Group.query.filter(Group.user_id == user.id, Group.name == name, Group.id != group.id).first():
        return jsonify({"message": "Group already exists"}), 409
    group.name = name
    db.session.commit()
    return jsonify({"group": group.to_json()})


@app.get("/api/contacts")
def get_contacts():
    user, error = require_user()
    if error:
        return error
    query = Contact.query.filter_by(user_id=user.id)
    filter_name = request.args.get("filter", "all")
    if filter_name == "favorites":
        query = query.filter_by(is_favorite=True)
    elif filter_name != "all":
        query = query.join(Group).filter(Group.id == filter_name, Group.user_id == user.id)
    search = request.args.get("search", "").strip()
    if search:
        query = query.filter(or_(Contact.first_name.ilike(f"%{search}%"), Contact.last_name.ilike(f"%{search}%")))
    contacts = query.order_by(Contact.first_name, Contact.last_name).all()
    return jsonify({"contacts": [contact.to_json() for contact in contacts]})


@app.post("/api/contacts")
def create_contact():
    user, error = require_user()
    if error:
        return error
    data = request.get_json() or {}
    first_name = data.get("firstName", "").strip()
    if not first_name:
        return jsonify({"message": "First name is required"}), 400
    group_id = data.get("groupId")
    if group_id and not Group.query.filter_by(id=group_id, user_id=user.id).first():
        return jsonify({"message": "Invalid group"}), 400
    contact = Contact(first_name=first_name, last_name=data.get("lastName", "").strip() or None,
                      email=data.get("email", "").strip() or None, phone=data.get("phone", "").strip() or None,
                      is_favorite=bool(data.get("isFavorite", False)), user_id=user.id, group_id=group_id)
    db.session.add(contact)
    db.session.commit()
    return jsonify({"contact": contact.to_json()}), 201


@app.route("/api/contacts/<int:contact_id>", methods=["PATCH", "DELETE"])
def contact_detail(contact_id):
    user, error = require_user()
    if error:
        return error
    contact = Contact.query.filter_by(id=contact_id, user_id=user.id).first()
    if not contact:
        return jsonify({"message": "Contact not found"}), 404
    if request.method == "DELETE":
        db.session.delete(contact)
        db.session.commit()
        return jsonify({"message": "Contact deleted"})
    data = request.get_json() or {}
    if "firstName" in data:
        contact.first_name = data["firstName"].strip()
        if not contact.first_name:
            return jsonify({"message": "First name is required"}), 400
    if "lastName" in data:
        contact.last_name = data["lastName"].strip() or None
    if "email" in data:
        contact.email = data["email"].strip() or None
    if "phone" in data:
        contact.phone = data["phone"].strip() or None
    if "isFavorite" in data:
        contact.is_favorite = bool(data["isFavorite"])
    if "groupId" in data:
        group_id = data["groupId"]
        if group_id and not Group.query.filter_by(id=group_id, user_id=user.id).first():
            return jsonify({"message": "Invalid group"}), 400
        contact.group_id = group_id
    db.session.commit()
    return jsonify({"contact": contact.to_json()})


if __name__ == "__main__":
    with app.app_context():
        inspector = inspect(db.engine)
        if "contact" in inspector.get_table_names() and "user_id" not in {column["name"] for column in inspector.get_columns("contact")}:
            Contact.__table__.drop(db.engine)
        db.create_all()
    app.run(debug=True)