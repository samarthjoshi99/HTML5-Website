const equipments = [
    "Single Tent", 
    "3 Tents", 
    "Trailer up to 18ft"
]
    
const nights = [
    "1","2", "3", "4", "5", "6", "7", "8", "9", "10"
]

let filterParamEquipmentType;
let filterParamNights;

let resultList = new Array();

async function pageLoaded(){



    let equipmentSelect = document.getElementById("equipment");
    let nightsSelect = document.getElementById("nights");
    for (var x in equipments) {
      equipmentSelect.options[equipmentSelect.options.length] = new Option(equipments[x], equipments[x]);
    }
    for (var y in nights) {
        nightsSelect.options[nightsSelect.options.length] = new Option(nights[y], nights[y]);
    }


    const params = new URLSearchParams(document.location.search);
    const et = params.get("equipment");
    const n = params.get("nights");

    filterParamEquipmentType = et;
    filterParamNights = n;

    localStorage.setItem("defaultEquip", et);
    localStorage.setItem("defaultNight", n);

    document.querySelector("#equipment").value = et;
    document.querySelector("#nights").value = n;

    getData(et,n);
    displaySearchResults();
}


async function getData(equipment,nights) 
{
    const response = await fetch("./projectAPI.json");
    let apiData = await response.json();
    
    if(equipment == "Show All")
    {
        for(i=0; i<apiData.length; i++)
        {
            let daysAvailable = localStorage.getItem(apiData[i].siteNumber);
            if(daysAvailable == null)
            {
                localStorage.setItem(apiData[i].siteNumber, 10);
            }

            if(parseInt(daysAvailable) >= parseInt(nights))
                {
                    resultList.push(apiData[i]);
                }       
        }
    }else{
        for(i=0; i<apiData.length; i++)
        {
            let daysAvailable = localStorage.getItem(apiData[i].siteNumber);
            if(daysAvailable == null)
            {
                localStorage.setItem(apiData[i].siteNumber, 10);
            }

            for(j=0; j<apiData[i].equipment.length; j++)
            {
                if((apiData[i].equipment[j] == equipment) && (parseInt(daysAvailable) >= parseInt(nights)) && (equipment != "Show All"))
                {
                    resultList.push(apiData[i]);
                }
            }           
        }
    }
    console.log("resultlist " + resultList);
    displaySearchResults();
}

const displaySearchResults = () =>
{
    console.log("displaysearch");
    let orderSummaryContainer = document.querySelector("#searchResults");
    let content = ``;
    for (i=0; i<resultList.length; i++)
    {
    
        let daysAvailable = localStorage.getItem(resultList[i].siteNumber);
        console.log(daysAvailable);

        content = content + 
        `   <div class = "searchRow">
                <div class = "imageDiv">
                    <img src="${resultList[i].image}" alt="Italian Trulli">
                </div>
                <div class = "searchRowDetails">
                    <span>Site Number: ${resultList[i].siteNumber}</span> </br>
                    <span class = "equipment" >Equipment: </span>
                    <span class = "equipmentList">${resultList[i].equipment[0]}</span>
        `
        
        for(j=1; j<resultList[i].equipment.length; j++)
        {
            content = content + 
            `
                    <span class = "equipmentList">, ${resultList[i].equipment[j]}</span>
            `
        }

        content = content + 
        `
                    </br>
                    <span> Days Available: ${daysAvailable}</span>
                    </br>
        `

        if(resultList[i].hasPower)
        {
            content = content + 
            `   
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
                    <span class="material-symbols-outlined">bolt</span>
            `
        }
        
        if(resultList[i].isPremium)
        {
            content = content + 
        `
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
                    <span class="material-symbols-outlined">workspace_premium</span>
        `
        }

        if(!resultList[i].isRadioFree)
        {
            content = content + 
            `
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
                    <span class="material-symbols-outlined">radio</span>
            `
        }

        content = content + 
            `
                    </br>
                    <button onclick="bookSite(event)" class = "buttonDiv" id= "${resultList[i].siteNumber}">Book Site </button>
                </div>
            `

        

        content = content +  `</div>`
            orderSummaryContainer.innerHTML = content;
    }
}


const bookSite = (e) =>
{
    let number = e.currentTarget.id;

    window.location.href=`booking.html?siteNumber=${number}`;
}

const filterChange = (event) =>
{

    let equipment =  document.querySelector("#equipment").value.toString();
    let nights = document.querySelector("#nights").value.toString()

    let defaultE = localStorage.getItem("defaultEquip").toString();
    let defaultN = localStorage.getItem("defaultNight").toString();

    console.log(equipment);
    console.log(nights);
    
    resultList = [];

    if(((equipment !== defaultE) && (nights === defaultN)) || 
        ((equipment === defaultE) && (nights !== defaultN)) || 
        ((equipment === defaultE) && (nights === defaultN)))
    {
        getData(equipment,nights);
    }
    else{
        alert("You can only choose one filter at a time. Reverting filters to old values");
        
            document.querySelector("#equipment").value = defaultE;
       
            document.querySelector("#nights").value = defaultN;
            getData(defaultE,defaultN);
    }
}

document.querySelector("#equipment").addEventListener("change", filterChange)
document.querySelector("#nights").addEventListener("change", filterChange)
document.addEventListener("DOMContentLoaded", pageLoaded)


