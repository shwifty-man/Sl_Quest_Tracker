import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";


function BackArrow({ navigation, passedFunction }) {
    return (
        <TouchableOpacity style={{ backgroundColor: '#50525892', borderRadius: 50, height: 40, width: 40, alignItems: 'center', justifyContent: 'center', }}
            onPress={async () => {
                if (passedFunction) {
                    await passedFunction()
                }
                navigation.goBack()
            }}>
            <Ionicons name="arrow-back" size={24} color="#ffffffe8" />
        </TouchableOpacity>
    )
}

export default BackArrow;