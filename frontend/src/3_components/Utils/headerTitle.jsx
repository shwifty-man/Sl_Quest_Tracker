import {
    View,
    Text
} from "react-native"

import { styles } from "../../Styles/profileStyles.js"

function HeaderTitle({ title, subHeader, color }) {
    return (
        <View style={styles.header}>
            <View style={[styles.headerLine, color ? { backgroundColor: color } : null]} />

            <View style={styles.headerTitleContainer}>
                <Text style={[styles.headerTitle, color ? { color } : null]}>
                    {title}
                </Text>
                {subHeader ?
                    <Text style={[styles.subHeaderTitle, color ? { color } : null]}>
                        {subHeader}
                    </Text> : null}

                <View style={[styles.diamond, color ? { backgroundColor: color } : null]} />
            </View>

            <View style={[styles.headerLine, color ? { backgroundColor: color } : null]} />
        </View>
    )
}

export default HeaderTitle;