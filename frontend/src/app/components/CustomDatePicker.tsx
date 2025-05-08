"use client";

import React, { useState } from "react";

import styles from "./CustomDatePicker.module.css";

export type CustomDatePickerProps = {
  date: Date | null;
  onChange: (date: Date) => void;
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ date, onChange }) => {
  const [currentDate, setCurrentDate] = useState(date ?? new Date());
  const [selectedDate, setSelectedDate] = useState(date ?? new Date());
  const currYear = currentDate.getFullYear();
  const currMonth = currentDate.getMonth();

  const isSameDate = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    const newMonth = currMonth === 0 ? 11 : currMonth - 1;
    const newYear = currMonth === 0 ? currYear - 1 : currYear;
    setCurrentDate(new Date(newYear, newMonth, 1));
  };

  const handleNextMonth = () => {
    const newMonth = currMonth === 11 ? 0 : currMonth + 1;
    const newYear = currMonth === 11 ? currYear + 1 : currYear;
    setCurrentDate(new Date(newYear, newMonth, 1));
  };

  const daysInMonth = getDaysInMonth(currYear, currMonth);
  const firstDay = getFirstDayOfMonth(currYear, currMonth);

  const dateButtons = [];

  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    dateButtons.push(<div key={`emptyDateCell-${i.toString()}`} />);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayDate = new Date(currYear, currMonth, i);
    const isSelected = selectedDate && isSameDate(dayDate, selectedDate);

    dateButtons.push(
      <button
        type="button"
        key={i}
        className={`${styles.dateCell} ${isSelected ? styles.selected : ""}`}
        onClick={() => {
          const selected = new Date(currYear, currMonth, i);
          setCurrentDate(selected);
          setSelectedDate(selected);
          onChange(selected);
        }}
      >
        {i}
      </button>,
    );
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <img
          src="/green-caret-left.svg"
          style={{ cursor: "pointer" }}
          onClick={handlePrevMonth}
        ></img>
        <span className={styles.monthName}>
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        <img
          src="/green-caret-right.svg"
          style={{ cursor: "pointer" }}
          onClick={handleNextMonth}
        ></img>
      </div>
      <hr className={styles.horizontalLine}></hr>
      <div className={styles.dayLine}>
        <div className={styles.day}>Mon</div>
        <div className={styles.day}>Tue</div>
        <div className={styles.day}>Wed</div>
        <div className={styles.day}>Thu</div>
        <div className={styles.day}>Fri</div>
        <div className={styles.day}>Sat</div>
        <div className={styles.day}>Sun</div>
      </div>

      <div className={styles.datesGrid}>{dateButtons}</div>
    </div>
  );
};

export default CustomDatePicker;
