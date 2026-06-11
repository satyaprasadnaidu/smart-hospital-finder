from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS so the frontend can communicate with the backend

# Define a dictionary that maps common symptoms to medical specializations
symptom_map = {
    "fever": "General Physician",
    "chest pain": "Cardiologist",
    "skin rash": "Dermatologist",
    "headache": "Neurologist",
    "eye pain": "Ophthalmologist"
}

@app.route('/search', methods=['POST'])
def search():
    # Get the JSON data sent from the frontend
    data = request.get_json()

    symptom = data.get('symptom', '')

    # Convert the symptom to lowercase as requested
    symptom_lower = symptom.lower().strip()
    
    # Search in symptom_map. If not found, default to "General Physician"
    specialization = symptom_map.get(symptom_lower, "General Physician")
    
    # Create the response dictionary with the lowercase symptom and specialization
    response = {
        "symptom": symptom_lower,
        "specialization": specialization
    }
    
    # Return it as JSON
    return jsonify(response)

if __name__ == '__main__':
    # Run the server on http://127.0.0.1:5000
    app.run(debug=True, port=5000)
