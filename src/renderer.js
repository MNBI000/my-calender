document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear,listWeek'
        },
        themeSystem: 'bootstrap5',
        nowIndicator: true,
        businessHours: {
          // days of week. an array of zero-based day of week integers (0=Sunday)
          daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Thursday

          startTime: '9:00', // a start time (10am in this example)
          endTime: '17:00', // an end time (6pm in this example)
        },
       
        googleCalendarApiKey: 'AIzaSyB7awAcpI7llbv--DuYY204dBTvomA2hSM',
        events: [

          {
            title  : 'event1',
            start  : '2023-08-18T14:30:00',
            allDay : false,
            color: 'red',
            textColor: 'yellow',
          },
          {
            title  : 'event2',
            start  : '2023-08-15',
            end    : '2023-08-20',
            allDay : true,
            color: 'green',
            textColor: 'white'
          },
          {
            title  : 'eventDaily',
            start  : '2023-08-19',
            startTime: '12:30:00',
            startRecur:'2023-08-19',
            endRecur:'2023-08-29',
            endTime: '14:30:00',
            allDay : false, // will make the time show
            color: 'yellow',
            textColor: 'red'
          },
          {
            title  : 'dddddwwww',
            rrule: {
              freq: 'weekly',
              interval: 1,
              freq: 'monthly',
              byweekday: [ 'mo', 'fr' ],
              dtstart: '2023-02-01T10:30:00', // will also accept '20120201T103000'
              until: '2023-11-01' // will also accept '20120201'
            },
            duration: "2:00:00"
          },
          {
            title  : 'eventMonthly',
            rrule: {
              freq: 'monthly',
              interval: 1,
              dtstart: '2023-02-01T10:30:00', // will also accept '20120201T103000'
              until: '2023-11-01' // will also accept '20120201'
            },
            duration: "2:00:00"
          }
        ],
          // googleCalendarId: 'mohamednasser161@gmail.com',
          // eventDataTransform: function (googleEvent) {
          //   console.log(googleEvent);
          //   var expiredColor = '#37d88f'; // Set the color for expired events

          //   var eventColor = googleEvent.start < new Date() ? "" : expiredColor;
          //   console.log(eventColor);
          //       // var color = assignColorBasedOnTitle(googleEvent.summary);
          //       return {
          //         title: googleEvent.title,
          //         start: googleEvent.start,
          //         end: googleEvent.end,
          //         description: googleEvent.description,
          //         // color: color, // Assign color based on title
          //         backgroundColor: eventColor,
          //         // url: googleEvent.url
          //       };
              

          // }
        // },
        // googleCalendarApiKey: 'AIzaSyC-40AiTBDvPeeMT_iRU7zaLDkxJ_skTK4',
        // events: {
        //   googleCalendarId: 'mohamed.nasser21794@gmail.com'
        // },
        dateClick: function(info) {
        alert('a day has been clicked!\n'+ info.dateStr);
        },
        eventClick: function(event) {
          
         
            document.querySelector('dialog p').insertAdjacentHTML('beforeend', `${(event.event._def.extendedProps.description != undefined) ? event.event._def.extendedProps.description : "There is no description."}`);
            document.querySelector('dialog').style.display = 'block';

            
            const sound = require("sound-play");
            sound.play("../sounds/error.mp3");
        }
    });
    calendar.render();
});