const API_KEY = '7093f7dc6628eb1b00bd7b2f';
const dropdowns = document.querySelectorAll('.dropdown select');
const button = document.getElementById('btn');

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let option = document.createElement("option");
        option.innerText = currCode;
        option.value = currCode;
        if (select.id === "fromCurrency" && currCode === "USD") {
            option.selected = true;
        }
        if (select.id === "toCurrency" && currCode === "PKR") {
            option.selected = true;
        }
        select.append(option);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    })
}
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;

};
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let fromCurrency = document.getElementById("fromCurrency").value;
    let toCurrency = document.getElementById("toCurrency").value;
    let amount = document.querySelector(".amount input");
    let amtValue = amount.value;
    if (amtValue === "" || isNaN(amtValue) || amtValue <= 1) {
        alert("Please enter a valid amount");
        return;
    }
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.result !== "success") {
            throw new Error("API error");
        }

        const rate = data.conversion_rates[toCurrency];
        const convertedAmount = (amtValue * rate).toFixed(2);

        document.querySelector(".msg p").innerText =
            `${amtValue} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } catch (error) {
        console.error("Conversion error:", error);
        alert("Failed to get exchange rate. Try again.");
    }

});
