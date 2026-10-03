import { StyleSheet } from "react-native"

export const progressStyles = StyleSheet.create({

    weeklyProgress: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
        height: 140,
    },

    progressDay: {
        alignItems: "center",
        justifyContent: "flex-end",
        height: "100%",
    },

    progressBarContainer: {
        justifyContent: "flex-end",
        width: 18,
        height: 100,
        borderRadius: 9,
        overflow: "hidden",
    },

    progressBar: {
        width: "100%",
        minHeight: 4,
        borderRadius: 9,
        backgroundColor: "#2478E5",
    },

    progressDayText: {
        marginTop: 8,
        fontSize: 12,
        color: "#8A94AD",
    },

})