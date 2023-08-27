// Render the Calendar data
var calendarEl = document.getElementById('calendar');
var calendar = new FullCalendar.Calendar(calendarEl, window.calendarObj);
calendar.render();

// handle done and ok buttons
console.log(window.testBridge.calendarApi)