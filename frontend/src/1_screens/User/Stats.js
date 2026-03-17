import React from "react"
import { View, Text, Button, Pressable } from "react-native"
import { useUser } from "../../2_services/context"
import { home, styles } from "../../2_services/styles"
import StatCircle from "../../3_components/StatCircle"
import Profile from "../../3_components/Profile"
import Edgeglow from "../../3_components/EdgeGlow"
import Tag from "../../3_components/Tag"
import { useNavigation } from "@react-navigation/native"

export default function Stats() {
  const { stats } = useUser()
  const navigation = useNavigation()

  if (!stats) {
    return (
      <View style={styles.container}>
        <Profile />
        <View
          style={[
            home.mainQuestContainer,
            {
              flex: 1,
              borderBottomWidth: 1,
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
            },
          ]}
        >
          <Text style={styles.sideQuestTitle}>STATS</Text>
          <Text style={styles.empty}>No stats available.</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Edgeglow />
      <Profile />
      <View
        style={[
          home.mainQuestContainer,
          {
            flex: 1,
            borderBottomWidth: 1,
            paddingBottom: 50,
          },
        ]}
      >
        <Tag label="Player stats:" />
        <View
          style={{
            flex: 1,
            width: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
            gap: 20,
          }}
        >
          <StatCircle
            label="Strength"
            value={stats.strength ?? 0}
            color="#5BA4DE"
          />
          <StatCircle
            label="Endurance"
            value={stats.endurance ?? 0}
            color="#7CD992"
          />
          <StatCircle label="Focus" value={stats.focus ?? 0} color="#C18BFF" />
          <StatCircle
            label="Discipline"
            value={stats.discipline ?? 0}
            color="#F5C056"
          />
          <StatCircle
            label="Recovery"
            value={stats.recovery ?? 0}
            color="#FF7A7A"
          />
        </View>
      </View>
      <View style={[home.footer, { marginTop: "auto", alignSelf: "stretch" }]}>
        <Pressable
          onPress={() => navigation.navigate("Inventory")}
          style={[styles.pressableButton, { marginTop: 12, borderRadius: 10 }]}
        >
          <Text style={{ fontSize: 18 }}>Inventory</Text>
        </Pressable>
      </View>
    </View>
  )
}
