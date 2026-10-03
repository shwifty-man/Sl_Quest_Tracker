import React from "react";

import {
  View,
  Text,
  Pressable,
  FlatList
} from "react-native";

import { questStyles } from "../../Styles/questStyles.js";

import {
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";

import { Calendar } from "react-native-calendars";

function Once({
  // DATE
  selectedDate,
  setSelectedDate,
  calendarOpen,
  setCalendarOpen,

  // START TIME
  questTime,
  setQuestTime,
  open,
  setOpen,
  active,
  times,
  currentIndex,
  updateTime,

  // DEADLINE
  deadlineTime,
  openDeadline,
  setOpenDeadline,
  deadlineActive,
  deadlineTimes,
  deadlineIndex,
  updateDeadline,

  // GENERAL
  iconColor,
  iconName,
  dateTitle,
  dropDownDescription
}) {

  return (
    <View style={questStyles.questDateContainer}>

      {/* HEADER */}
      <View style={questStyles.dateHeaderWrapper}>

        <View style={questStyles.dateHeader}>

          <MaterialCommunityIcons
            name={iconName}
            color={iconColor}
            size={25}
          />

          <Text
            style={{
              textAlign: "left",
              color: "#e9e6e6a8"
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "#e9e6e6",
                fontWeight: 500,
                fontFamily: "Orbitron_400Regular"
              }}
            >
              {dateTitle}
            </Text>

            {" "}(Required)
          </Text>

        </View>

        <Text style={{ color: "#7d7f87" }}>
          {dropDownDescription}
        </Text>

      </View>


      {/* DATE */}
      <View style={{
        width: "100%",
        marginTop: 4,
        marginBottom: 14,
      }}>

        <Text style={questStyles.timeLabel}>
          Date
        </Text>

        <Pressable
          style={questStyles.timeInput}
          onPress={() => setCalendarOpen(!calendarOpen)}
        >

          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >

            <Ionicons
              name="calendar-outline"
              size={18}
              color={iconColor}
              style={{ marginRight: 8 }}
            />

            <Text style={questStyles.inputText}>
              {selectedDate?.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </Text>

          </View>

          <Ionicons
            name={
              calendarOpen
                ? "chevron-up"
                : "chevron-down"
            }
            size={16}
            color="#8fa0bb"
          />

        </Pressable>


        {calendarOpen && (
          <View style={questStyles.dropdown}>

            <Calendar
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#171D35",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: iconColor,
                selectedDayTextColor: "#ffffff",
                todayTextColor: iconColor,
                dayTextColor: "#d9e1e8",
                textDisabledColor: "#575757",
                arrowColor: iconColor,
                monthTextColor: "#ffffff",
                textDayFontFamily: "monospace",
                textMonthFontFamily: "HelveticaNeue-Bold",
                textDayHeaderFontFamily: "monospace",
                textDayFontSize: 16,
                textMonthFontSize: 20
              }}

              selected={
                selectedDate
                  ?.toISOString()
                  .split("T")[0]
              }

              current={
                selectedDate
                  ?.toISOString()
                  .split("T")[0]
              }

              markedDates={{
                [selectedDate
                  ?.toISOString()
                  .split("T")[0]]: {
                  selected: true,
                  selectedColor: iconColor
                }
              }}

              onDayPress={(day) => {
                const [year, month, date] =
                  day.dateString.split("-").map(Number);

                const updatedDate = new Date(selectedDate);

                updatedDate.setFullYear(year);
                updatedDate.setMonth(month - 1);
                updatedDate.setDate(date);

                setSelectedDate(updatedDate);

                // Keep the selected start time,
                // but change its calendar date.
                const updatedQuestTime = new Date(questTime);

                updatedQuestTime.setFullYear(year);
                updatedQuestTime.setMonth(month - 1);
                updatedQuestTime.setDate(date);

                setQuestTime(updatedQuestTime);

                setCalendarOpen(false);
              }}
            />

          </View>
        )}

      </View>


      {/* START TIME + DEADLINE */}
      <View style={questStyles.timeRow}>

        {/* START TIME */}
        <View style={questStyles.timeColumn}>

          <Text style={questStyles.timeLabel}>
            Start Time
          </Text>

          <Pressable
            style={questStyles.timeInput}
            onPress={() => setOpen(!open)}
          >

            <Text style={questStyles.inputText}>
              {questTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit"
              })}
            </Text>

            <Ionicons
              name={
                open
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={16}
              color="#8fa0bb"
            />

          </Pressable>


          {open && (
            <View style={questStyles.dropdown}>

              <FlatList
                data={times}
                keyExtractor={(item) =>
                  `${item.hour}:${item.minute}`
                }
                nestedScrollEnabled
                initialScrollIndex={currentIndex}
                getItemLayout={(data, index) => ({
                  length: 40,
                  offset: 40 * index,
                  index
                })}
                renderItem={({ item }) => (

                  <Pressable
                    style={questStyles.timeOption}
                    onPress={() => {

                      updateTime(
                        item.hour,
                        item.minute,
                        active
                      );

                      setOpen(false);

                    }}
                  >

                    <Text style={questStyles.inputText}>
                      {item.hour}:
                      {String(item.minute).padStart(2, "0")}{" "}
                      {active}
                    </Text>

                  </Pressable>

                )}
              />

            </View>
          )}

        </View>


        {/* DEADLINE */}
        <View style={questStyles.timeColumn}>

          <Text style={questStyles.timeLabel}>
            Deadline
          </Text>

          <Pressable
            style={questStyles.timeInput}
            onPress={() =>
              setOpenDeadline(!openDeadline)
            }
          >

            <Text style={questStyles.inputText}>
              {deadlineTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit"
              })}
            </Text>

            <Ionicons
              name={
                openDeadline
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={16}
              color="#8fa0bb"
            />

          </Pressable>


          {openDeadline && (
            <View style={questStyles.dropdown}>

              <FlatList
                data={deadlineTimes}
                keyExtractor={(item) =>
                  `${item.hour}:${item.minute}`
                }
                nestedScrollEnabled
                initialScrollIndex={deadlineIndex}
                getItemLayout={(data, index) => ({
                  length: 40,
                  offset: 40 * index,
                  index
                })}
                renderItem={({ item }) => (

                  <Pressable
                    style={questStyles.timeOption}
                    onPress={() => {

                      updateDeadline(
                        item.hour,
                        item.minute,
                        deadlineActive
                      );

                      setOpenDeadline(false);

                    }}
                  >

                    <Text style={questStyles.inputText}>
                      {item.hour}:
                      {String(item.minute).padStart(2, "0")}{" "}
                      {deadlineActive}
                    </Text>

                  </Pressable>

                )}
              />

            </View>
          )}

        </View>

      </View>

    </View>
  );
}

export default Once;