const BASE_URL ='https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/btc.min.json';
const dropdowns =document.querySelectorAll('.dropdown select');


for(let select of dropdowns){
    for(let currCode in countryList){
        let option = document.createElement('option');
        option.value = currCode;
        option.innerText = currCode;
        select.append(option);
    }
}