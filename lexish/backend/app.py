from data.topics import topics
from data.grammar import grammar
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import time
app = Flask(__name__)
CORS(app)

MAX_HEARTS = 5
RECOVER_TIME = 3600  # 1 tiếng = 3600s

user_data = {
    "steps": 0,
    "streak": 1,
    "hearts": 5,
    "last_update": time.time()
}

def update_hearts():
    print("update_hearts running")
    now = time.time()
    last = user_data["last_update"]
    hearts = user_data["hearts"]

    if hearts < MAX_HEARTS:
        passed = now - last
        recovered = int(passed // RECOVER_TIME)

        if recovered > 0:
            hearts = min(MAX_HEARTS, hearts + recovered)
            user_data["hearts"] = hearts
            user_data["last_update"] = last + recovered * RECOVER_TIME

    else:
        # nếu full tim thì reset time
        user_data["last_update"] = now

def load_users():
    with open("users.json", "r") as f:
        return json.load(f)

def save_users(users):
    with open("users.json", "w") as f:
        json.dump(users, f)
        
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    users = load_users()

    # check trùng
    for u in users:
        if u["username"] == username:
            return jsonify({"status": "error", "msg": "User đã tồn tại"})

    new_user = {
        "username": username,
        "password": password,
        "steps": 0,
        "streak": 1,
        "hearts": 5,
        "last_update": time.time()
    }

    users.append(new_user)
    save_users(users)

    return jsonify({"status": "ok"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    users = load_users()

    for u in users:
        if u["username"] == username and u["password"] == password:
            return jsonify({"status": "ok", "user": u})

    return jsonify({"status": "error", "msg": "Sai tài khoản"})

@app.route('/api/user', methods=['GET'])
def get_user():
    print("API /api/user was called")
    update_hearts()
    return jsonify(user_data)

@app.route('/api/user', methods=['POST'])
def update_user():
    data = request.json

    user_data["steps"] = data.get("steps", user_data["steps"])
    user_data["streak"] = data.get("streak", user_data["streak"])

    # nếu bị mất tim thì update time
    new_hearts = data.get("hearts", user_data["hearts"])
    if new_hearts < user_data["hearts"]:
        user_data["last_update"] = time.time()

    user_data["hearts"] = new_hearts

    return jsonify({"status": "ok"})

@app.route('/api/topics')
def get_topics():
    return jsonify(topics)

@app.route('/api/grammar')
def get_grammar():
    return jsonify(grammar)

if __name__ == '__main__':
    app.run(port=5000, use_reloader=False)
print("SERVER STARTED OK")