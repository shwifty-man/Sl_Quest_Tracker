import React, { useState } from "react";
import { View, Text, Pressable, FlatList, TextInput } from "react-native";
import { questStyles } from "../../Styles/questStyles.js";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

import WeeklyDropDown from "./WeeklyDropDown.jsx"
import OneTimeDropDown from "./OneTimeDropDown.jsx"
import DailyDropDown from "./DailyDropDown.jsx"


function DropDown({
  dateTitle,
  iconName,
  iconColor,
  dropDownDescription,
  questType,
  setQuestTime,
  questTime,
  deadline,
  setDeadline
}) {

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const [open, setOpen] = useState(false);
  const [openDeadline, setOpenDeadline] = useState(false);

  const [deadlineTime, setDeadlineTime] = useState(() => {
    const date = new Date(questTime);
    date.setHours(date.getHours() + 1);
    return date;
  });

  const [deadlineActive, setDeadlineActive] = useState(
    deadlineTime.getHours() >= 12 ? "PM" : "AM"
  );

  const [daysOpen, setDaysOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(questTime));

  const [duration, setDuration] = useState(45);
  const [durationOpen, setDurationOpen] = useState(false);

  const [active, setActive] = useState(
    questTime.getHours() >= 12 ? "PM" : "AM"
  );
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);

  const times = [];
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      times.push({
        hour,
        minute
      });
    }
  }

  function updateDeadlineFromDuration(startTime, duration) {
    const updated = new Date(startTime);

    updated.setMinutes(
      updated.getMinutes() + duration
    );

    setDeadline(updated);
  }

  function updateTime(hour, minute, period = active) {
    const updated = new Date(questTime);

    let hour24 = hour;

    if (period === "AM") {
      if (hour === 12) {
        hour24 = 0;
      }
    } else {
      if (hour !== 12) {
        hour24 = hour + 12;
      }
    }

    updated.setHours(hour24);
    updated.setMinutes(minute);
    updated.setSeconds(0);
    updated.setMilliseconds(0);

    setQuestTime(updated);

    // Daily / Weekly deadline
    if (questType === "Daily" || questType === "Weekly") {
      updateDeadlineFromDuration(updated, duration);
    }
  }

  function updateDeadline(hour, minute, period = deadlineActive) {
    const updated = new Date(deadlineTime);

    let hour24 = hour;

    if (period === "AM") {
      if (hour === 12) {
        hour24 = 0;
      }
    } else {
      if (hour !== 12) {
        hour24 = hour + 12;
      }
    }

    updated.setHours(hour24);
    updated.setMinutes(minute);
    updated.setSeconds(0);
    updated.setMilliseconds(0);

    setDeadlineTime(updated);

    // Send the selected deadline upward
    setDeadline(updated);
  }

  const currentTime = new Date()

  const currentHour = currentTime.getHours() % 12 || 12;
  const currentMinute = currentTime.getMinutes();

  const currentIndex = times.findIndex(
    (item) =>
      item.hour > currentHour ||
      (item.hour === currentHour && item.minute >= currentMinute)
  );

  const deadlineHour = deadlineTime.getHours() % 12 || 12;
  const deadlineMinute = deadlineTime.getMinutes();

  const deadlineIndex = times.findIndex(
    (item) =>
      item.hour > deadlineHour ||
      (
        item.hour === deadlineHour &&
        item.minute >= deadlineMinute
      )
  );
  return (
    <>
      {questType === "One-time" && (
        <OneTimeDropDown
          /* DATE */
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          calendarOpen={calendarOpen}
          setCalendarOpen={setCalendarOpen}

          /* START TIME */
          questTime={questTime}
          setQuestTime={setQuestTime}
          open={open}
          setOpen={setOpen}
          active={active}
          times={times}
          currentIndex={currentIndex}
          updateTime={updateTime}

          /* DEADLINE */
          deadlineTime={deadlineTime}
          openDeadline={openDeadline}
          setOpenDeadline={setOpenDeadline}
          deadlineActive={deadlineActive}
          deadlineTimes={times}
          deadlineIndex={deadlineIndex}
          updateDeadline={updateDeadline}

          /* GENERAL */
          iconColor={iconColor}
          iconName={iconName}
          dateTitle={dateTitle}
          dropDownDescription={dropDownDescription}
        />
      )}

      {
        questType === "Weekly" && (
          <WeeklyDropDown
            questTime={questTime}
            setQuestTime={setQuestTime}
            daysOpen={daysOpen}
            setDaysOpen={setDaysOpen}
            open={open}
            setOpen={setOpen}
            active={active}
            setActive={setActive}
            times={times}
            currentIndex={currentIndex}
            updateTime={updateTime}
            iconColor={iconColor}
            iconName={iconName}
            dateTitle={dateTitle}
            dropDownDescription={dropDownDescription}
            duration={duration}
            setDuration={setDuration}
            durationOpen={durationOpen}
            setDurationOpen={setDurationOpen}
            setDeadline={setDeadline}
          />
        )
      }

      {
        questType === "Daily" && (
          <DailyDropDown
            questTime={questTime}
            setQuestTime={setQuestTime}
            open={open}
            setOpen={setOpen}
            setOpenDeadline={setOpenDeadline}
            openDeadline={openDeadline}
            active={active}
            setActive={setActive}
            times={times}
            currentIndex={currentIndex}
            updateTime={updateTime}
            iconColor={iconColor}
            iconName={iconName}
            dateTitle={dateTitle}
            dropDownDescription={dropDownDescription}

            duration={duration}
            setDuration={setDuration}
            durationOpen={durationOpen}
            setDurationOpen={setDurationOpen}
            setDeadline={setDeadline}
          />
        )
      }
    </>
  );
}

export default DropDown