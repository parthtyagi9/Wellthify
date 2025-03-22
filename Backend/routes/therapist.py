from flask import Blueprint, request, jsonify
import requests

therapist_bp = Blueprint('therapist', __name__)

@therapist_bp.route('/chat', methods=['POST'])
def chat():
    print("Therapist route hit")
    user_message = request.json.get('message')

    try:
        node_response = requests.post(
            'http://localhost:4000/chat',
            json={'message': user_message}
        )

        print("Got response from Node.js backend") 
        return jsonify(node_response.json())

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)})