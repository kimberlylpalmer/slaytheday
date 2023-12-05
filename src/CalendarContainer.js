import React, { useEffect, useState } from "react";
import MonthlyCal from "./MonthlyCal";
import WeeklyCal from "./WeeklyCal";
import DailyCal from "./DailyCal";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom"

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function convertEventDatesToTimeZone(event) {
  const startDate = new Date(event.start + "T00:00:00");
  const endDate = new Date(event.end + "T23:59:59");

  if (isNaN(startDate) || isNaN(endDate)) {
    console.error("Invalid date for event:", event);
    return null;
  }

  return {
    ...event,
    start: startDate,
    end: endDate,
  };
}

const holidaysAPI = "https://date.nager.at/api/v3/PublicHolidays/2023/US";

function CalendarContainer({allEvents}) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(holidaysAPI)
      .then((r) => r.json())
      .then((data) => {
        const formattedEvents = data
          .map((holiday) => {
            const event = {
              title: holiday.name,
              start: holiday.date,
              end: holiday.date,
            };
            return convertEventDatesToTimeZone(event);
          })
          .filter((e) => e !== null);
        console.log(formattedEvents);
        setEvents(formattedEvents);
      });
  }, []);

  return (
    <Router>
    <div>
        <nav>
            <button>
                <Link to="/MonthlyCal">Monthly Calendar</Link>
            </button>
            <button>
                <Link to="/WeeklyCal">Weekly Calendar</Link>
            </button>
            <button>
                <Link to="/DailyCal">Daily Calendar</Link>
            </button>
        </nav>
        <Routes>
            <Route path="/MonthlyCal" element={<MonthlyCal allEvents={allEvents}/>}>
            </Route>
            <Route path="/WeeklyCal" element={<WeeklyCal events={events} />}>
            </Route>
            <Route path="/DailyCal" element={<DailyCal />}>
            </Route>
      </Routes>
    </div>
    </Router>
  );
}

export default CalendarContainer;
