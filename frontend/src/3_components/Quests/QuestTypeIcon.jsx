import { Text, Pressable } from "react-native"
import { questStyles } from "../../Styles/questStyles.js"
import { useState } from "react"

function QuestTypeIcon({ Icon, Title = "Title", onPress, selected, name, color }) {
    return (
        <Pressable
            onPress={onPress} // Edge case for Once since Title is Once but selected is set to One-time
            style={selected === Title || selected === "One-time" && Title === "Once" ? [questStyles.questTypeIconActive, questStyles.questTypeIcon, { borderColor: color, shadowColor: color, }] : [questStyles.questTypeIcon, questStyles.questTypeIconDeactive]}>
            {Icon && (<Icon name={name} color={color} size={30} style={{ opacity: selected === Title ? 1 : 0.4 }} />)}
            <Text style={selected === Title ? { color: "#fff", fontWeight: "500", } : { color: "#ffffffe5" }}>{Title}</Text>
        </Pressable>
    )
}

export default QuestTypeIcon;