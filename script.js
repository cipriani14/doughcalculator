/**
 * Toggles the visibility of the Totals section.
 */
function toggleTotals() {
    const totalsContent = document.getElementById('totalsContent');
    const totalsToggleArrow = document.getElementById('totalsToggleArrow');
    if (totalsContent) {
        const isHidden = totalsContent.style.display === 'none';
        totalsContent.style.display = isHidden ? 'block' : 'none';
        if (totalsToggleArrow) {
            // Use textContent or innerHTML to change the arrow character
            totalsToggleArrow.textContent = isHidden ? '▼' : '►'; // Down arrow when shown, Right arrow when hidden
            totalsToggleArrow.classList.toggle('expanded', isHidden);
        }
    }
}

/**
 * Calculates the pizza dough ingredients based on user inputs.
 * Displays the results in the #results div.
 */
function calculate() {
    // Get values from input fields
    const doughSize = parseFloat(document.getElementById("doughSize").value);
    const numBalls = parseInt(document.getElementById("numBalls").value);
    const hydration = parseFloat(document.getElementById("hydration").value);
    const yeastPercentageFromInput = parseFloat(document.getElementById("yeast").value);
    const saltPercentage = parseFloat(document.getElementById("salt").value);

    // Validate basic inputs
    if (isNaN(doughSize) || doughSize <= 0 ||
        isNaN(numBalls) || numBalls <= 0 ||
        isNaN(hydration) || hydration < 0 || hydration > 100 ||
        isNaN(yeastPercentageFromInput) || yeastPercentageFromInput < 0 || 
        isNaN(saltPercentage) || saltPercentage < 0) { 
        displayError("Please enter valid positive values for all fields.");
        return;
    }
    
    // --- Calculation Logic ---
    const totalDoughWeightForAllBalls = numBalls * doughSize;
    const totalTargetDoughWeightWithBuffer = totalDoughWeightForAllBalls * 1.05; 
    const bufferAmount = totalTargetDoughWeightWithBuffer - totalDoughWeightForAllBalls;

    const poolishPrefermentWeightAsRatioOfTotalFlour = 0.20; 
    const poolishYeastRateOnPrefermentWeight = 0.13; 

    const baseIngredientPercentagesForTotalFlour = 100 + hydration + saltPercentage + yeastPercentageFromInput;
    const totalFlour = totalTargetDoughWeightWithBuffer / (baseIngredientPercentagesForTotalFlour / 100);

    // --- Poolish Calculations ---
    const totalWeightOfPoolishPreferment = totalFlour * poolishPrefermentWeightAsRatioOfTotalFlour;
    const poolishFlour_amount = totalWeightOfPoolishPreferment / 2;
    const poolishWater_amount = totalWeightOfPoolishPreferment / 2;
    const poolishYeast_amount = (poolishYeastRateOnPrefermentWeight / 100) * totalWeightOfPoolishPreferment;

    // --- Main Dough Calculations ---
    const mainDoughFlour = totalFlour - poolishFlour_amount;
    const totalWater_overall = (hydration / 100) * totalFlour;
    const mainDoughWater = totalWater_overall - poolishWater_amount;
    const mainDoughSalt = (saltPercentage / 100) * totalFlour; 
    const mainDoughYeast = (yeastPercentageFromInput / 100) * mainDoughFlour; 

    const finalRecipeWeight = poolishFlour_amount + poolishWater_amount + poolishYeast_amount + mainDoughFlour + mainDoughWater + mainDoughSalt + mainDoughYeast;
    const actualLeftover = finalRecipeWeight - totalDoughWeightForAllBalls;

    // Display results
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<h2>Recipe Breakdown</h2>" +
                           "<h3>Poolish</h3>" +
                           "<p>Flour: " + poolishFlour_amount.toFixed(0) + "g</p>" +
                           "<p>Water: " + poolishWater_amount.toFixed(0) + "g</p>" +
                           "<p>Yeast (IDY): " + poolishYeast_amount.toFixed(2) + "g</p>" +
                           "<h3>Main Dough</h3>" +
                           "<p>Flour: " + mainDoughFlour.toFixed(0) + "g</p>" +
                           "<p>Water: " + mainDoughWater.toFixed(0) + "g</p>" +
                           "<p>Salt: " + mainDoughSalt.toFixed(2) + "g</p>" +
                           "<p>Yeast (IDY): " + mainDoughYeast.toFixed(2) + "g</p>" +
                           "<hr style='margin: 15px 0; border-top: 1px solid #e6f6ff;'>" + 
                           // Make the Totals heading clickable
                           "<h3 class='collapsible-header' onclick='toggleTotals()'>" +
                               "Totals <span id='totalsToggleArrow' class='toggle-arrow'>►</span>" + // Right arrow initially (hidden)
                           "</h3>" +
                           // Wrap totals content in a div, initially hidden
                           "<div id='totalsContent' style='display: none;'>" +
                               "<p>Total Flour: " + totalFlour.toFixed(0) + "g</p>" +
                               "<p>Total Water: " + totalWater_overall.toFixed(0) + "g</p>" +
                               "<p>Total Salt: " + mainDoughSalt.toFixed(2) + "g</p>" +
                               "<p>Total Yeast (IDY): " + (poolishYeast_amount + mainDoughYeast).toFixed(2) + "g</p>" +
                               "<p><strong>Total Dough Weight (approx.): " + finalRecipeWeight.toFixed(0) + "g</strong></p>" +
                               "<p><em>After making " + numBalls + (numBalls === 1 ? " dough ball" : " dough balls") + " of " + doughSize.toFixed(0) + "g each, you should have approximately " + actualLeftover.toFixed(0) + "g of dough leftover.</em></p>" +
                               "<p><small>This recipe aims to produce enough dough for " + numBalls + (numBalls === 1 ? " ball" : " balls") + " (" + totalDoughWeightForAllBalls.toFixed(0) + "g) plus an intended ~5% buffer (approx. " + bufferAmount.toFixed(0) + "g). Target with buffer: " + totalTargetDoughWeightWithBuffer.toFixed(0) + "g. Actual recipe yield: " + finalRecipeWeight.toFixed(0) + "g.</small></p>" +
                           "</div>"; // Close totalsContent div
    
    // Ensure totals are hidden by default when new calculation is made
    // and arrow is reset.
    const totalsContentDiv = document.getElementById('totalsContent');
    const totalsArrowSpan = document.getElementById('totalsToggleArrow');
    if (totalsContentDiv) totalsContentDiv.style.display = 'none';
    if (totalsArrowSpan) {
        totalsArrowSpan.textContent = '►'; // Right arrow
        totalsArrowSpan.classList.remove('expanded');
    }
}

/**
 * Displays an error message in the #results div.
 * @param {string} message - The error message to display.
 */
function displayError(message) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<h2 style='color: #f04e98;'>Error</h2><p style='color: #f04e98; text-align: center;'>" + message + "</p>";
}

document.addEventListener('DOMContentLoaded', function() {
    const resultsDiv = document.getElementById("results");
    if (!resultsDiv.innerHTML.includes("<h3>")) { 
         resultsDiv.innerHTML = '<h2>Recipe Breakdown</h2><p style="text-align:center; color: #777;">Enter your dough parameters above and click "Calculate".</p>';
    }
});

