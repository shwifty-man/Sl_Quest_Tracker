import { Pressable, Text, View } from "react-native"
import { home, styles } from "../../2_services/styles"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';


const NavBar = () => {
    const navigation = useNavigation()
    const route = useRoute();
    const active = route.name;

    return (
        <View style={[home.footer]}>
            <Pressable
                onPress={() => navigation.navigate("Home")}
                style={[home.NavPressable, { color: '#000' }]}
            >
                <MaterialCommunityIcons name="home-outline" size={30} color={active === "Home" ? '#00E0FF' : "#434966"} />
                <Text style={{ fontSize: 12, color: active === "Home" ? "#00E0FF" : "#434966" }}>Home</Text>
            </Pressable>

            <Pressable
                onPress={() => navigation.navigate("QuestsList")}
                style={active ? home.NavPressable : [home.NavPressable, { color: '#00E0FF' }]}
            >
                <MaterialCommunityIcons name="clipboard-text-outline" size={30} color={active === "QuestsList" ? '#00E0FF' : "#434966"} />
                <Text style={{ fontSize: 12, color: active === "QuestsList" ? "#00E0FF" : "#434966" }}>Quests</Text>
            </Pressable>
            <Pressable
                onPress={() => navigation.navigate("Stats")}
                style={[home.NavPressable, { color: '#000' }]}
            >
                <Ionicons name="stats-chart-outline" size={28} color={active === "Stats" ? '#00E0FF' : "#434966"} />
                <Text style={{ fontSize: 12, color: active === "Stats" ? "#00E0FF" : "#434966" }}>Stats</Text>
            </Pressable>
            <Pressable
                onPress={() => navigation.navigate("Shop")}
                style={[home.NavPressable, { color: '#000' }]}
            >
                <MaterialCommunityIcons name="shopping-outline" size={30} color={active === "Shop" ? '#00E0FF' : "#434966"} />
                <Text style={{ fontSize: 12, color: active === "Shop" ? "#00E0FF" : "#434966" }}>Shop</Text>
            </Pressable>
            <Pressable
                onPress={() => navigation.navigate("Profile")}
                style={[home.NavPressable, { color: '#000' }]}
            >
                <Ionicons name="person-outline" size={28} color={active === "Profile" ? '#00E0FF' : "#434966"} />
                <Text style={{ fontSize: 12, color: active === "Profile" ? "#00E0FF" : "#434966" }}>Profile</Text>
            </Pressable>
        </View>
    )
}

export default NavBar
