// This function runs when the "Search" button is clicked
async function searchSymptom() {
    // 1. Get the input field element from the HTML using its ID
    const symptomInput = document.getElementById('symptomInput');
    
    // 2. Read the current value typed into the input field
    const symptomValue = symptomInput.value;
    
    // Optional: Also display a small message in the result section for visual feedback
    const resultSection = document.getElementById('result');
    
    if (symptomValue.trim() === "") {
        console.log("No symptom entered.");
        resultSection.textContent = "Please enter a symptom.";
        resultSection.style.color = "#e74c3c"; // Red color
        return;
    }

    try {
        // Send POST request to backend
        const response = await fetch('http://127.0.0.1:5000/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Send symptom in JSON format
            body: JSON.stringify({ symptom: symptomValue })
        });

        // Receive response and print it in console
        const data = await response.json();
        console.log("Backend Response:", data);
        
        resultSection.textContent = "Search successful! Check console for response.";
        resultSection.style.color = "#27ae60"; // Green color
    } catch (error) {
        console.error("Error connecting to backend:", error);
        resultSection.textContent = "Error connecting to backend.";
        resultSection.style.color = "#e74c3c"; // Red color
    }
}
