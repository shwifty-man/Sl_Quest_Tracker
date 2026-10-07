import {
    View
} from "react-native"

import { styles } from "../../Styles/profileStyles.js"

function SmallLineDiamond({ color }) {
    return (
        <View style={[styles.header, { justifyContent: 'space-evenly' }]}>
            <View style={[styles.headerLine, color ? { backgroundColor: color } : null, { width: '20%', flex: 0 }]} />

            <View style={[styles.diamond, color ? { backgroundColor: color } : null]} />

            <View style={[styles.headerLine, color ? { backgroundColor: color } : null, { width: '20%', flex: 0 }]} />
        </View>
    )
}

export default SmallLineDiamond;