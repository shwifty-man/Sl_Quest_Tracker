import { StyleSheet, Text } from "react-native"

export const questStyles = StyleSheet.create({
    questTypeIcon: {
        borderWidth: 1,
        borderStyle: 'solid',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 10,

        alignItems: 'center',
        borderRadius: 10,
        width: 110,
        padding: 5,
        paddingHorizontal: 5,
        flexDirection: 'row',
        gap: 5
    },
    questTypeIconActive: {
        backgroundColor: 'rgba(26, 83, 255, 0.1)',
        borderStyle: 'solid',
        borderWidth: 1,

        alignItems: 'center',
        borderRadius: 10,
        width: 100,
        padding: 10
    },
    questTypeIconDeactive: {
        shadowColor: "#505258",
        borderColor: '#505258',
        backgroundColor: 'rgba(30, 37, 68, 0.57)',
    },
    questTpyeText: {
        color: '#fff',
    },
    questTypeOuterContainerMainWrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    questTypeOuterContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignItems: 'center',
        gap: 17
    },
    questTypeOuterContainerText: {
        textAlign: 'left',
        color: '#fff',
        marginBottom: 10,

    },
    // quest time choser
    questDateContainer: {
        backgroundColor: '#1E2544',
        alignItems: 'center',
        borderRadius: 8,
        padding: 14,
        width: '100%',
        gap: 8
    },



    questViewTitle: { fontSize: 24, color: '#fff', textAlign: "center", fontFamily: 'Orbitron_700Bold' },
    questSubViewTitle: { color: '#9FDAEF', fontFamily: 'Orbitron_400Regular' },

    timeRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        width: "100%",
        gap: 12,
    },

    timeColumn: {
        flex: 1,
        minWidth: 0,
        position: "relative",
    },

    timeLabel: {
        color: "#dcdcdc",
        fontSize: 13,
        marginBottom: 6,
        marginLeft: 0,
    },

    timeInput: {
        backgroundColor: "#1E2544",
        paddingHorizontal: 12,
        height: 42,
        width: "100%",
        borderWidth: 1,
        borderColor: "#505258",
        borderRadius: 10,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    dateHeaderWrapper: {
        flexDirection: 'column',
        gap: 10,
        width: '100%',
    },

    dateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    timePickerWrapper: {
        position: 'relative',
        width: '100%',
    },

    dropdown: {
        position: "absolute",
        top: 48,
        left: 0,
        right: 0,

        backgroundColor: "#171D35",
        borderWidth: 1,
        borderColor: "#2E78FF",
        borderRadius: 8,

        maxHeight: 280,

        zIndex: 1000,
        elevation: 10,

        overflow: "hidden",
    },

    timeOption: {
        height: 40,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },

    amPm: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#505258',
        borderRadius: 10,
        width: '100%',
        height: 38,
        overflow: 'hidden',
    },

    amPmInput: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    amPmInputActive: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        width: '100%',
    },

    label: {
        flex: 1,
        gap: 4,
    },

    inputText: {
        color: '#fff',
        itemsAlign: 'center'
    },
    dataInput: {
        backgroundColor: 'rgba(30, 37, 68, 0.8)',
        borderWidth: 1,
        borderColor: '#505258',
        borderStyle: 'solid',
        shadowColor: "#505258",

        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 10,

        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 20,
        color: '#fff'
    },

})