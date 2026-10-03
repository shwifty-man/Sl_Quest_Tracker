import { StyleSheet } from "react-native";

export const questDetailsStyles = StyleSheet.create({

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#111E38",
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        color: "#78AFFF",
        fontSize: 21,
        fontWeight: "300",
        letterSpacing: 1,
        fontFamily: "Orbitron_700Bold",
    },

    // Quest information
    questCard: {
        backgroundColor: "#101B32",
        borderWidth: 1,
        borderColor: "#1E3760",
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
    },

    questTitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    questIcon: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: "#102D56",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    questTitleContainer: {
        flex: 1,
    },

    questTitle: {
        color: "#E8F0FF",
        fontSize: 16,
        fontWeight: "700",
    },

    questType: {
        color: "#8B96AA",
        fontSize: 13,
        marginTop: 3,
    },

    questXP: {
        color: "#6DA4FF",
        fontSize: 13,
        fontWeight: "700",
    },

    description: {
        color: "#AEB8CA",
        fontSize: 13,
        lineHeight: 20,
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: "#1D2D49",
        marginVertical: 12,
    },

    // Time Left
    progressCard: {
        flexDirection: "row",
        alignItems: "center",

        minHeight: 112,

        paddingHorizontal: 14,
        paddingVertical: 16,

        backgroundColor: "#101B32",

        borderWidth: 1,
        borderColor: "#1E3760",

        borderRadius: 14,

        marginBottom: 14,
    },

    completedProgressCard: {
        borderRightWidth: 4,
        borderRightColor: "#22C55E",
    },

    timeIconContainer: {
        width: 68,

        alignItems: "center",
        justifyContent: "center",
    },

    timeDivider: {
        width: 1,
        height: 58,

        backgroundColor: "#1D3C62",
    },

    timeContent: {
        flex: 1,

        paddingHorizontal: 16,
    },

    progressTitle: {
        color: "#6B9FCC",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,

        marginBottom: 5,
    },

    timeValue: {
        color: "#19C7FF",
        fontSize: 16,
        fontWeight: "700",
    },

    deadlineContent: {
        width: 145,
        paddingLeft: 16,
    },

    deadlineLabel: {
        color: "#7FA7C8",
        fontSize: 12,
        fontWeight: "600",

        marginBottom: 4,
    },

    deadlineValue: {
        color: "#C2D5EA",
        fontSize: 13,
        fontWeight: "600",
    },

    // Details
    detailsCard: {
        backgroundColor: "#101B32",
        borderWidth: 1,
        borderColor: "#1E3760",
        borderRadius: 14,
        padding: 14,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    infoIcon: {
        width: 34,
        height: 34,
        borderRadius: 9,
        backgroundColor: "#17243D",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    infoLabel: {
        color: "#8F9BB0",
        fontSize: 12,
        marginBottom: 3,
    },

    infoValue: {
        color: "#DCE5F5",
        fontSize: 14,
        fontWeight: "600",
    },

    rewardLabel: {
        color: "#8F9BB0",
        fontSize: 12,
        flex: 1,
    },

    rewardValue: {
        color: "#B9CAEA",
        fontSize: 13,
        fontWeight: "600",
    },

    // Complete button
    bottomContainer: {
        marginTop: "auto",
        paddingTop: 20,
    },

    completeButton: {
        height: 46,
        borderRadius: 9,
        backgroundColor: "#145AE8",
        alignItems: "center",
        justifyContent: "center",
    },

    disabledButton: {
        height: 46,
        borderRadius: 9,
        backgroundColor: "#145AE8",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.4,
    },

    completeButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "Orbitron_400Regular",
    },
});