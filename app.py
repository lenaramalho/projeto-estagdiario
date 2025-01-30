from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

TICKETS_FILE = "tickets.json"

def load_tickets():
    if os.path.exists(TICKETS_FILE):
        with open(TICKETS_FILE, "r") as file:
            return json.load(file)
    return []

def save_tickets(tickets):
    with open(TICKETS_FILE, "w") as file:
        json.dump(tickets, file, indent=4)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/tickets", methods=["GET"])
def get_tickets():
    return jsonify(load_tickets())

@app.route("/tickets", methods=["POST"])
def create_ticket():
    data = request.json
    tickets = load_tickets()
    ticket = {
        "id": len(tickets) + 1,
        "title": data["title"],
        "description": data["description"],
        "priority": data["priority"],
        "status": "Aberto"
    }
    tickets.append(ticket)
    save_tickets(tickets)
    return jsonify(ticket), 201

@app.route("/tickets/<int:ticket_id>", methods=["PATCH"])
def update_ticket(ticket_id):
    tickets = load_tickets()
    for ticket in tickets:
        if ticket["id"] == ticket_id:
            ticket["status"] = request.json["status"]
            save_tickets(tickets)
            return jsonify(ticket)
    return {"error": "Ticket not found"}, 404

if __name__ == "__main__":
    app.run(debug=True)
