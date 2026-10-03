import { View, Text } from "react-native";


function ExpPill({number}) {
    return (
        <View style={{ backgroundColor: '#1F184C', borderRadius: 10, height: 20, width: 60, alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', padding: '0.1%'}}>
            <Text style={{ color: '#7D56A8', fontSize: 12}}>+ {number} XP</Text>
        </View>
    )
}

export default ExpPill;