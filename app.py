from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from datetime import timedelta
import sqlite3

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'IISE_2025'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

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

# Login API endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({
            'message': 'Veuillez fournir un nom d\'utilisateur et un mot de passe.',
            'status': 'error'
        }), 400

    user = User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({
            'message': 'Identifiants invalides. Veuillez vérifier vos informations de connexion.',
            'status': 'error'
        }), 401

    # Create access token
    access_token = create_access_token(identity=user.username)

    return jsonify({
        'message': 'Connexion réussie. Bienvenue!',
        'status': 'success',
        'access_token': access_token,
        'username': user.username,
        'email': user.email
    }), 200

# Token validation API endpoint
@app.route('/api/validate-token', methods=['POST'])
def validate_token():
    try:
        verify_jwt_in_request()
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()

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
            'message': 'Token invalide ou expiré',
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
                'pompe': bool(row[4]),
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

# Lancer le serveur
if __name__ == '__main__':
    app.run(debug=True)
