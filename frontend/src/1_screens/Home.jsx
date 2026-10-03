import { Button, Pressable, Text, View } from "react-native"
import { home, styles, globalStyles } from "../2_services/styles"
import { useAuth, useQuests, useUser } from "../2_services/context"
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { startAppWatcherService } from "../2_services/handleOverlay"

import HomeHeaderProfile from "../3_components/Home/HomeHeaderProfile.jsx"
import SettingsIcon from "../3_components/SettingsIcon"
import QuestsList from "./Quest/AllQuest"
import NavBar from "../3_components/Utils/NavBar.jsx"
import QuestList from "../3_components/Quests/QuestList.jsx"
import PenatlyStatus from "../3_components/Utils/PenaltyStatus.jsx"


const Home = () => {
  const { hunterName, progress, getUserProfile } = useUser()
  const { quests, getQuests, penaltyStatus, setPenaltyStatus } = useQuests()
  const { token } = useAuth()
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (!token) return;

      const loadQuests = async () => {
        await getQuests();
      };

      loadQuests();
    }, [token, getQuests])
  );

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      await getUserProfile(token);
      await startAppWatcherService();
    };

    load();
  }, [token]);

  return (
    <View style={[globalStyles.container]}>
      <View style={{

        backgroundColor: "#092356",
        justifyContent: 'space-evenly',

        marginTop: 20,
        padding: 0,

        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,

        borderColor: '#12417E',
        borderStyle: 'solid',
        marginBottom: -5
      }}>
        <HomeHeaderProfile name={hunterName} exp={progress?.exp} level={progress?.level} requiredExp={progress?.exp_to_next_level} />
      </View>
      <View style={{
        flex: 1,
        gap: 10,

        backgroundColor: "#092356",
        justifyContent: 'space-evenly',

        paddingVertical: 20,
        padding: 12,

        borderLeftWidth: 1,
        borderRightWidth: 1,

        borderColor: '#12417E',
        borderStyle: 'solid'
      }}>
        <QuestList quests={quests} limit={true} showSeeAll={true} navigation={navigation} />
        <PenatlyStatus penalty={penaltyStatus} setPenalty={setPenaltyStatus} />
      </View>
      <NavBar />
    </View>
  )
}

export default Home