# from flask import Blueprint, request, jsonify
# import requests

# therapist_bp = Blueprint('therapist', __name__)

# @therapist_bp.route('/chat', methods=['POST'])
# def chat():
#     print("Therapist route hit")
#     user_message = request.json.get('message')

#     try:
#         node_response = requests.post(
#             'http://localhost:4000/chat',
#             json={'message': user_message}
#         )
#         print("Got response from Node.js backend") 
#         return jsonify(node_response.json())

#     except Exception as e:
#         print("Error:", e)
#         return jsonify({'error': str(e)})
from flask import Blueprint, request, jsonify
import requests

therapist_bp = Blueprint('therapist', __name__)

@therapist_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message')

        # call Node service
        node_response = requests.post(
            'http://localhost:4000/chat',
            json={'message': user_message}
        )
        result = node_response.json()

        # Just pass along the Node's JSON to your frontend
        return jsonify(result)

    except Exception as e:
        print("Error talking to Node therapist:", e)
        return jsonify({"error": str(e)}), 500
