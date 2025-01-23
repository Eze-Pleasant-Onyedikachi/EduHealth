document.getElementById("calculate").addEventListener("click", function () {
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    if (height > 0 && weight > 0) {
        const bmi = (weight / (height * height)).toFixed(2);
        document.getElementById("result").textContent = `Your BMI: ${bmi}`;
    } else {
        alert("Please enter valid height and weight.");
    }
});
