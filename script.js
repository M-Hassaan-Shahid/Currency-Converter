const BASE_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';
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
    const url = `${BASE_URL}/${fromCurrency.toLowerCase()}/${toCurrency.toLowerCase()}.json`;
    let response = await fetch(url);
    console.log(response);


});
