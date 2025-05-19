import { useState } from 'react';
import './date.css';

const DatePicker = ({ onSubmit, initialDates, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1)); // February 2025
  const [startDate, setStartDate] = useState(initialDates?.startDate || null);
  const [endDate, setEndDate] = useState(initialDates?.endDate || null);
  const [startTime, setStartTime] = useState(initialDates?.startTime || { hours: 16, minutes: 30 });
  const [endTime, setEndTime] = useState(initialDates?.endTime || { hours: 16, minutes: 30 });

  // const [saveSearch, setSaveSearch] = useState(false);
  // Days of week abbreviations
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Handle form submission
  const handleSubmit = () => {
    onSubmit({
      startDate,
      endDate,
      startTime,
      endTime
    });
  };
  console.log('handleSubmit', handleSubmit)
  // Handle form clearing
  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setStartTime({ hours: 16, minutes: 30 });
    setEndTime({ hours: 16, minutes: 30 });
    // setSaveSearch(false);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Days from previous month
    const daysFromPrevMonth = firstDayOfMonth;
    const prevMonthDays = new Date(year, month, 0).getDate();

    const allDays = [];

    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      allDays.push({
        day: prevMonthDays - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false
      });
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      allDays.push({
        day: i,
        month,
        year,
        isCurrentMonth: true
      });
    }

    // Add days from next month
    const remainingCells = 42 - allDays.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingCells; i++) {
      allDays.push({
        day: i,
        month: month + 1 > 11 ? 0 : month + 1,
        year: month + 1 > 11 ? year + 1 : year,
        isCurrentMonth: false
      });
    }

    return allDays;
  };

  // Calendar navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Date selection handler
  const handleDateClick = (day) => {
    const selectedDate = new Date(day.year, day.month, day.day);

    if (!startDate || (startDate && endDate) || selectedDate < startDate) {
      setStartDate(selectedDate);
      setEndDate(null);
    } else {
      setEndDate(selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Time handlers
  const incrementTime = (type, field) => {
    if (type === 'start') {
      if (field === 'hours') {
        setStartTime(prev => ({ ...prev, hours: (prev.hours + 1) % 24 }));
      } else {
        setStartTime(prev => ({ ...prev, minutes: (prev.minutes + 30) % 60 }));
      }
    } else {
      if (field === 'hours') {
        setEndTime(prev => ({ ...prev, hours: (prev.hours + 1) % 24 }));
      } else {
        setEndTime(prev => ({ ...prev, minutes: (prev.minutes + 30) % 60 }));
      }
    }
  };

  const decrementTime = (type, field) => {
    if (type === 'start') {
      if (field === 'hours') {
        setStartTime(prev => ({ ...prev, hours: (prev.hours - 1 + 24) % 24 }));
      } else {
        setStartTime(prev => ({ ...prev, minutes: (prev.minutes - 30 + 60) % 60 }));
      }
    } else {
      if (field === 'hours') {
        setEndTime(prev => ({ ...prev, hours: (prev.hours - 1 + 24) % 24 }));
      } else {
        setEndTime(prev => ({ ...prev, minutes: (prev.minutes - 30 + 60) % 60 }));
      }
    }
  };

  // Apply preset date ranges
  const applyPreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setStartDate(start);
    setEndDate(end);
  };

  // Check if a day is in the selected range
  const isInRange = (day) => {
    if (!startDate || !endDate) return false;
    const date = new Date(day.year, day.month, day.day);
    return date > startDate && date < endDate;
  };

  // Check if a day is start or end date
  const isStartOrEndDate = (day) => {
    if (!startDate) return false;

    const date = new Date(day.year, day.month, day.day);
    if (startDate && date.getTime() === startDate.getTime()) return 'start';
    if (endDate && date.getTime() === endDate.getTime()) return 'end';

    return false;
  };

  // Format time with leading zeros
  const formatTwoDigits = (num) => num.toString().padStart(2, '0');

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={onClose}>
          &times;
        </button>
        <div className="popup-content">
          <div className="date-picker-container">
            <div className="date-picker-layout">
              <div className="presets-container">
                <div className="preset-option">Custom</div>
                <div className="preset-option" onClick={() => applyPreset(30)}>Last 30 Days</div>
                <div className="preset-option" onClick={() => applyPreset(90)}>Last 90 Days</div>
                <div className="preset-option" onClick={() => applyPreset(180)}>Last 6 months</div>
              </div>

              <div className="calendar-container">
                <div className="date-inputs">
                  <div className="date-input-group">
                    <label>Start Date</label>
                    <input type="text" value={formatDate(startDate)} readOnly />
                  </div>

                  <div className="date-input-group">
                    <label>End Date</label>
                    <input type="text" value={formatDate(endDate)} readOnly />
                  </div>
                </div>

                <div className="time-selectors">
                  <div className="time-selector">
                    <div className="time-arrows">
                      <button
                        className="time-arrow up"
                        onClick={() => incrementTime('start', 'hours')}
                      >▲</button>
                      <span>{formatTwoDigits(startTime.hours)}</span>
                      <button
                        className="time-arrow down"
                        onClick={() => decrementTime('start', 'hours')}
                      >▼</button>
                    </div>

                    <span className="time-separator">:</span>

                    <div className="time-arrows">
                      <button
                        className="time-arrow up"
                        onClick={() => incrementTime('start', 'minutes')}
                      >▲</button>
                      <span>{formatTwoDigits(startTime.minutes)}</span>
                      <button
                        className="time-arrow down"
                        onClick={() => decrementTime('start', 'minutes')}
                      >▼</button>
                    </div>
                  </div>

                  <div className="time-selector">
                    <div className="time-arrows">
                      <button
                        className="time-arrow up"
                        onClick={() => incrementTime('end', 'hours')}
                      >▲</button>
                      <span>{formatTwoDigits(endTime.hours)}</span>
                      <button
                        className="time-arrow down"
                        onClick={() => decrementTime('end', 'hours')}
                      >▼</button>
                    </div>

                    <span className="time-separator">:</span>

                    <div className="time-arrows">
                      <button
                        className="time-arrow up"
                        onClick={() => incrementTime('end', 'minutes')}
                      >▲</button>
                      <span>{formatTwoDigits(endTime.minutes)}</span>
                      <button
                        className="time-arrow down"
                        onClick={() => decrementTime('end', 'minutes')}
                      >▼</button>
                    </div>
                  </div>
                </div>

                <div className="calendar-header">
                  <button className="calendar-nav" onClick={prevMonth}>❮</button>
                  <div className="current-month">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  <button className="calendar-nav" onClick={nextMonth}>❯</button>
                </div>

                <div className="calendar-grid">
                  {dayNames.map(day => (
                    <div className="day-name" key={day}>{day}</div>
                  ))}

                  {generateCalendarDays().map((day, index) => {
                    const rangeStatus = isStartOrEndDate(day);
                    const inRange = isInRange(day);

                    return (
                      <div
                        key={index}
                        className={`calendar-day 
                    ${!day.isCurrentMonth ? 'outside-month' : ''} 
                    ${rangeStatus === 'start' ? 'start-date' : ''} 
                    ${rangeStatus === 'end' ? 'end-date' : ''} 
                    ${inRange ? 'in-range' : ''}`
                        }
                        onClick={() => handleDateClick(day)}
                      >
                        {day.day}
                      </div>
                    );
                  })}
                </div>
                <div className="button-group">
                  <button className="btn-clear" onClick={handleClear}>Clear</button>
                  <button className="btn-done" onClick={handleSubmit}>Done</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};
export default DatePicker;