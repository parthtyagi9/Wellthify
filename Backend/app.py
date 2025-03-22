from flask import Flask
from flask_cors import CORS
from routes.dietplan import dietplan_bp
from routes.therapist import therapist_bp


app = Flask(__name__)
CORS(app)

app.register_blueprint(therapist_bp, url_prefix='/api/therapist')
app.register_blueprint(dietplan_bp, url_prefix='/api/dietplan')

@app.route('/')
def home():
    return "Backend is running!"

if __name__ == 'main':
    app.run(debug=True, port=5050)