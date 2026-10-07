import React, { useState, useEffect } from "react"

import {
    View,
    Text,
    Pressable,
    StyleSheet,
    StatusBar,
} from "react-native"

import { MaterialCommunityIcons } from "@expo/vector-icons"

import { useAuth, useUser } from "../../2_services/context"


const pages = [
    {
        icon: (
            <MaterialCommunityIcons
                name="diamond"
                size={65}
                color="#38E6A3"
            />
        ),
        title: "Sharpen Your Focus",
        description:
            "Cut through distractions, lock in, and focus on what matters.",
    },

    {
        icon: (
            <MaterialCommunityIcons
                name="shield-check"
                size={65}
                color="#5EA7FF"
            />
        ),
        title: "Avoid Penalties",
        description:
            "Break the rules, face the penalty. Stay focused, stay strong.",
    },

    {
        icon: (
            <MaterialCommunityIcons
                name="trending-up"
                size={65}
                color="#5EA7FF"
            />
        ),
        title: "Become Better",
        description:
            "Level up, build better habits, and become the best version of yourself.",
    },
]

const Intro = ({ navigation }) => {
    const [page, setPage] = useState(0)
    const { token } = useAuth()
    const { setSetup } = useUser()

    const finishSetup = async () => {
        const success = await setSetup(token)

        if (success) {
            console.log("Setup finished")
        }
    }

    const nextPage = async () => {
        if (page < pages.length - 1) {
            setPage(page + 1)
            return
        }

        await finishSetup()
    }

    const goToPage = (index) => {
        setPage(index)
    }

    const skip = async () => {
        await finishSetup()
    }

    const current = pages[page]

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#020A18"
            />

            <View style={styles.card}>
                <Text style={styles.header}>
                    SYSTEM
                </Text>

                <View style={styles.iconContainer}>
                    <View style={styles.iconGlow}>
                        {current.icon}
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>
                        {current.title}
                    </Text>

                    <Text style={styles.description}>
                        {current.description}
                    </Text>
                </View>

                <View style={styles.dots}>
                    {pages.map((_, index) => (
                        <Pressable
                            key={index}
                            onPress={() => goToPage(index)}
                            hitSlop={10}
                            style={[
                                styles.dot,
                                index === page && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.buttons}>
                    <Pressable
                        onPress={skip}
                        style={styles.skipButton}
                    >
                        <Text style={styles.skipText}>
                            Skip
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={nextPage}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextText}>
                            {page === pages.length - 1
                                ? "Get Started"
                                : "Next"}
                        </Text>

                        {page < pages.length - 1 && (
                            <Text style={styles.arrow}>
                                →
                            </Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020A18",
        padding: 8,
    },

    card: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#163968",
        borderRadius: 24,
        paddingHorizontal: 22,
        paddingTop: 25,
        paddingBottom: 20,
        backgroundColor: "#041124",
    },

    header: {
        textAlign: "center",
        color: "#69AFFF",
        fontSize: 17,
        fontWeight: "600",
        letterSpacing: 1.5,
    },

    iconContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    iconGlow: {
        width: 190,
        height: 190,
        borderRadius: 95,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2867C7",
        backgroundColor: "#061936",
    },

    content: {
        alignItems: "center",
        paddingHorizontal: 10,
    },

    title: {
        color: "#EAF4FF",
        fontSize: 25,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 12,
    },

    description: {
        color: "#9EB4D1",
        fontSize: 14,
        lineHeight: 21,
        textAlign: "center",
        maxWidth: 290,
    },

    dots: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 9,
        marginVertical: 28,
    },

    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#394B67",
    },

    activeDot: {
        width: 9,
        height: 9,
        backgroundColor: "#58A6FF",
    },

    buttons: {
        flexDirection: "row",
        gap: 12,
    },

    skipButton: {
        flex: 1,
        height: 52,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#1D3F70",
        justifyContent: "center",
        alignItems: "center",
    },

    skipText: {
        color: "#9EB4D1",
        fontSize: 15,
        fontWeight: "500",
    },

    nextButton: {
        flex: 1.5,
        height: 52,
        borderRadius: 10,
        backgroundColor: "#0867E8",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
    },

    nextText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },

    arrow: {
        color: "#FFFFFF",
        fontSize: 22,
    },
})

export default Intro