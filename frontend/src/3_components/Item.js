import { View, Pressable, Text } from "react-native"
import Svg, {
  ClipPath,
  Defs,
  Polygon,
  Image as SvgImage,
} from "react-native-svg"
import { user } from "../2_services/styles"
import { useNavigation } from "@react-navigation/native"

const Item = ({
  id,
  clipKey,
  url,
  name,
  quantity,
  itemData,
  filterType,
  toggleShop,
}) => {
  const cleanUrl = typeof url === "string" ? url.trim() : ""
  const normalizedUrl = cleanUrl
    ? cleanUrl.startsWith("http")
      ? cleanUrl
      : `${process.env.EXPO_PUBLIC_BACKEND_URL}${encodeURI(cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`)}`
    : null
  const navigation = useNavigation()

  function handleViewItem() {
    navigation.navigate("ViewItem", {
      filterType,
      toggleShop,
      item: {
        ...(itemData ?? {}),
        id: itemData?.id ?? id,
        url: itemData?.url ?? itemData?.image_path,
        name: itemData?.name,
        quantity: itemData?.quantity ?? quantity,
        description: itemData?.description,
      },
    })
  }

  const imageSource = normalizedUrl ? { uri: normalizedUrl } : null
  const rawClipKey = String(
    clipKey ?? id ?? `${name ?? "item"}-${quantity ?? 0}`,
  )
  const safeClipKey = rawClipKey.replace(/[^a-zA-Z0-9_-]/g, "_")
  const clipId = `avatarClip-${safeClipKey}`

  const size = 60
  const cut = 10
  return (
    <View style={user.gridItemWrapper}>
      <Pressable onPress={handleViewItem}>
        <View style={user.imageWrapper}>
          <Svg width={size} height={size}>
            <Defs>
              <ClipPath id={clipId}>
                <Polygon
                  points={`0,0 ${size},0 ${size},${size - cut} ${size - cut},${size} 0,${size}`}
                />
              </ClipPath>
            </Defs>
            {imageSource ? (
              <SvgImage
                width={size}
                height={size}
                preserveAspectRatio="xMidYMid slice"
                href={imageSource}
                clipPath={`url(#${clipId})`}
              />
            ) : null}
            <Polygon
              points={`0,0 ${size},0 ${size},${size - cut} ${size - cut},${size} 0,${size}`}
              fill="none"
              stroke="#9FDAEF"
              strokeWidth="2"
            />
          </Svg>
        </View>
        <View style={user.meta}>
          <Text numberOfLines={2} style={user.itemName}>
            {name ?? "Unknown item"}
          </Text>
          {toggleShop === false ? (
            <Text style={user.itemQuantity}>x{quantity}</Text>
          ) : null}
        </View>
      </Pressable>
    </View>
  )
}

export default Item
