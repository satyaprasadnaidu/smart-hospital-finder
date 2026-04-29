from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS so the frontend can communicate with the backend

@app.route('/search', methods=['POST'])
def search():
    # Get the JSON data sent from the frontend
    data = request.get_json()
    
    # Extract the symptom
    symptom = data.get('symptom', '')
    
    # Create the response dictionary
    response = {
        "message": "Received symptom",
        "symptom": symptom
    }
    
    # Return it as JSON
    return jsonify(response)

if __name__ == '__main__':
    # Run the server on http://127.0.0.1:5000
    app.run(debug=True, port=5000)
