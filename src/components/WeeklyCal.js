import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
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

// const events = [
//   {
//     title: "Event 1",
//     desc: "Description for Event 1",
//     start: new Date(2023, 0, 1),
//     end: new Date(2023, 0, 1),
//   },
// ];

function Event({ event }) {
  if (!event) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <strong>{event.title}</strong>
      <p>{event.desc}</p>
    </div>
  );
}

function customToolBar(
  toolbar,
  currentDate,
  setCurrentDate,
  setShowDatePicker,
  showDatePicker
) {
  const goToBack = () => {
    const newDate = addDays(currentDate, -7);
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = addDays(currentDate, 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    toolbar.onNavigate("TODAY", today);
  };

  return (
    <div>
      <button onClick={goToToday}>Today</button>
      <button onClick={goToBack}>{"<"}</button>
      <span>{format(toolbar.date, "MMMM yyyy")}</span>
      <button onClick={goToNext}>{">"}</button>
      <button onClick={() => setShowDatePicker(!showDatePicker)}>
        Pick a date
      </button>
      {showDatePicker && (
        <DatePicker
          selected={currentDate}
          onChange={(date) => {
            setCurrentDate(date);
            toolbar.onNavigate("DATE", date);
            setShowDatePicker(false);
          }}
          inline
        />
      )}
    </div>
  );
}

function WeeklyCal({ events, onYearChange }) {
  const minTime = new Date();
  minTime.setHours(6, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(20, 0, 0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [previousYear, setPreviousYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    const newYear = currentDate.getFullYear();
    if (newYear !== previousYear) {
      console.log("changing year in weekly to:", newYear);
      onYearChange(newYear);
      setPreviousYear(newYear);
    }
  }, [currentDate, previousYear, onYearChange]);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  return (
    <div>
      <h2>Today's Date: {format(currentDate, "EEEE, MMMM do, yyyy")} </h2>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={{ week: true, agenda: true }}
        date={currentDate}
        onNavigate={handleNavigate}
        components={{
          event: Event,
          toolbar: (toolbar) =>
            customToolBar(
              toolbar,
              currentDate,
              setCurrentDate,
              setShowDatePicker,
              showDatePicker
            ),
        }}
        showMultiDayTimes={false}
        dayLayoutAlgorithm="no-overlap"
        min={minTime}
        max={maxTime}
      />
    </div>
  );
}

export default WeeklyCal;