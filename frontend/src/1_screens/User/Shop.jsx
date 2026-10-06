import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useUser } from "../../2_services/context";

import Card from "../../3_components/Utils/ItemCard";
import NavBar from "../../3_components/Utils/NavBar.jsx";
import HeaderTitle from "../../3_components/Utils/headerTitle.jsx"

import { globalStyles } from "../../2_services/styles";

export default function Shop() {
  const {
    getUserShop,
    shop,
    progress,
  } = useUser();

  useEffect(() => {
    const loadShop = async () => {
      await getUserShop();
    };

    loadShop();
  }, [getUserShop]);

  return (
    <View style={globalStyles.container}>

      <View style={[styles.container, { paddingTop: 20 }]}>

        <HeaderTitle title="SHOP" />

        <View style={styles.currencyContainer}>

          <MaterialCommunityIcons
            name="diamond"
            size={22}
            color="#635BFF"
          />

          <Text style={styles.currency}>
            {progress?.coins}
          </Text>

        </View>

        {/* Items */}
        <FlatList
          data={shop}
          extraData={shop}
          keyExtractor={(item, index) =>
            String(item?.id ?? index)
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            shop?.length === 0 ? styles.emptyList : styles.listContent,
            { gap: 10 }
          ]}
          renderItem={({ item }) => (
            <Card
              id={item?.item_id}
              title={item?.name}
              description={item?.description}
              price={item?.price}
              icon={item?.image_path}
            />
          )
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No items found.
            </Text>
          }
        />

      </View>

      <NavBar />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,

    backgroundColor: "#010C1F",

    paddingHorizontal: 14,
    paddingTop: 10,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    borderColor: '#12417E',
    borderStyle: 'solid',
    borderWidth: 1
  },

  title: {
    textAlign: "center",

    fontSize: 24,
    fontWeight: "600",

    color: "#73B8FF",

    marginBottom: 8,
  },

  topBar: {
    height: 55,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 12,

    marginBottom: 12,
  },

  backButton: {
    width: 40,
    height: 40,

    justifyContent: "center",
    alignItems: "center",
  },

  currencyContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 7,
  },

  currency: {
    color: "#E7EDF7",

    fontSize: 17,
    fontWeight: "600",
  },

  listContent: {
    paddingTop: 8,
    paddingBottom: 12,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#AAB7C8",
    fontSize: 15,
    textAlign: 'center',
    alignSelf: 'center'
  },

});