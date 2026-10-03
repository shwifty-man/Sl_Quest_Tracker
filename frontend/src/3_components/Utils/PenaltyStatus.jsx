import React, { useEffect, useState } from "react"
import { View, Text, Pressable } from "react-native"
import { styles, text } from "../../2_services/styles.js"

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


const PenaltyStatus = ({ penalty, setPenalty }) => {
    const [timeRemaining, setTimeRemaining] = useState(0)

    useEffect(() => {
        if (!penalty?.deadline) {
            setTimeRemaining(0)
            return
        }

        const updateTime = () => {
            const remaining = new Date(penalty.deadline).getTime() - Date.now()

            if (remaining <= 0) {
                setTimeRemaining(0)
                setPenalty({ active: false, deadline: null })
                return
            }

            setTimeRemaining(Math.floor(remaining / 1000))
        }

        updateTime()

        const interval = setInterval(updateTime, 1000)

        return () => clearInterval(interval)
    }, [penalty?.deadline])

    let color
    if (!penalty.active) {
        color = '#4C73FF'
    } else {
        color = '#FF4D6D'
    }

    return (
        <View
            style={[
                styles.card,
                {
                    flex: 0.2,
                    padding: 14,
                    alignItems: 'flex-start',
                    padding: 20
                }
            ]}
        >

            <Text style={[styles.questTitle, { color: '#ddd8d8' }]}>
                Penalty Status
            </Text>

            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginTop: 8,
                    gap: 12,
                    padding: 4,
                    borderRadius: 9,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: '#0A143A',
                    borderColor: color,
                    borderWidth: 1,
                    borderStyle: 'solid',
                }}
            >
                {!penalty?.active ? (

                    <>
                        <MaterialCommunityIcons
                            name="shield-check-outline"
                            size={62}
                            color={color}
                        />

                        <View style={{ flex: 1 }}>
                            <Text style={styles.questTitle}>
                                You're Clear
                            </Text>

                            <Text style={{ color: '#c5c4c4', marginTop: 2 }}>
                                Keep it up.
                            </Text>
                        </View>
                    </>

                ) : penalty?.active ? (

                    <>
                        <MaterialCommunityIcons
                            name="shield-alert-outline"
                            size={62}
                            color={color}
                        />

                        <View style={{ flex: 1 }}>
                            <Text style={[styles.questTitle, { color: color }]}>
                                Penalty active!
                            </Text>

                            <Text style={{ color: '#c5c4c4', marginTop: 2 }}>
                                Ends in {Math.floor(timeRemaining / 3600)}h {Math.floor((timeRemaining % 3600) / 60)}m {timeRemaining % 60}s
                            </Text>
                        </View>
                    </>

                ) : (
                    <Text style={styles.questTitle}>
                        Error
                    </Text>
                )}

            </View>
        </View>
    )
}

export default PenaltyStatus