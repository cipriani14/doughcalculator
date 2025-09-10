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
    const poolishYeastPercentage = 0.25;

    // CORRECTED LINE: The user's yeast input is removed from this foundational calculation.
    const baseIngredientPercentagesForTotalFlour = 100 + hydration + saltPercentage;
    const totalFlour = totalTargetDoughWeightWithBuffer / (baseIngredientPercentagesForTotalFlour / 100);

    // --- Poolish Calculations ---
    const totalWeightOfPoolishPreferment = totalFlour * poolishPrefermentWeightAsRatioOfTotalFlour;
    const poolishFlour_amount = totalWeightOfPoolishPreferment / 2;
    const poolishWater_amount = totalWeightOfPoolishPreferment / 2;
    const poolishYeast_amount = (poolishYeastPercentage / 100) * poolishFlour_amount;

    // --- Main Dough Calculations ---
    const mainDoughFlour = totalFlour - poolishFlour_amount;
    const totalWater_overall = (hydration / 100) * totalFlour;
    const mainDoughWater = totalWater_overall - poolishWater_amount;
    const mainDoughSalt = (saltPercentage / 100) * totalFlour;
    const mainDoughYeast = (yeastPercentageFromInput / 100) * mainDoughFlour;

    const finalRecipeWeight = poolishFlour_amount + poolishWater_amount + poolishYeast_amount + mainDoughFlour + mainDoughWater + mainDoughSalt + mainDoughYeast;
    const actualLeftover = finalRecipeWeight - totalDoughWeightForAllBalls;

    // Display results (no changes needed here)
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
                           "<h3 class='collapsible-header' onclick='toggleTotals()'>" +
                               "Totals <span id='totalsToggleArrow' class='toggle-arrow'>►</span>" +
                           "</h3>" +
                           "<div id='totalsContent' style='display: none;'>" +
                               "<p>Total Flour: " + totalFlour.toFixed(0) + "g</p>" +
                               "<p>Total Water: " + totalWater_overall.toFixed(0) + "g</p>" +
                               "<p>Total Salt: " + mainDoughSalt.toFixed(2) + "g</p>" +
                               "<p>Total Yeast (IDY): " + (poolishYeast_amount + mainDoughYeast).toFixed(2) + "g</p>" +
                               "<p><strong>Total Dough Weight (approx.): " + finalRecipeWeight.toFixed(0) + "g</strong></p>" +
                               "<p><em>After making " + numBalls + (numBalls === 1 ? " dough ball" : " dough balls") + " of " + doughSize.toFixed(0) + "g each, you should have approximately " + actualLeftover.toFixed(0) + "g of dough leftover.</em></p>" +
                               "<p><small>This recipe aims to produce enough dough for " + numBalls + (numBalls === 1 ? " ball" : " balls") + " (" + totalDoughWeightForAllBalls.toFixed(0) + "g) plus an intended ~5% buffer (approx. " + bufferAmount.toFixed(0) + "g). Target with buffer: " + totalTargetDoughWeightWithBuffer.toFixed(0) + "g. Actual recipe yield: " + finalRecipeWeight.toFixed(0) + "g.</small></p>" +
                           "</div>";

    const totalsContentDiv = document.getElementById('totalsContent');
    const totalsArrowSpan = document.getElementById('totalsToggleArrow');
    if (totalsContentDiv) totalsContentDiv.style.display = 'none';
    if (totalsArrowSpan) {
        totalsArrowSpan.textContent = '►';
        totalsArrowSpan.classList.remove('expanded');
    }
}
