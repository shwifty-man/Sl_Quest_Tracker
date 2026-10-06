import {
    View,
    Text,
    Pressable,
    StyleSheet,
    StatusBar,
    ImageBackground
} from "react-native"

import { useEffect } from "react"

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

import { useAuth, useUser } from "../../2_services/context"

import HomeHeaderProfile from "../../3_components/Home/HomeHeaderProfile.jsx"
import NavBar from "../../3_components/Utils/NavBar.jsx"
import HeaderTitle from "../../3_components/Utils/headerTitle.jsx"
import Inventory from "../Utils/Inventory"

import { useNavigation } from "@react-navigation/native"


import backgroundImage from "../../../assets/profileBackground.png";
import { globalStyles } from "../../2_services/styles"
import { styles } from "../../Styles/profileStyles.js"

const Profile = () => {

    const { hunterName, progress, getUserProfile } = useUser()
    const { token } = useAuth()
    const navigation = useNavigation()

    useEffect(() => {
        if (token) {
            getUserProfile(token)
        }
    }, [token, getUserProfile])

    function handleNav(path) {
        navigation.navigate(path)
    }

    const level = progress?.level ?? 1
    const exp = progress?.exp ?? 0
    const requiredExp = progress?.exp_to_next_level ?? 100

    const expProgress =
        requiredExp > 0
            ? Math.min(exp / requiredExp, 1)
            : 0

    return (
        <ImageBackground
            source={backgroundImage}
            style={[globalStyles.container, styles.screen]}
            imageStyle={styles.headerImage}
            resizeMode="cover"
        >

            <StatusBar
                barStyle="light-content"
                backgroundColor="#050F20"
            />

            <View style={styles.content}>

                {/* HEADER */}
                <View style={{ marginBottom: 28 }}>
                    <HeaderTitle title="PROFILE" />
                </View>
                {/* PROFILE CARD */}
                <HomeHeaderProfile name={hunterName} exp={progress?.exp} level={progress?.level} requiredExp={progress?.exp_to_next_level} showBackground={false} />


                {/* MENU */}
                <View style={styles.menuContainer}>

                    <Pressable style={styles.menuRow} onPress={() => handleNav("Settings")}>
                        <MaterialCommunityIcons
                            name="cog-outline"
                            size={27}
                            color="#80AFFF"
                        />

                        <Text style={styles.menuText}>
                            Settings
                        </Text>

                        <Ionicons
                            name="chevron-forward"
                            size={22}
                            color="#80AFFF"
                        />
                    </Pressable>


                    <View style={styles.divider} />


                    <Pressable style={styles.menuRow} onPress={() => handleNav("BlockedApps")}>
                        <MaterialCommunityIcons
                            name="close-circle-outline"
                            size={27}
                            color="#80AFFF"
                        />

                        <Text style={styles.menuText}>
                            Blocked Apps
                        </Text>

                        <Ionicons
                            name="chevron-forward"
                            size={22}
                            color="#80AFFF"
                        />
                    </Pressable>


                    <View style={styles.divider} />


                    <View style={styles.divider} />


                    <Pressable style={styles.menuRow} onPress={() => handleNav("Intro")}>
                        <MaterialCommunityIcons
                            name="information-outline"
                            size={27}
                            color="#80AFFF"
                        />

                        <Text style={styles.menuText}>
                            About QuestTracker
                        </Text>

                        <Ionicons
                            name="chevron-forward"
                            size={22}
                            color="#80AFFF"
                        />
                    </Pressable>

                </View>

                <Inventory />

            </View>

            {/* EXISTING BOTTOM NAV */}
            <NavBar />

        </ImageBackground>
    )
}

export default Profile