const equipments = [
    "Single Tent", 
    "3 Tents", 
    "Trailer up to 18ft"
]
    
const nights = [
    "1","2", "3", "4", "5", "6", "7", "8", "9", "10"
]

window.onload = function() {
    let equipmentSelect = document.getElementById("equipment");
    let nightsSelect = document.getElementById("nights");
    for (var x in equipments) {
      equipmentSelect.options[equipmentSelect.options.length] = new Option(equipments[x], equipments[x]);
    }
    for (var y in nights) {
        nightsSelect.options[nightsSelect.options.length] = new Option(nights[y], nights[y]);
    }
}

const passFilters = () => {
    let selectedEquipment = document.getElementById("equipment");
    let equipmentText = selectedEquipment.options[selectedEquipment.selectedIndex].text;

    let selectedNights = document.getElementById("nights");
    let nightsText = selectedNights.options[selectedNights.selectedIndex].text;

    window.location.href=`choosing.html?equipment=${equipmentText}&nights=${nightsText}`;
}