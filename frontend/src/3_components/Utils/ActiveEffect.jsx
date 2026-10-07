import { View, Text, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ActiveEffect({
    icon,
    color,
    title,
    h = 0,
    m = 0,
    s = 0,
}) {
    return (
        <View style={[styles.container, { borderColor: color }]}>
            <MaterialCommunityIcons name={icon} size={16} color={color} />

            <Text style={[styles.title, { color }]}>
                {title}
            </Text>

            <Text style={styles.time}>
                {h}h {m}m {String(s).padStart(2, "0")}s
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 34,
        paddingHorizontal: 10,
        borderWidth: 1.5,
        borderRadius: 17,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#07142A",
    },

    title: {
        fontSize: 12,
        fontWeight: "700",
    },

    time: {
        color: "#B8C4D9",
        fontSize: 11,
        fontWeight: "600",
    },
})