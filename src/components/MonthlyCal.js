import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function MonthlyCal({ allEvents, events, onYearChange }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [previousYear, setPreviousYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    const newYear = currentDate.getFullYear();
    if (newYear !== previousYear) {
      console.log("changing year in month to: ", newYear);
      onYearChange(newYear);
      setPreviousYear(newYear);
    }
  }, [currentDate, previousYear, onYearChange]);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        views={{ month: true, week: false, day: false, agenda: false }}
        startAccessor="start"
        endAccessor="end"
        allDayAccessor="allDay"
        style={{ height: 500, margin: "50 px" }}
        onNavigate={handleNavigate}
        date={currentDate}
      />
    </div>
  );
}

export default MonthlyCal;