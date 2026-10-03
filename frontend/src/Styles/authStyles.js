import { StyleSheet } from "react-native"

const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020914",
    },

    background: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 14,
        paddingVertical: 30,
    },

    backgroundGlowOne: {
        position: "absolute",
        width: 230,
        height: 230,
        borderRadius: 115,
        backgroundColor: "#06347A",
        opacity: 0.16,
        top: "8%",
        left: -100,
    },

    backgroundGlowTwo: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: "#1165D8",
        opacity: 0.11,
        bottom: "4%",
        right: -120,
    },

    panel: {
        width: "100%",
        maxWidth: 430,
        alignSelf: "center",

        borderRadius: 18,
        overflow: "hidden",

        paddingHorizontal: 22,
        paddingTop: 28,
        paddingBottom: 25,

        backgroundColor: "rgba(3, 12, 28, 0.45)",

        borderWidth: 0,
    },

    topGlow: {
        position: "absolute",
        top: -40,
        left: "20%",
        width: "60%",
        height: 80,
        backgroundColor: "#176BFF",
        opacity: 0.09,
        borderRadius: 50,
    },

    title: {
        color: "#E5F2FF",
        fontSize: 20,
        fontWeight: "800",
        letterSpacing: 3,
        textAlign: "center",
        textShadowColor: "#2B88FF",
        textShadowOffset: {
            width: 0,
            height: 0,
        },
        textShadowRadius: 10,
    },

    subtitle: {
        color: "#7283A0",
        fontSize: 13,
        textAlign: "center",
        marginTop: 7,
        marginBottom: 28,
    },

    form: {
        width: "100%",
    },

    label: {
        color: "#6E84A7",
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1.2,
        marginBottom: 8,
    },

    input: {
        height: 46,
        backgroundColor: "#0B1930",
        borderWidth: 1,
        borderColor: "#1A304E",
        borderRadius: 7,
        paddingHorizontal: 13,
        color: "#E7F2FF",
        fontSize: 12,
        marginBottom: 18,
    },

    passwordContainer: {
        height: 46,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0B1930",
        borderWidth: 1,
        borderColor: "#1A304E",
        borderRadius: 7,
        marginBottom: 13,
    },

    passwordInput: {
        flex: 1,
        height: "100%",
        paddingHorizontal: 13,
        color: "#E7F2FF",
        fontSize: 12,
    },

    eyeButton: {
        width: 42,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },

    eyeText: {
        color: "#617797",
        fontSize: 17,
    },

    optionsRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 25,
    },

    forgotText: {
        color: "#8190A8",
        fontSize: 10,
    },

    loginButton: {
        width: "100%",
        height: 46,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1265DB",
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "#2682FF",
        shadowColor: "#176BFF",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.4,
        shadowRadius: 9,
        elevation: 5,
    },

    loginButtonDisabled: {
        backgroundColor: "#0D274B",
        borderColor: "#18395E",
        shadowOpacity: 0,
    },

    loginButtonText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1,
    },

    loginButtonTextDisabled: {
        color: "#56708F",
    },

    bottomRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 18,
    },

    bottomText: {
        color: "#71819B",
        fontSize: 10,
    },

    linkText: {
        color: "#45A5FF",
        fontSize: 10,
        fontWeight: "700",
    },
    registerButton: {

        width: "100%",

        height: 46,

        alignItems: "center",

        justifyContent: "center",

        backgroundColor: "#1265DB",

        borderRadius: 7,

        borderWidth: 1,

        borderColor: "#2682FF",

        shadowColor: "#176BFF",

        shadowOffset: {

            width: 0,

            height: 0,

        },

        shadowOpacity: 0.4,

        shadowRadius: 9,

        elevation: 5,

    },

    registerButtonDisabled: {

        backgroundColor: "#0D274B",

        borderColor: "#18395E",

        shadowOpacity: 0,

    },

    registerButtonText: {

        color: "#FFFFFF",

        fontSize: 11,

        fontWeight: "800",

        letterSpacing: 1,

    },

    registerButtonTextDisabled: {

        color: "#56708F",

    },

    errorText: { color: "#FF5C6C", fontSize: 10, marginTop: -10, marginBottom: 12, paddingLeft: 2, },

})

export default authStyles;