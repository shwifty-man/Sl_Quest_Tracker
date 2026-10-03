import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function SectionHeader({ icon, title, number }) {
    return (
        <View style={styles.container}>
            <View style={styles.leftSide}>
                <MaterialCommunityIcons
                    name={icon}
                    size={24}
                    color="#1A9FFF"
                />

                <Text style={styles.title}>
                    {title}
                </Text>
            </View>

            <View style={styles.line} />

            <Text style={styles.number}>
                {number} quests
            </Text>
        </View>
    );
}

const styles = {
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },

    leftSide: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    title: {
        color: "#F1F0F0",
        fontSize: 18,
        fontWeight: "600",
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#17324D",
        marginHorizontal: 12,
    },

    number: {
        color: "#56708A",
        fontSize: 13,
    },
};

export default SectionHeader;