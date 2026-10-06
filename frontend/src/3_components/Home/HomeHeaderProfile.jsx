import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View, ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import ProgressBar from "../../3_components/Quests/Progressbar.jsx";

import backgroundImage from "../../../assets/image.png";

function HomeHeaderProfile({ name, exp, level, requiredExp, showBackground = true }) {
    const hour = new Date().getHours();

    let greeting;

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    const currentExp = exp || 0;
    const currentLevel = level || 1;
    const totalRequiredExp = requiredExp || 1000;

    return (
        <ImageBackground
            source={showBackground ? backgroundImage : null}
            style={[styles.header, showBackground ? {
                borderColor: '#12417E',
                borderStyle: 'solid',
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopWidth: 1,
            } : { borderRadius: 24, backgroundColor: 'rgba(5, 15, 32, 0.95)', }]}
            imageStyle={styles.headerImage}
            resizeMode="cover"
        >
            {/* Dark overlay for readability */}
            {showBackground && (<LinearGradient
                colors={[
                    "rgba(2, 8, 25, 0.35)",
                    "rgba(2, 8, 25, 0.72)",
                    "rgba(2, 8, 25, 0.95)",
                ]}
                style={StyleSheet.absoluteFill}
            />)}

            {/* Subtle bottom glow */}
            {showBackground && (<LinearGradient
                colors={[
                    "transparent",
                    "rgba(42, 76, 210, 0.1)",
                ]}
                style={styles.bottomGlow}
            />)}

            <View style={styles.content}>
                <View style={styles.profileInfo}>
                    <Text style={styles.greeting}>
                        {greeting}, {name || "Hunter"}.
                    </Text>

                    <View style={styles.levelRow}>
                        <Text style={styles.levelText}>
                            Level {currentLevel}
                        </Text>

                        <Text style={styles.xpText}>
                            {currentExp} / {totalRequiredExp} XP
                        </Text>
                    </View>

                    <ProgressBar
                        numOne={currentExp}
                        numTwo={currentLevel}
                        exp={true}
                    />
                </View>

                {/* Shield */}
                <View style={styles.shieldContainer}>
                    <View style={styles.shieldGlow}>
                        <MaterialCommunityIcons
                            name="shield-sword"
                            size={68}
                            color="#6278FF"
                        />
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        minHeight: 170,
        width: "100%",
        overflow: "hidden",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        margin: 0,
    },

    headerImage: {
        opacity: 0.95,
    },

    content: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 22,
    },

    profileInfo: {
        flex: 1,
        gap: 7,
    },

    greeting: {
        color: "#AAB5D6",
        fontSize: 13,
        fontWeight: "500",
    },

    levelRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },

    levelText: {
        color: "#FFFFFF",
        fontSize: 25,
        fontWeight: "800",
        letterSpacing: 0.3,
    },

    xpText: {
        color: "#AAB5D6",
        fontSize: 12,
        fontWeight: "600",
    },

    streakRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 3,
    },

    streakText: {
        color: "#FFBC3E",
        fontSize: 12,
        fontWeight: "700",
    },

    shieldContainer: {
        marginLeft: 14,
        alignItems: "center",
        justifyContent: "center",
    },

    shieldGlow: {
        width: 82,
        height: 82,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 41,
        backgroundColor: "rgba(51, 80, 210, 0.18)",
        borderWidth: 1,
        borderColor: "rgba(93, 123, 255, 0.35)",
    },

    bottomGlow: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 70,
    },
});

export default HomeHeaderProfile;