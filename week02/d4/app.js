// document.addEventListener("DOMContentLoaded", () => {
//     const billInput = document.getElementById("bill");
//     const peopleInput = document.getElementById("people");
//     const peopleError = document.getElementById("people-error");
//     const customTipInput = document.getElementById("custom-tip");
//     const tipButtons = document.querySelectorAll(".tip-btn");
    
//     const tipAmountDisplay = document.getElementById("tip-amount");
//     const totalAmountDisplay = document.getElementById("total-amount");
//     const resetBtn = document.getElementById("reset-btn");

//     let billValue = 0.0;
//     let tipPercent = 0;
//     let peopleValue = 0;

    
//     const formatCurrency = (value) => {
//         return `$${value.toFixed(2)}`;
//     };

//     const calculate = () => {
//         if (peopleValue >= 1 && billValue > 0) {
//             const tipAmount = (billValue * (tipPercent / 100)) / peopleValue;
//             const totalAmount = (billValue / peopleValue) + tipAmount;

//             tipAmountDisplay.textContent = formatCurrency(tipAmount);
//             totalAmountDisplay.textContent = formatCurrency(totalAmount);
            
//             resetBtn.disabled = false;
//         } else {
//             tipAmountDisplay.textContent = "$0.00";
//             totalAmountDisplay.textContent = "$0.00";
//         }

//         if (billValue > 0 || tipPercent > 0 || peopleValue > 0 || customTipInput.value !== "") {
//             resetBtn.disabled = false;
//         } else {
//             resetBtn.disabled = true;
//         }
//     };

//     const clearActiveButtons = () => {
//         tipButtons.forEach(btn => {
//             btn.classList.remove("bg-[#26c0ab]", "text-[#00474b]");
//             btn.classList.add("bg-[#00474b]", "text-white");
//         });
//     };

//     const setActiveButton = (button) => {
//         clearActiveButtons();
//         button.classList.remove("bg-[#00474b]", "text-white");
//         button.classList.add("bg-[#26c0ab]", "text-[#00474b]");
//     };

//     billInput.addEventListener("input", (e) => {
//         const val = parseFloat(e.target.value);
//         billValue = val > 0 ? val : 0;
//         calculate();
//     });

//     peopleInput.addEventListener("input", (e) => {
//         const val = parseInt(e.target.value);
//         if (val === 0) {
//             peopleError.classList.remove("hidden");
//             peopleInput.classList.add("border-[#E17457]");
//             peopleInput.classList.remove("border-transparent", "hover:border-[#26c0ab]");
//             peopleValue = 0;
//         } else {
//             peopleError.classList.add("hidden");
//             peopleInput.classList.remove("border-[#E17457]");
//             peopleInput.classList.add("border-transparent", "hover:border-[#26c0ab]");
//             peopleValue = val > 0 ? val : 0;
//         }
//         calculate();
//     });

//     tipButtons.forEach(btn => {
//         btn.addEventListener("click", (e) => {
//             setActiveButton(e.target);
//             customTipInput.value = "";
//             tipPercent = parseFloat(e.target.getAttribute("data-val"));
//             calculate();
//         });
//     });

//     customTipInput.addEventListener("input", (e) => {
//         clearActiveButtons();
//         const val = parseFloat(e.target.value);
//         tipPercent = val > 0 ? val : 0;
//         calculate();
//     });

//     resetBtn.addEventListener("click", () => {
//         billInput.value = "";
//         peopleInput.value = "";
//         customTipInput.value = "";
        
//         billValue = 0;
//         peopleValue = 0;
//         tipPercent = 0;
        
//         peopleError.classList.add("hidden");
//         peopleInput.classList.remove("border-[#E17457]");
//         peopleInput.classList.add("border-transparent", "hover:border-[#26c0ab]");
        
//         clearActiveButtons();
        
//         tipAmountDisplay.textContent = "$0.00";
//         totalAmountDisplay.textContent = "$0.00";
        
//         resetBtn.disabled = true;
//     });
// });

// Get elements
const billInput = document.getElementById("bill");
const peopleInput = document.getElementById("people");
const tipButtons = document.querySelectorAll(".tip-btn");
const customTip = document.getElementById("custom-tip");

const tipAmount = document.getElementById("tip-amount");
const totalAmount = document.getElementById("total-amount");

const resetBtn = document.getElementById("reset-btn");

let tipPercent = 0;


// Calculate tip
function calculateTip() {

  const bill = parseFloat(billInput.value);
  const people = parseFloat(peopleInput.value);

  if (!bill || !people) {
    tipAmount.innerText = "$0.00";
    totalAmount.innerText = "$0.00";
    return;
  }

  const tip = (bill * tipPercent) / 100;
  const tipPerPerson = tip / people;

  const total = bill + tip;
  const totalPerPerson = total / people;

  tipAmount.innerText = "$" + tipPerPerson.toFixed(2);
  totalAmount.innerText = "$" + totalPerPerson.toFixed(2);
}


// Tip button click
tipButtons.forEach(button => {

  button.addEventListener("click", () => {

    tipPercent = button.innerText.replace("%", "");
    customTip.value = "";

    calculateTip();
  });

});


// Custom tip
customTip.addEventListener("input", () => {

  tipPercent = customTip.value;
  calculateTip();

});


// Input events
billInput.addEventListener("input", calculateTip);
peopleInput.addEventListener("input", calculateTip);


// Reset
resetBtn.addEventListener("click", () => {

  billInput.value = "";
  peopleInput.value = "";
  customTip.value = "";

  tipPercent = 0;

  tipAmount.innerText = "$0.00";
  totalAmount.innerText = "$0.00";

});