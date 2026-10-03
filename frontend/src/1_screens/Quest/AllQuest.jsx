import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useQuests } from "../../2_services/context.js";

import HeaderTitle from "../../3_components/Utils/headerTitle.jsx"
import QuestList from "../../3_components/Quests/QuestList.jsx";
import SectionHeader from "../../3_components/Quests/SectionHeader.jsx";
import FilterPill from "../../3_components/Utils/FilterPill.jsx";
import NavBar from "../../3_components/Utils/NavBar.jsx";

const QuestsList = () => {
  const navigation = useNavigation();

  const { isLoading, getQuestByFilter } = useQuests();

  const [displayQuests, setDisplayQuests] = useState([]);

  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("Newest");

  useFocusEffect(
    useCallback(() => {
      const quests = getQuestByFilter(
        statusFilter,
        typeFilter,
        sortFilter
      );

      setDisplayQuests(quests || []);
    }, [getQuestByFilter, statusFilter, typeFilter, sortFilter])
  );




  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.appContainer}>

        <View style={{ margin: 20, marginTop: 45 }}>
          <HeaderTitle title="QUESTS" />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>

          {/* FILTERS */}
          <View style={styles.filterRow}>

            <FilterPill
              title="Type"
              value={typeFilter}
              options={["All", "Daily", "Weekly", "Once"]}
              onSelect={setTypeFilter}
            />

            <FilterPill
              title="Status"
              value={statusFilter}
              options={[
                "All",
                "Pending",
                "Completed",
                "Failed",
              ]}
              onSelect={setStatusFilter}
            />

            <FilterPill
              title="Sort"
              value={sortFilter}
              options={["Newest", "Oldest"]}
              onSelect={setSortFilter}
            />

          </View>

          {/* SECTION HEADER */}
          <View style={styles.sectionContainer}>
            <SectionHeader
              icon="calendar-outline"
              title="Today"
              number={displayQuests.length}
            />
          </View>

          {/* QUEST AREA */}
          <View style={styles.questPanel}>

            {displayQuests.length === 0 ? (
              <View style={styles.emptyState}>

                {/* EMPTY STATE ICON */}
                <View style={styles.emptyIconGlow}>
                  <LinearGradient
                    colors={["#193d91", "#09245d"]}
                    style={styles.emptyIconCircle}
                  >
                    <MaterialCommunityIcons
                      name="clipboard-text-outline"
                      size={26}
                      color="#29C8FF"
                    />
                  </LinearGradient>
                </View>

                <Text style={styles.emptyTitle}>
                  No active quests.
                </Text>

                <Text style={styles.emptyDescription}>
                  Your quests will show up here{"\n"}
                  once you have some.
                </Text>

              </View>
            ) : (
              <QuestList quests={displayQuests} />
            )}

            {/* CREATE BUTTON */}
            <Pressable
              onPress={() => navigation.navigate("QuestCreate")}
              style={({ pressed }) => [
                styles.createButtonWrapper,
                pressed && styles.createButtonPressed,
              ]}
            >
              <LinearGradient
                colors={["#218CFF", "#1472F2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.createButton}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={34}
                  color="#FFFFFF"
                />

                <Text style={styles.createButtonText}>
                  Create Quest
                </Text>
              </LinearGradient>
            </Pressable>

          </View>
        </View>

        <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 15 }}>
          <NavBar />
        </View>

      </View>
    </SafeAreaView>
  );
};

export default QuestsList;

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#030F20",
  },

  appContainer: {
    flex: 1,
    backgroundColor: "#030F20",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#030F20",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#AEBEDC",
    fontSize: 18,
    fontWeight: "500",
  },

  /* ---------------- HEADER ---------------- */

  header: {
    height: 112,
    paddingHorizontal: 24,
    paddingTop: 24,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#12417E",
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#1551B2",

    borderWidth: 1,
    borderColor: "#318AFF",

    shadowColor: "#168DFF",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 6,
  },

  headerTitle: {
    fontSize: 24, color: '#fff', textAlign: "center", fontFamily: 'Orbitron_700Bold'
  },

  /* ---------------- CONTENT ---------------- */

  content: {
    flex: 1,
    backgroundColor: "#030F20",
    paddingTop: 16,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
    zIndex: 50,
  },

  sectionContainer: {
    marginTop: 18,
    paddingHorizontal: 24,
  },

  /* ---------------- QUEST PANEL ---------------- */

  questPanel: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#174780",

    overflow: "hidden",

    backgroundColor: "#010C1F",
  },

  /* ---------------- EMPTY STATE ---------------- */

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyIconGlow: {
    marginBottom: 22,
  },

  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 59,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#174E9D",

    shadowColor: "#168DFF",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 7,
  },

  sparkle: {
    position: "absolute",
  },

  sparkleOne: {
    top: 58,
    marginLeft: 195,
  },

  sparkleTwo: {
    top: 120,
    marginLeft: -185,
  },

  emptyTitle: {
    color: "#F3F6FF",
    fontSize: 23,
    lineHeight: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },

  emptyDescription: {
    color: "#9AAED2",
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "500",
    textAlign: "center",
  },

  /* ---------------- CREATE BUTTON ---------------- */
  createButtonWrapper: {
    marginHorizontal: 24,
    marginBottom: 20,
    width: '80%',
    borderRadius: 20,

    shadowColor: "#198AFF",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,
    alignSelf: 'center',
  },

  createButtonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },

  createButton: {
    height: 46,
    borderRadius: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#46A7FF",

  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "600",
    marginLeft: 8,
    letterSpacing: 0.1,
    fontFamily: 'Orbitron_400Regular'
  },
});