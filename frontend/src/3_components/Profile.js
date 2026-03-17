import { useEffect } from "react"
import { useAuth, useUser } from "../2_services/context"
import ProgressBar from "./Progressbar"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { View, Text, Image, Pressable } from "react-native"
import Svg, {
  Defs,
  ClipPath,
  Polygon,
  Image as SvgImage,
} from "react-native-svg"
import { home, QuestDetails, styles, text } from "../2_services/styles"

const Profile = () => {
  const { hunterName, progress, badge, coins, getUserProfile } = useUser()
  const { token } = useAuth()
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  function handleViewProfile() {
    navigation.navigate("Stats")
  }

  useEffect(() => {
    if (!token || !isFocused) return
    getUserProfile(token).catch(() => {})
  }, [getUserProfile, token, isFocused])

  const displayHunterName =
    typeof hunterName === "string"
      ? hunterName
      : hunterName?.username
        ? String(hunterName.username)
        : hunterName
          ? String(hunterName)
          : ""
  const url = badge?.image_path
    ? `${process.env.EXPO_PUBLIC_BACKEND_URL}${encodeURI(badge.image_path)}`
    : null

  const size = 120
  const cut = 22

  return (
    <Pressable onPress={handleViewProfile}>
      <View style={home.profileContainer}>
        <View style={styles.filterRowImage}>
          {url ? (
            <Svg marginRight="12" width={size} height={size}>
              <Defs>
                <ClipPath id="avatarClip">
                  <Polygon
                    points={`0,0 ${size},0 ${size},${size - cut} ${size - cut},${size} 0,${size}`}
                  />
                </ClipPath>
              </Defs>
              <SvgImage
                width={size}
                height={size}
                preserveAspectRatio="xMidYMid slice"
                href={{ uri: url }}
                clipPath="url(#avatarClip)"
              />
              <Polygon
                points={`0,0 ${size},0 ${size},${size - cut} ${size - cut},${size} 0,${size}`}
                fill="none"
                stroke="#9FDAEF"
                strokeWidth="2"
              />
            </Svg>
          ) : null}

          <View style={styles.filterColumn}>
            <View style={home.hunterLabel}>
              <Text style={text.name}>{displayHunterName} </Text>
              <Text style={text.level}>Level {progress?.level}</Text>
            </View>
            <ProgressBar currentExp={progress?.exp} level={progress?.level} />
            <Text style={text.gold}>Gold: {coins}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default Profile
