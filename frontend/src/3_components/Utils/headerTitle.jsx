import {
    View,
    Text
} from "react-native"

import { styles } from "../../Styles/profileStyles.js"

function HeaderTitle({ title }) {
    return (
        <View style={styles.header}>
            <View style={styles.headerLine} />

            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>
                    {title}
                </Text>

                <View style={styles.diamond} />
            </View>

            <View style={styles.headerLine} />
        </View>
    )
}

export default HeaderTitle;