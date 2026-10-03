import React from "react";

import { View, Text, Pressable, FlatList } from "react-native";

import { questStyles } from "../../Styles/questStyles.js";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

function WeeklyDropDown({
    questTime,
    setQuestTime,
    daysOpen,
    setDaysOpen,
    open,
    setOpen,
    active,
    setActive,
    times,
    currentIndex,
    updateTime,
    iconColor,
    iconName,
    dateTitle,
    dropDownDescription,
    duration,
    setDuration,
    durationOpen,
    setDurationOpen,
    setDeadline
}) {

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (

        <View style={questStyles.questDateContainer}>

            <View style={questStyles.dateHeaderWrapper}>

                <View style={questStyles.dateHeader}>

                    <MaterialCommunityIcons
                        name={iconName}
                        color={iconColor}
                        size={25}
                    />

                    <Text style={{ textAlign: 'left', color: '#e9e6e6a8' }}>

                        <Text
                            style={{
                                fontSize: 15,
                                color: '#e9e6e6',
                                fontWeight: 500,
                                fontFamily: "Orbitron_400Regular"
                            }}
                        >
                            {dateTitle}
                        </Text>

                        {" "}(Required)

                    </Text>

                </View>

                <Text style={{ color: '#7d7f87' }}>
                    {dropDownDescription}
                </Text>

                <View style={questStyles.timePickerWrapper}>

                    <Pressable
                        style={questStyles.timeInput}
                        onPress={() => setDaysOpen(!daysOpen)}
                    >

                        <Text style={questStyles.inputText}>
                            {daysOfWeek[(questTime.getDay() + 6) % 7]}
                        </Text>

                        <Ionicons
                            name={daysOpen ? "chevron-up" : "chevron-down"}
                            size={16}
                            color="#8fa0bb"
                        />

                    </Pressable>

                    {daysOpen && (

                        <View style={questStyles.dropdown}>

                            <FlatList
                                data={daysOfWeek}
                                keyExtractor={(item) => item}
                                nestedScrollEnabled

                                getItemLayout={(data, index) => ({
                                    length: 40,
                                    offset: 40 * index,
                                    index,
                                })}

                                renderItem={({ item }) => (

                                    <Pressable
                                        style={questStyles.timeOption}
                                        onPress={() => {
                                            const updated = new Date(questTime);

                                            const targetDay = daysOfWeek.indexOf(item);

                                            const currentDay = updated.getDay();

                                            const difference = (targetDay + 1 - currentDay + 7) % 7;

                                            updated.setDate(updated.getDate() + difference);

                                            setQuestTime(updated);
                                            setDaysOpen(false);
                                        }}
                                    >

                                        <Text style={questStyles.inputText}>
                                            {item}
                                        </Text>

                                    </Pressable>

                                )}

                            />

                        </View>

                    )}

                </View>

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
                                    minute: "2-digit",
                                })}
                            </Text>

                            <Ionicons
                                name={open ? "chevron-up" : "chevron-down"}
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
                                        index,
                                    })}
                                    renderItem={({ item }) => (
                                        <Pressable
                                            style={questStyles.timeOption}
                                            onPress={() => {
                                                updateTime(
                                                    item.hour,
                                                    item.minute
                                                );

                                                setOpen(false);
                                            }}
                                        >
                                            <Text style={questStyles.inputText}>
                                                {item.hour}:
                                                {String(item.minute).padStart(2, "0")}{" "}
                                                {item.hour === 12 || item.hour < 12 ? "AM" : "PM"}
                                            </Text>
                                        </Pressable>
                                    )}
                                />
                            </View>
                        )}

                    </View>


                    {/* DURATION */}
                    <View style={questStyles.timeColumn}>

                        <Text style={questStyles.timeLabel}>
                            Duration
                        </Text>

                        <Pressable
                            style={questStyles.timeInput}
                            onPress={() => setDurationOpen(!durationOpen)}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Ionicons
                                    name="timer-outline"
                                    size={18}
                                    color={iconColor}
                                    style={{ marginRight: 8 }}
                                />

                                <Text style={questStyles.inputText}>
                                    {duration} min
                                </Text>
                            </View>

                            <Ionicons
                                name={durationOpen ? "chevron-up" : "chevron-down"}
                                size={16}
                                color="#8fa0bb"
                            />
                        </Pressable>

                        {durationOpen && (
                            <View style={questStyles.dropdown}>
                                {[15, 30, 45, 60, 90, 120].map((minutes) => (
                                    <Pressable
                                        key={minutes}
                                        style={questStyles.timeOption}
                                        onPress={() => {
                                            setDuration(minutes);

                                            const updatedDeadline = new Date(questTime);

                                            updatedDeadline.setMinutes(
                                                updatedDeadline.getMinutes() + minutes
                                            );

                                            setDeadline(updatedDeadline);

                                            setDurationOpen(false);
                                        }}
                                    >
                                        <Text style={questStyles.inputText}>
                                            {minutes} min
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                    </View>

                </View>

            </View>

        </View>

    );
}

export default WeeklyDropDown;