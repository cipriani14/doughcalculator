function calculate() {
    // Get values from input fields
    var doughSize = parseFloat(document.getElementById("doughSize").value);
    var numBalls = parseInt(document.getElementById("numBalls").value);
    var hydration = parseFloat(document.getElementById("hydration").value);
    var saltPercentage = 3; // Default salt percentage
    var yeastPercentage = 0.5; // Default yeast percentage
    var wastePercentage = 5; // Waste percentage

    // Calculate total weight of dough
    var totalWeightOfDough = numBalls * doughSize;

    // Apply waste percentage to total weight of dough
    var totalWeightWithWaste = totalWeightOfDough * (1 + (wastePercentage / 100));

    // Calculate total percentages
    var totalPercentages = 100 + hydration + saltPercentage + yeastPercentage;

    // Calculate multiplier
    var multiplier = totalPercentages / 100;

    // Calculate total flour
    var totalFlour = totalWeightWithWaste / multiplier;

    // Calculate poolish size (20% of total flour weight)
    var poolishSize = totalFlour * 0.20;

    // Calculate flour and water for poolish (divide poolish size by 2)
    var poolishFlour = poolishSize / 2;
    var poolishWater = poolishSize / 2;

    // Calculate yeast for poolish (0.13% of total poolish size)
    var poolishYeast = 0.13 / 100 * poolishSize;

    // Calculate water, salt, and yeast for the main dough
    var water = (hydration / 100) * totalFlour;
    var salt = (saltPercentage / 100) * totalFlour;
    var yeast = (yeastPercentage / 100) * totalFlour;

    // Subtract flour and water used in poolish from total flour and water
    totalFlour -= poolishFlour;
    water -= poolishWater;

    // Display results
    var resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<h2>Results (w/5% waste)</h2>" +
                           "<h3>Main Dough</h3>" +
                           "<p>Total Flour: " + totalFlour.toFixed(2) + "g</p>" +
                           "<p>Water: " + water.toFixed(2) + "g</p>" +
                           "<p>Salt: " + salt.toFixed(2) + "g</p>" +
                           "<p>Yeast: " + yeast.toFixed(2) + "g</p>" +
                           "<h3>Poolish</h3>" +
                           "<p>Poolish Size: " + poolishSize.toFixed(2) + "g</p>" +
                           "<p>Poolish Flour: " + poolishFlour.toFixed(2) + "g</p>" +
                           "<p>Poolish Water: " + poolishWater.toFixed(2) + "g</p>" +
                           "<p>Poolish Yeast: " + poolishYeast.toFixed(2) + "g</p>";
}

function toggleCustomization() {
    var customizeCheckbox = document.getElementById("customize");
    var customFieldsDiv = document.getElementById("customFields");

    // If the checkbox is checked, show the customFields div; otherwise, hide it
    if (customizeCheckbox.checked) {
        customFieldsDiv.style.display = "block";
    } else {
        customFieldsDiv.style.display = "none";
    }
}