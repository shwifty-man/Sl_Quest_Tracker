import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: '#092356',
    },

    content: {
        flex: 1,
        paddingHorizontal: 18,
        paddingTop: 35,
    },


    /* HEADER */

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    headerLine: {
        height: 1,
        flex: 1,
        backgroundColor: "#1E5CAD",
        opacity: 0.9,
    },

    headerTitleContainer: {
        alignItems: "center",
        marginHorizontal: 18,
    },

    headerTitle: {
        color: "#7FAEFF",
        fontSize: 24,
        fontWeight: "700",
        letterSpacing: 2,
    },

    diamond: {
        width: 9,
        height: 9,
        backgroundColor: "#4D8CFF",
        transform: [
            { rotate: "45deg" }
        ],
        marginTop: 10,
    },


    /* PROFILE CARD */

    profileCard: {
        minHeight: 220,

        borderRadius: 20,

        borderWidth: 1,
        borderColor: "#1875E8",

        backgroundColor: "#071426",

        paddingHorizontal: 22,
        paddingVertical: 25,

        flexDirection: "row",
        alignItems: "center",

        shadowColor: "#1478FF",
        shadowOpacity: 0.18,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 0,
        },

        elevation: 5,
    },

    profileInfo: {
        flex: 1,
    },

    greeting: {
        color: "#90B6F3",
        fontSize: 14,
        marginBottom: 12,
    },

    level: {
        color: "#F4F7FF",
        fontSize: 34,
        fontWeight: "700",
        marginBottom: 10,
    },

    expText: {
        color: "#7FAEFF",
        fontSize: 14,
        textAlign: "right",
        marginBottom: 6,
    },

    expBarBackground: {
        height: 12,
        width: "100%",

        backgroundColor: "#162E50",

        borderRadius: 10,

        overflow: "hidden",

        borderWidth: 1,
        borderColor: "#315683",
    },

    expBarFill: {
        height: "100%",
        backgroundColor: "#4386FF",
        borderRadius: 10,
    },


    /* SHIELD */

    shieldContainer: {
        width: 105,
        height: 105,

        borderRadius: 55,

        borderWidth: 1,
        borderColor: "#287CFF",

        backgroundColor: "#081A35",

        alignItems: "center",
        justifyContent: "center",

        marginLeft: 14,

        shadowColor: "#216DFF",
        shadowOpacity: 0.35,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 0,
        },

        elevation: 5,
    },

    swordIcon: {
        position: "absolute",
    },


    /* MENU */

    menuContainer: {
        marginTop: 28,

        borderRadius: 15,

        overflow: "hidden",

        borderWidth: 1,
        borderColor: "#1B3C68",

        backgroundColor: 'rgba(5, 15, 32)',
    },

    menuRow: {
        minHeight: 62,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
    },

    menuText: {
        flex: 1,

        marginLeft: 18,

        color: "#DDE8FF",

        fontSize: 16,
    },

    divider: {
        height: 1,
        backgroundColor: "#1A365A",
    },

})
