function everyTimeUnitsRenderer(freqVal) {
    let unitsArray = {
        daily: 'Day',
        weekly: 'Week',
        monthly: 'Month',
        annually: 'Year',
    };

    let unitSpan = document.getElementById('timeUnitSpan');

    unitSpan.innerHTML = unitsArray[freqVal];
}

let freqSelect = document.getElementById('selectFreq');
let weekDays = document.getElementById('weekDays');
let everyTimeInputContainer = document.getElementById('everyTimeInputContainer');
freqSelect.addEventListener('change', function(e) {
    let freqVal = this.value;
    if (freqVal == 'once') {
        weekDays.style.display = 'none';
        everyTimeInputContainer.style.display = 'none';
    } else if (freqVal == 'weekly') {
        weekDays.style.display = 'block';
        everyTimeInputContainer.style.display = 'block';
    } else {
        weekDays.style.display = 'none';
        everyTimeInputContainer.style.display = 'block';
    }
    everyTimeUnitsRenderer(freqVal);
})