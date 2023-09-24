const { ipcRenderer } = require('electron');

// Open the authentication window when a button is clicked
document.getElementById('authorize_button').addEventListener('click', () => {
  ipcRenderer.send('open-auth-window');
});
// const { ipcRenderer } = require('electron');

// Listen for tokens received event from main process
ipcRenderer.on('tokens-received', async (event, tokens) => {
  // Use the tokens to fetch Google Calendar events
  const { google } = require('googleapis');
  const oauth2Client = new google.auth.OAuth2();

  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const response = await calendar.events.list({
      calendarId: 'primary', // Use the primary calendar of the authenticated user
      timeMin: new Date('1994-1-1').toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 1000000,
      orderBy: 'startTime',
    });

    const allEvents = [];
    const events = response.data.items;

    events.forEach(event => {
      let rrule = (event.recurrence != undefined) ? event.recurrence[0] : "";
      let match = rrule.match(/FREQ=(.*?);/);
      let match2 = rrule.match(/BYDAY=(.*?);/);
      let freq = "daily"
      let weekday = ""
      if (match) {
          freq = match[1];  // Outputs: WEEKLY
      }
      if (match2) {
          weekday = match2[1];  // Outputs: WEEKLY
      }
      allEvents.push(
          {
              eventId: event.id,
              title: event.summary,
              description: event.description,
              // color: color,
              // backgroundColor: color,
              
              start: event.start.dateTime,
              end: event.end.dateTime,
              rrule: event.recurrence !== undefined ? event.recurrence : undefined
          }
      )
    });
    const calendarEl = document.getElementById("calendar");
  const calendarFull = new FullCalendar.Calendar(calendarEl, {
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
    events: allEvents,
    // eventDataTransform: function (myEvent) {
    //   // var color = myEvent.color;
    //   console.log(typeof(myEvent.rrule.dtstart));
    //   var color = "";
    //   return {
    //     eventId: myEvent.id,
    //     title: myEvent.title,
    //     description: myEvent.description,
    //     // color: color,
    //     // backgroundColor: color,
    //     done: myEvent.done,
    //     rrule: {
    //       dtstart: myEvent.rrule.dtstart,
    //       freq: myEvent.rrule.freq,
    //       interval: myEvent.rrule.interval,
    //       byweekday: myEvent.rrule.weekdays,
    //       until: myEvent.rrule.until,
    //     },
    //   };
    // },
    dateClick: function (info) {
      alert("a day has been clicked!\n" + info.dateStr);
    },
    // eventClick: function (event) {
    //   console.log(event);
    //   event.el.dataset.id = event.event._def.extendedProps.eventId
    //   document
    //   .querySelector("dialog p")
    //   .innerHTML =`<h2>${event.event._def.title}</h2>${
    //     event.event._def.extendedProps.description != undefined
    //     ? event.event._def.extendedProps.description
    //     : "There is no description."
    //   }`;
    //   okBtn.dataset.id =
    //   event.event._def.extendedProps.eventId;
    //   doneBtn.dataset.id =
    //   event.event._def.extendedProps.eventId;
    //   dialogElement.style.display = "block";
    //   console.log(event.el.innerHTML);
    //   if (event.el.innerHTML.includes("green")) {
    //     doneBtn.style.display = 'none'
    //     undoBtn.style.display = 'inline-block'
    //   } else {
    //     undoBtn.style.display = 'none'
    //     doneBtn.style.display = 'inline-block'
    //   }
    // },
    // eventContent: function(info) {
    //   // Calculate the date after 48 hours
    //   const now = new Date();
    //   const after48Hours = new Date(now.getTime() + (72 * 60 * 60 * 1000));
    //   const eventStartDate = new Date(info.event.start);
    //   eventStartDate.setDate(eventStartDate.getDate() + 1);
    //   // const nowDateEvent = eventStartDate.toISOString().slice(0, 10);
    //   // const IdOfEvent = info.event._def.extendedProps.eventId;
    
    //   // const foundObject = allDoneEvents.events.find(obj => obj.id === IdOfEvent && obj.date === nowDateEvent);
    
    
    //   // Check if the event's start date is within the 48-hour range
    //   console.log(info);
    
    //   // Access the start date of the event
    //   if (eventStartDate >= now && eventStartDate <= after48Hours) {
        
        
    //     // alert(`${info.event.title} within 48 Hours from now and not done yet! \n ${new Date(info.event.start).toLocaleString("en-US")}`)
    //     return {
    //       html: `<div style="background-color: red;display:flex;justify-content:space-between;padding: 3px 4px;font-size:1.2rem;">${info.event.title} <i class="fa-solid fa-triangle-exclamation"></i></div>`
    //     };
    //   } else {
    //     return {
    //       html: `<div style="display:flex;justify-content:space-between;padding: 3px 4px;font-size:1.2rem;">${info.event.title}</div>`
    //     };
    //   }
    // }
  });
  document.getElementById('auth-button-container').style.display = 'none';
  calendarFull.render();
    // renderCalendarEvents(events); // Render the events in the HTML
  } catch (error) {
    console.error('Error listing upcoming events:', error);
    const eventList = document.getElementById('calendar_events');
    eventList.innerText = 'Error listing events: ' + error.message;
  }
});
