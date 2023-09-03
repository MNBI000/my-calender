const fetch = require("node-fetch")
const freqSelect = document.getElementById('selectFreq'),
    weekDays = document.getElementById('weekDays'),
    everyTimeInputContainer = document.getElementById('everyTimeInputContainer'),
    submitBtn = document.getElementById('submit'),
    e_title = document.getElementById('e-title'),
    e_start_date = document.getElementById('e-start-date'),
    e_end_date = document.getElementById('e-end-date'),
    selectFreq = document.getElementById('selectFreq'),
    weekday_mon = document.getElementById('weekday-mon'),
    weekday_tue = document.getElementById('weekday-tue'),
    weekday_wed = document.getElementById('weekday-wed'),
    weekday_thu = document.getElementById('weekday-thu'),
    weekday_fri = document.getElementById('weekday-fri'),
    weekday_sat = document.getElementById('weekday-sat'),
    weekday_sun = document.getElementById('weekday-sun'),
    everyTimeUnit = document.getElementById('everyTimeUnit'),
    e_description = document.getElementById('e-description')



function everyTimeUnitsRenderer(freqVal) {
    let unitsArray = {
        daily: 'Day',
        weekly: 'Week',
        monthly: 'Month',
        yearly: 'Year',
    };

    let unitSpan = document.getElementById('timeUnitSpan');

    unitSpan.innerHTML = unitsArray[freqVal] + '(s)';
}

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

submitBtn.addEventListener('click', async () => {
    const requestBody = {
        title: e_title.value,
        dtstart: new Date(e_start_date.value).toISOString().slice(0, 10),
        until: new Date(e_end_date.value).toISOString().slice(0, 10),
        freq: selectFreq.value,
        weekday_mon: weekday_mon.checked ? weekday_mon.value : null,
        weekday_tue: weekday_tue.checked ? weekday_tue.value : null,
        weekday_wed: weekday_wed.checked ? weekday_wed.value : null,
        weekday_thu: weekday_thu.checked ? weekday_thu.value : null,
        weekday_fri: weekday_fri.checked ? weekday_fri.value : null,
        weekday_sat: weekday_sat.checked ? weekday_sat.value : null,
        weekday_sun: weekday_sun.checked ? weekday_sun.value : null,
        interval: parseInt(everyTimeUnit.value),
        description: e_description.value
    }

console.log(requestBody);
    
  const getAllEvents = await fetch(
    "http://localhost/calendar-api/public/api/add-event",
    { 
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody) 
    }
  );
  const response = await getAllEvents.json()

  console.log(response)
})