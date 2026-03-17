import { View, Pressable, FlatList, Text } from "react-native"
import { useUser } from "../../2_services/context"
import Profile from "../../3_components/Profile"
import Tag from "../../3_components/Tag"
import Item from "../../3_components/Item"
import { home, styles, text, user } from "../../2_services/styles"
import Svg, { Polygon } from "react-native-svg"
import { useState } from "react"
import Edgeglow from "../../3_components/EdgeGlow"

export default function Inventory({ navigation }) {
  const { inventory, shop, coins } = useUser()
  const [filterType, setFilterType] = useState(null)
  const [toggleShop, setToggleShop] = useState(false)

  let items = inventory
  let showProfile = true
  let tagName = "Inventory"
  let buttonWord = "Shop"
  if (toggleShop === true) {
    items = shop
    showProfile = false
    tagName = "Shop"
    buttonWord = "Inventory"
  }

  function handleViewShop() {
    setToggleShop((current) => !current)
  }

  return (
    <View style={styles.container}>
      <Edgeglow />
      {showProfile === true ? <Profile /> : null}

      <View
        style={[
          user.inventoryContainer,
          toggleShop && { borderTopRightRadius: 20, borderTopLeftRadius: 20 },
        ]}
      >
        <View style={[{ width: "100%" }]}>
          <Tag label={tagName} />
          <View style={user.inventoryFilterRow}>
            <Pressable
              onPress={() => setFilterType("consumable")}
              style={user.inventoryFilterPressable}
            >
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 72 22"
                preserveAspectRatio="none"
                style={user.inventoryFilterShape}
                pointerEvents="none"
              >
                <Polygon
                  points="8,1 64,1 70,21 2,21"
                  fill="#5BA4DE"
                  stroke="#9FDAEF"
                  strokeWidth="2"
                />
              </Svg>
              <Text style={user.inventoryFilterText}>Consumables</Text>
            </Pressable>
            <Pressable
              onPress={() => setFilterType("badge")}
              style={user.inventoryFilterPressable}
            >
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 72 22"
                preserveAspectRatio="none"
                style={user.inventoryFilterShape}
                pointerEvents="none"
              >
                <Polygon
                  points="8,1 64,1 70,21 2,21"
                  fill="#5BA4DE"
                  stroke="#9FDAEF"
                  strokeWidth="2"
                />
              </Svg>
              <Text style={user.inventoryFilterText}>Badges</Text>
            </Pressable>
            <Pressable
              onPress={() => setFilterType("multiplier")}
              style={user.inventoryFilterPressable}
            >
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 72 22"
                preserveAspectRatio="none"
                style={user.inventoryFilterShape}
                pointerEvents="none"
              >
                <Polygon
                  points="8,1 64,1 70,21 2,21"
                  fill="#5BA4DE"
                  stroke="#9FDAEF"
                  strokeWidth="2"
                />
              </Svg>
              <Text style={user.inventoryFilterText}>Multipliers</Text>
            </Pressable>
          </View>
        </View>
        {toggleShop === true ? (
          <Text style={[text.gold, { marginTop: 10 }]}>Gold: {coins}</Text>
        ) : null}
        <FlatList
          style={user.gridList}
          contentContainerStyle={user.gridContent}
          data={items}
          extraData={items}
          numColumns={4}
          columnWrapperStyle={user.gridColumn}
          keyExtractor={(item, index) => String(item?.id ?? item?._id ?? index)}
          renderItem={({ item, index }) =>
            (filterType === null || item.type === filterType) && (
              <Item
                id={item?.id ?? item?._id}
                clipKey={`${item?.id}-${index}`}
                itemData={item}
                toggleShop={toggleShop}
                url={item?.url ?? item?.image_path}
                name={item?.name}
                quantity={item?.quantity}
              />
            )
          }
          ListEmptyComponent={
            <Text style={{ color: "white", textAlign: "center" }}>
              No items found.
            </Text>
          }
        />
      </View>
      <View style={home.footer}>
        <Pressable
          onPress={handleViewShop}
          style={[styles.pressableButton, { borderRadius: 10 }]}
        >
          <Text style={{ fontSize: 18 }}>{buttonWord}</Text>
        </Pressable>
      </View>
    </View>
  )
}
