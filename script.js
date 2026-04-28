// This function runs when the "Search" button is clicked
function searchSymptom() {
    // 1. Get the input field element from the HTML using its ID
    const symptomInput = document.getElementById('symptomInput');
    
    // 2. Read the current value typed into the input field
    const symptomValue = symptomInput.value;
    
    // 3. Print the entered symptom to the browser console
    console.log("Entered Symptom:", symptomValue);
    
    // Optional: Also display a small message in the result section for visual feedback
    const resultSection = document.getElementById('result');
    if (symptomValue.trim() !== "") {
        resultSection.textContent = "Symptom logged! Check your console.";
        resultSection.style.color = "#27ae60"; // Green color
    } else {
        console.log("No symptom entered.");
        resultSection.textContent = "Please enter a symptom.";
        resultSection.style.color = "#e74c3c"; // Red color
    }
}
