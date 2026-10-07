import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native"

import { useEffect, useState } from "react"

import {
  styles,
  COLORS,
} from "../2_services/styles"

import {
  useAuth,
  useUser,
} from "../2_services/context"
import BackArrow from "../3_components/Utils/BackArrow.jsx"

import { useNavigation } from "@react-navigation/native"

export default function ViewItem({ route }) {

  const { token } = useAuth()

  const {
    getUserInventory,
    getUserShop,
  } = useUser()

  const navigation = useNavigation()

  const [item, setItem] = useState(
    route?.params?.item ?? {}
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {

    setItem(
      route?.params?.item ?? {}
    )

  }, [route?.params?.item])

  const id = item?.id
  const title = item?.title
  const description = item?.description
  const price = item?.price
  const icon = item?.icon

  const imageUrl = icon
    ? icon.startsWith("http")
      ? icon
      : `${process.env.EXPO_PUBLIC_BACKEND_URL}${icon.startsWith("/") ? icon : `/${icon}`}`
    : null

  async function handleBuy() {

    if (isSubmitting || !id) return

    setIsSubmitting(true)

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/shop/buy`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            itemId: id,
          }),
        }
      )

      if (!res.ok) {

        throw new Error(
          `Failed to buy item: ${res.status}`
        )

      }

      const data = await res.json()
      console.log("data: ", data)

      await getUserShop()
      await getUserInventory()
      navigation.navigate("Shop")

    } catch (error) {

      console.error(
        "BUY ITEM ERROR:",
        error
      )

    } finally {

      setIsSubmitting(false)

    }
  }

  return (

    <View style={[styles.container, { flex: 1, alignItems: "center" }]}>

      <View style={user.detailCard}>

        <View style={user.itemHeader}>

          <BackArrow navigation={navigation} />

          <View style={user.itemHeaderText}>

            <Text style={user.itemTitle}>
              {title}
            </Text>

          </View>

        </View>

        {imageUrl ? (

          <Image
            source={{ uri: imageUrl }}
            style={user.detailImage}
            resizeMode="contain"
          />

        ) : null}

        <View style={user.infoBox}>

          <View style={user.costHeader}>

            <Text style={user.costLabel}>
              COST
            </Text>

            <Text style={user.costValue}>
              ◇ {price <= 0 ? "FREE" : price}
            </Text>

          </View>

          <View style={user.divider} />

          <Text style={user.description}>
            {description}
          </Text>

        </View>

        <Pressable
          onPress={handleBuy}
          disabled={isSubmitting}
          style={user.buyButton}
        >

          <Text style={user.buyButtonText}>
            {isSubmitting ? "BUYING..." : "◇ BUY"}
          </Text>

        </Pressable>

      </View>

    </View>

  )
}

export const user = StyleSheet.create({

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(94, 167, 255, 0.35)",
    borderRadius: 10,
    backgroundColor: "rgba(4, 14, 41, 0.75)",
  },

  backArrow: {
    color: COLORS.accent,
    fontSize: 34,
    fontWeight: "300",
    lineHeight: 38,
  },

  pageHeader: {
    width: "78%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(94, 167, 255, 0.45)",
    paddingBottom: 10,
    marginBottom: 18,
  },

  pageHeaderText: {
    color: COLORS.textLight,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: 3,
  },

  itemHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    marginBottom: 14,
  },

  itemIconBox: {
    width: 58,
    height: 58,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(20, 104, 215, 0.10)",
    marginRight: 14,
  },

  itemIcon: {
    color: COLORS.accent,
    fontSize: 28,
    fontWeight: "800",
  },

  itemHeaderText: {
    flex: 1,
    justifyContent: "center",
  },

  itemTitle: {
    color: COLORS.textLight,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
    flexShrink: 1,
  },

  detailCard: {
    width: "100%",
    flex: 1,
    backgroundColor: "rgba(9, 35, 86, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(94, 167, 255, 0.45)",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
    alignItems: "center",
    shadowColor: COLORS.accent,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },

  detailImage: {
    width: "90%",
    height: 270,
    marginTop: 6,
    marginBottom: 18,
  },

  infoBox: {
    width: "100%",
    backgroundColor: "rgba(4, 14, 41, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(94, 167, 255, 0.28)",
    borderRadius: 14,
    padding: 18,
  },

  costHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  costLabel: {
    color: "rgba(223, 240, 255, 0.65)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2.5,
  },

  costValue: {
    color: COLORS.accent,
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(94, 167, 255, 0.25)",
    marginVertical: 15,
  },

  description: {
    color: "rgba(237, 246, 255, 0.82)",
    fontSize: 15,
    lineHeight: 23,
    letterSpacing: 0.2,
  },

  buyButton: {
    width: "82%",
    height: 56,
    backgroundColor: COLORS.accent,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 2,
    shadowColor: COLORS.accent,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 7,
  },

  buyButtonText: {
    color: COLORS.background,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 2.5,
  },

})