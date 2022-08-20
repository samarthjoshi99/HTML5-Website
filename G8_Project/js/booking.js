const nightlyRateForAll = 47.5;
let nightlyRate;
const tax = 0.13;
let site;

const pageLoaded = () => {
    const params = new URLSearchParams(document.location.search);
    const camp = params.get("siteNumber");
    site = camp;
    getCampSite();
}

async function getCampSite() {
    const response = await fetch("./projectAPI.json");
    let apiData = await response.json();
    for(i=0; i<apiData.length; i++){
        if(apiData[i].siteNumber == site){
            populateUI(apiData[i]);
            calculateNightlyRate(apiData[i]);
        }
    }
}

const populateUI = (campSite) => {
    document.getElementById("site").innerHTML = "Site: "+campSite.siteNumber;
    const equip = document.getElementById("equipment");
    equip.innerHTML = "Equipment: "


    for(i=0; i<campSite.equipment.length; i++){
        equip.innerHTML+=campSite.equipment[i] + ", ";
    }
    const icons = document.getElementById("icons");
    if(campSite.isPremium){
        icons.innerHTML+=`<img src="assets/premium.svg">`
    }
    if(campSite.hasPower){
        icons.innerHTML+=`<img src="assets/power.svg">`
    }
    if(!campSite.isRadioFree){
        icons.innerHTML+=`<img src="assets/radio.svg">`
    }

    let days = localStorage.getItem(campSite.siteNumber);
    const avail = document.getElementById("availability");
    avail.innerHTML = `Availability: ${days} of 10 days`
}

const receipt = (name, email, nights, nightlyRate) => {
    let id = Math.floor((Math.random() * 10000) + 1);
    document.getElementById("receipt-container").innerHTML = `
        <div id="receipt">
            <h4>Reservation #RES-${id}</h4>     
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Num Nights: ${nights}</p>
            <p>Nightly Rate: ${nightlyRate}</p>
            <p>Subtotal: ${nightlyRate*nights}</p>
            <p>Tax: ${nightlyRate*nights*tax}</p>
            <p>Total: ${nightlyRate*nights+nightlyRate*nights*tax}</p>
        </div>`
}

//to limit the input for nights
const limitNights = (input) => {
    let daysAvailable = parseInt(localStorage.getItem(site));
    let inp = parseInt(input.value);

    if (inp<=0) input.value=1;
    if (inp > daysAvailable) input.value=daysAvailable;
}

const showReceipt = () => {
    let nights = document.getElementById("number-of-nights").value;
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    //check for name and email not to be empty and nights not to be 0
    if (name!="" && email!="" && nights!=0) {
        receipt(name, email, nights, nightlyRate);

        //updating both localStorage and UI with the available nights after reservation
        let daysAvailable = localStorage.getItem(site);
        localStorage.setItem(site, daysAvailable-nights);
        let days = localStorage.getItem(site);
        const avail = document.getElementById("availability");
        avail.innerHTML = `Availability:: ${days} of 10 days`

        //updating input fields for the next reservation
        document.getElementById("number-of-nights").value = 0;
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
    }
    else if(name == "")
    {
        alert("Name cannot be left blank");
    }
    else if(email == "")
    {
        alert("Email cannot be left blank");
    }
    else if(nights == 0)
    {
        alert("Nights cannot be left as 0");
    }
}

const calculateNightlyRate = (campSite) => {
    if (campSite.isPremium && campSite.hasPower){
        nightlyRate = 62;
    }
    else if (campSite.isPremium) {
        nightlyRate = 57;
    }
    else if(campSite.hasPower){
        nightlyRate = 52.5;
    }
    else {
        nightlyRate = nightlyRateForAll;
    }
}

document.addEventListener("DOMContentLoaded", pageLoaded)
