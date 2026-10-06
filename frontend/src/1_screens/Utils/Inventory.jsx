import { View, Pressable, FlatList, Text } from "react-native"
import { useEffect } from "react"

import { useUser } from "../../2_services/context"
import { user } from "../../2_services/styles"
import { styles } from "../../Styles/profileStyles.js"

import Card from "../../3_components/Utils/ItemCard";

export default function Inventory() {
  const { inventory, getUserInventory } = useUser()

  useEffect(() => {
    getUserInventory()
  }, [])

  return (
    <View style={[styles.menuContainer, { flex: 0.8, paddingTop: 10, margin: 'auto' }]}>
      <Text style={{ textAlign: 'center', color: "#DDE8FF", fontSize: 20, }}>Inventory</Text>

      <FlatList
        style={user.gridList}
        contentContainerStyle={user.gridContent}
        data={inventory}
        extraData={inventory}
        numColumns={1}
        keyExtractor={(item, index) =>
          String(item?.id ?? item?._id ?? index)
        }
        renderItem={({ item }) => (
          <Card
            id={item?.item_id}
            title={item?.name}
            description={item?.description}
            price={item?.price}
            icon={item?.image_path}
            isItem={true}
            quantity={item?.quantity}
          />
        )}
        ListEmptyComponent={
          <Text style={{ color: "white", textAlign: "center" }}>
            No items found.
          </Text>
        }
      />
    </View>
  )
}
