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
        user_data = request.get_json()
        user_message = user_data.get('message')

        # Call Node's therapist
        node_resp = requests.post(
            'http://localhost:4000/chat',
            json={'message': user_message},
            timeout=10  # in seconds
        )

        # If Node isn't running, you'll get Connection Refused
        # If you do, check Node logs or run Node again
        result = node_resp.json()
        return jsonify(result)

    except Exception as e:
        print("Error talking to Node therapist:", e)
        return jsonify({"error": str(e)}), 500
