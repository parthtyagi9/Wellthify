from flask import Flask
from flask_cors import CORS
from routes.dietplan import dietplan_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(dietplan_bp, url_prefix='/api/dietplan')

@app.route('/')
def home():
    return "Backend is running!"


if __name__ == '__main__':
    app.run(debug=True)
