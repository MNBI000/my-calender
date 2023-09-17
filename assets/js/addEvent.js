const fetch = require("node-fetch")
const freqSelect = document.getElementById('selectFreq'),
    weekDays = document.getElementById('weekDays'),
    everyTimeInputContainer = document.getElementById('everyTimeInputContainer'),
    submitBtn = document.getElementById('submit'),
    e_title = document.getElementById('e-title'),
    e_start_date = document.getElementById('e-start-date'),
    e_start_time = document.getElementById('e-start-time'),
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

e_start_date.addEventListener('change', () => {
    let startVal = e_start_date.value
    e_end_date.value = startVal
})

function formatDateAndTime(dateString, timeString) {
    // Parse the date string into a Date object
    const date = new Date(dateString);
  
    // Check if the time string is empty
    if (!timeString) {
      // If the time string is empty, return only the date in 'YYYY-MM-DD' format
      return date.toISOString().split('T')[0];
    } else {
        const today = new Date(); // Get today's date
        const [hours, minutes] = timeString.split(':');
        today.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0); // Set the time

        // Get the Unix timestamp (milliseconds since epoch)
        const unixTimestamp = today.getTime() / 1000;
      // If the time string is not empty, append the time in 'HH:mm:ss' format
      return `${date.toISOString().split('T')[0]}T${unixTimestamp}`;
    }
  }

submitBtn.addEventListener('click', async () => {
    let dateStart = formatDateAndTime(e_start_date.value, e_start_time.value)
    const requestBody = {
        title: e_title.value,
        dtstart: e_start_date.value,
        until: new Date(e_end_date.value).toISOString().slice(0, 10),
        freq: selectFreq.value,
        weekdays: [
            weekday_mon.checked ? weekday_mon.value : null,
            weekday_tue.checked ? weekday_tue.value : null,
            weekday_wed.checked ? weekday_wed.value : null,
            weekday_thu.checked ? weekday_thu.value : null,
            weekday_fri.checked ? weekday_fri.value : null,
            weekday_sat.checked ? weekday_sat.value : null,
            weekday_sun.checked ? weekday_sun.value : null
        ],
        interval: parseInt(everyTimeUnit.value),
        description: e_description.value
    }

    console.log(requestBody);
    
  const getAllEvents = await fetch(
    "http://apidesktop.texasapostille.org/public/api/add-event",
    { 
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody) 
    }
  );
  const response = await getAllEvents.json()

  alert('Event created successfully!')
  window.location.reload();
})