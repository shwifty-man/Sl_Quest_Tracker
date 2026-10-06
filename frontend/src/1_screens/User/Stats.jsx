import React, { useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useUser } from "../../2_services/context.js";
import NavBar from "../../3_components/Utils/NavBar.jsx";
import WeeklyProgress from "../../3_components/Utils/WeeklyProgress.jsx";
import HeaderTitle from "../../3_components/Utils/headerTitle.jsx"

import { globalStyles } from "../../2_services/styles.js";
import { statsStyles } from "../../Styles/statsStyles.js";

import backgroundImage from "../../../assets/library.png";

export default function Stats() {
  const {
    stats,
    streak,
    progress,
    weekly,
    getUserProfile,
  } = useUser();

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <View style={globalStyles.container}>

      <ImageBackground
        source={backgroundImage}
        style={[
          globalStyles.innerContainer,
          styles.background,
          {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
          }
        ]}
        resizeMode="cover"
      >

        {/* Dark atmospheric overlay */}
        <View style={styles.overlay} />

        {/* Bottom fade */}
        <View style={styles.bottomFade} />

        {/* Main content */}
        <View style={styles.content}>

          <View style={{ marginBottom: 15 }}>
            <HeaderTitle title="STATS" />
          </View>

          {/* STREAK */}
          <View style={statsStyles.streakCard}>

            <View>
              <Text style={statsStyles.label}>
                Current Streak
              </Text>

              <View style={statsStyles.streakRow}>
                <Text style={statsStyles.streakNumber}>
                  {streak?.current_streak ?? 0}
                </Text>

                <Text style={statsStyles.days}>
                  days
                </Text>
              </View>
            </View>

            <MaterialCommunityIcons
              name="fire"
              size={55}
              color="#FFB62B"
            />

          </View>

          {/* STATS */}
          <View style={statsStyles.statsCard}>

            <View style={statsStyles.statRow}>

              <Text style={statsStyles.label}>
                Quests Completed
              </Text>

              <Text style={statsStyles.value}>
                {stats?.completed_quests ?? 0}
              </Text>

            </View>

            <View style={statsStyles.divider} />

            <View style={statsStyles.statRow}>

              <View style={statsStyles.statLabel}>

                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={20}
                  color="#FFB62B"
                />

                <Text style={statsStyles.label}>
                  Total XP
                </Text>

              </View>

              <Text style={statsStyles.value}>
                {progress?.exp ?? 0}
              </Text>

            </View>

            <View style={statsStyles.divider} />

            <View style={statsStyles.statRow}>

              <View style={statsStyles.statLabel}>

                <MaterialCommunityIcons
                  name="diamond"
                  size={20}
                  color="#38E6A3"
                />

                <Text style={statsStyles.label}>
                  Focus Score
                </Text>

              </View>

              <Text style={statsStyles.value}>
                {stats?.focus ?? 0}%
              </Text>

            </View>

          </View>

          {/* WEEKLY */}
          <View style={styles.weeklyContainer}>
            <WeeklyProgress data={weekly} />
          </View>

        </View>

      </ImageBackground>

      <NavBar />

    </View>
  );
}

const styles = StyleSheet.create({

  background: {
    backgroundColor: "#010C1F",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(1, 12, 31, 0.48)",
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "45%",
    backgroundColor: "rgba(1, 12, 31, 0.18)",
  },

  content: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 12,
    justifyContent: "center",
  },

  weeklyContainer: {
    width: "100%",
  },

});