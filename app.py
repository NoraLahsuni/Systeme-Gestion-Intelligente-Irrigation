from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import sqlite3
from FakeData import start_fake_data_generator

app = Flask(__name__)

# Configure CORS properly
CORS(app, resources={
    r"/api/*": {  # Apply CORS to all /api/ routes
        "origins": ["http://localhost:3000", "http://localhost:5173"], 
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Range", "X-Content-Range"],
        "supports_credentials": True,
        "max_age": 120 
    }
})

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'IISE_2025'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Configure JWT to handle CORS
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Create all database tables
with app.app_context():
    db.create_all()
    # Insert a test user if it doesn't exist
    test_user = User.query.filter_by(username='iise').first()
    if not test_user:
        test_user = User(username='iise', email='iise@gmail.com')
        test_user.set_password('iise')
        db.session.add(test_user)
        db.session.commit()

# Modified login endpoint with CORS headers
@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        # Handle preflight request
        return jsonify({}), 200

    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'message': 'Données JSON manquantes',
                'status': 'error'
            }), 400

        username_or_email = data.get('username')
        password = data.get('password')

        if not username_or_email or not password:
            return jsonify({
                'message': 'Veuillez fournir un nom d\'utilisateur/email et un mot de passe.',
                'status': 'error'
            }), 400

        user = User.query.filter(
            (User.username == username_or_email) |
            (User.email == username_or_email)
        ).first()

        if not user or not user.check_password(password):
            return jsonify({
                'message': 'Identifiants invalides. Veuillez vérifier vos informations de connexion.',
                'status': 'error'
            }), 401

        access_token = create_access_token(
            identity=user.username,
            additional_claims={
                "email": user.email,
                "user_id": user.id
            }
        )

        response = jsonify({
            'message': 'Connexion réussie. Bienvenue!',
            'status': 'success',
            'access_token': access_token,
            'username': user.username,
            'email': user.email
        })

        return response, 200

    except Exception as e:
        return jsonify({
            'message': f'Erreur lors de la connexion: {str(e)}',
            'status': 'error'
        }), 500

# Modified validate-token endpoint with CORS headers
@app.route('/api/validate-token', methods=['GET', 'OPTIONS'])
@jwt_required()
def validate_token():
    if request.method == 'OPTIONS':
        # Handle preflight request
        return jsonify({}), 200

    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()

        if not user:
            return jsonify({
                'message': 'Utilisateur non trouvé',
                'status': 'error',
                'isValid': False
            }), 401

        return jsonify({
            'message': 'Token valide',
            'status': 'success',
            'isValid': True,
            'userData': {
                'username': user.username,
                'email': user.email
            }
        }), 200

    except Exception as e:
        return jsonify({
            'message': f'Erreur lors de la validation du token: {str(e)}',
            'status': 'error',
            'isValid': False
        }), 401



# ✅ Nouvel endpoint : récupérer les données des capteurs
@app.route('/api/mesures', methods=['GET'])
def get_mesures():
    try:
        conn = sqlite3.connect('donnees_capteurs.db')
        cur = conn.cursor()
        cur.execute("SELECT * FROM mesures ORDER BY timestamp DESC LIMIT 10")
        rows = cur.fetchall()
        conn.close()
        

        # Format JSON
        mesures = []
        for row in rows:
            mesures.append({
                'id': row[0],
                'temperature': row[1],
                'humidite': row[2],
                'potentiometre': row[3],
                'pompe': row[4],
                'timestamp': row[5]
            })

        return jsonify({
            'status': 'success',
            'donnees': mesures
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
    

# ✅ Endpoint : récupérer la dernière mesure
@app.route('/api/mesures/last', methods=['GET'])
def get_last_mesure():
    try:
        conn = sqlite3.connect('donnees_capteurs.db')
        cur = conn.cursor()
        cur.execute("SELECT * FROM mesures ORDER BY timestamp DESC LIMIT 1")
        row = cur.fetchone()
        conn.close()

        if row is None:
            return jsonify({
                'status': 'error',
                'message': 'Aucune mesure trouvée'
            }), 404

        mesure = {
            'id': row[0],
            'temperature': row[1],
            'humidite': row[2],
            'potentiometre': row[3],
            'pompe': row[4],
            'timestamp': row[5]
        }

        return jsonify({
            'status': 'success',
            'donnee': mesure
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# Lancer le serveur
if __name__ == '__main__':
    # Start the fake data generator
    start_fake_data_generator()
    app.run(debug=True)