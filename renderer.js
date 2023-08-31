// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fetch = require("node-fetch"),
    okBtn = document.getElementById("ok-button"),
    doneBtn = document.getElementById("done-button"),
    dialogElement = document.querySelector("dialog"),
    path = require('path'),
    sound = require("sound-play")


const apiData = async () => {
  const getAllDoneEvents = await fetch(
    "http://localhost/calendar-api/public/api/fetch-done",
    { method: "POST", body: "" }
  );
  const allDoneEvents = await getAllDoneEvents.json();
  const getAllEvents = await fetch(
    "http://localhost/calendar-api/public/api/fetch-events",
    { method: "POST", body: "" }
  );
  const allEvents = await getAllEvents.json();


  console.log(allDoneEvents);
  try {
    
  } catch (error) {
    
  }

  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear,listWeek",
    },
    themeSystem: "bootstrap5",
    nowIndicator: true,
    businessHours: {
      // days of week. an array of zero-based day of week integers (0=Sunday)
      daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday

      startTime: "9:00", // a start time (10am in this example)
      endTime: "17:00", // an end time (6pm in this example)
    },

    events: allEvents.events,
    eventDataTransform: function (myEvent) {
      var color = null;
      return {
        eventId: myEvent.id,
        title: myEvent.title,
        description: myEvent.description,
        color: color,
        // backgroundColor: color,
        done: myEvent.done,
        rrule: {
          freq: myEvent.rrule.freq,
          interval: myEvent.rrule.interval,
          // byweekday: [ 0,1,2,3,4 ],
          dtstart: myEvent.rrule.dtstart,
          until: myEvent.rrule.until,
        },
      };
    },
    dateClick: function (info) {
      alert("a day has been clicked!\n" + info.dateStr);
    },
    eventClick: function (event) {
      console.log(event);
      event.el.dataset.id = event.event._def.extendedProps.eventId
      document
      .querySelector("dialog p")
      .innerHTML =`${
        event.event._def.extendedProps.description != undefined
        ? event.event._def.extendedProps.description
        : "There is no description."
      }`;
      okBtn.dataset.id =
      event.event._def.extendedProps.eventId;
      doneBtn.dataset.id =
      event.event._def.extendedProps.eventId;
      dialogElement.style.display = "block";
      console.log(event.el.innerHTML);
      if (event.el.innerHTML.includes("green")) {
        doneBtn.style.display = 'none'
      } else {
        doneBtn.style.display = 'inline-block'
      }
    },
    eventContent: function(info) {
      // Calculate the date after 48 hours
      const now = new Date();
      const after48Hours = new Date(now.getTime() + (48 * 60 * 60 * 1000));
      const eventStartDate = new Date(info.event.start);
      eventStartDate.setDate(eventStartDate.getDate() + 1);
      const nowDateEvent = eventStartDate.toISOString().slice(0, 10);
      const IdOfEvent = info.event._def.extendedProps.eventId;
    
      const foundObject = allDoneEvents.events.find(obj => obj.id === IdOfEvent && obj.date === nowDateEvent);
    
    
      // Check if the event's start date is within the 48-hour range
      
    
      // Access the start date of the event
      if (foundObject) {
        info.event._def.extendedProps.done = 1;
        return {
          html: `<div style="background-color: green;display:flex;justify-content:space-between;padding: 3px 4px;">${info.event.title} <i class="fa-solid fa-calendar-check"></i></div>`
        };
      } else if (eventStartDate >= now && eventStartDate <= after48Hours) {
        sound.play(path.join(__dirname, "assets/sounds/alarm.wav"))
        alert(`${info.event.title} within 48 Hours from now and not done yet! \n ${new Date(info.event.start).toLocaleString("en-US")}`)
        return {
          html: `<div style="background-color: red;display:flex;justify-content:space-between;padding: 3px 4px;">${info.event.title} <i class="fa-solid fa-triangle-exclamation"></i></div>`
        };
      } else {
        return {
          html: `<div style="display:flex;justify-content:space-between;padding: 3px 4px;">${info.event.title}</div>`
        };
      }
    }
  });
  calendar.render();
};
document.addEventListener("DOMContentLoaded", function () {
  apiData();
  // setTimeout(() => {
  //   const now = new Date();
  // const after48Hours = new Date(now.getTime() + (48 * 60 * 60 * 1000));
  // const dateString = after48Hours.toISOString().slice(0, 10);
  // let DateAfter2Days = document.querySelector(`[data-date='${dateString}'] .fc-event`)
  // DateAfter2Days.style.backgroundColor = 'red';
  // console.log(DateAfter2Days, dateString);
  // console.log(DateAfter2Days, typeof(dateString));
  // console.log(DateAfter2Days, dateString.length);

  // }, 1000)
});


// elements event listeners

document.addEventListener('DOMContentLoaded', () => {

})

okBtn.addEventListener('click', () => {
    dialogElement.style.display = 'none'
    let eventElement = document.querySelector(`a[data-id='${okBtn.dataset.id}']`);
    eventElement.dataset.id = ""
    const now = new Date();
})
doneBtn.addEventListener('click', () => {
    dialogElement.style.display = 'none'
    
    let eventElement = document.querySelector(`a[data-id='${okBtn.dataset.id}']`);
    
    let parentDate = eventElement.closest("td"),
    date = parentDate.dataset.date
    eventElement.style.backgroundColor = "green"
    eventElement.dataset.id = ""

    const addDone = async () => {
        const body = JSON.stringify({
            id: okBtn.dataset.id,
            date: date
        })
        const response = await fetch(
            "http://localhost/calendar-api/public/api/add-done",
            { 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: okBtn.dataset.id,
                    date: date
                }) 
            }
          );
        const data = await response.text();
        console.log(`date: ${date}, id: ${okBtn.dataset.id}`)
        console.log(`api response: ${data}`)
        location.reload()
    }
    addDone()
})