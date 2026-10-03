import React from "react"
import { View, Text } from "react-native"

import { progressStyles } from "../../Styles/progressStyles"

export default function WeeklyProgress({ data }) {
    const maxQuests = 25

    return (
        <View style={{ width: '100%', backgroundColor: '#021333', borderColor: '#0B2044', borderStyle: 'solid', borderWidth: 1, padding: 12, borderRadius: 25 }}>
            <Text style={{ color: '#e4e3e3' }}>Weekly Progress</Text>
            <View style={progressStyles.weeklyProgress}>

                {data.map((day) => (

                    <View key={day.day} style={progressStyles.progressDay}>

                        <View style={progressStyles.progressBarContainer}>

                            <View
                                style={[
                                    progressStyles.progressBar,
                                    { height: `${Math.min((Number(day.completed) / maxQuests) * 100, 100)}%` }
                                ]}
                            />

                        </View>

                        <Text style={progressStyles.progressDayText}>
                            {day.day}
                        </Text>

                    </View>

                ))}

            </View>
        </View>
    )
}