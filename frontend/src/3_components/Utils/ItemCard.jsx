import { View, Text, Pressable, Image } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { useUser } from "../../2_services/context.js"
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";


const Card = ({ id, title, description, price, icon }) => {
    const navigation = useNavigation()
    const { progress } = useUser();

    function handleViewingItem() {
        navigation.navigate("ViewItem", {
            item: { id, title, description, price, icon },
        })
    }
    const imageUrl = icon
        ? `${process.env.EXPO_PUBLIC_BACKEND_URL}${icon}`
        : null;

    return (
        <View
            style={{
                marginVertical: 8,
                marginHorizontal: 12,
                borderRadius: 16,
                backgroundColor: "#1c1c24",
                borderWidth: 1,
                borderColor: "#33333f",
                overflow: "hidden",
            }}
        >
            <Pressable
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 14,
                    minHeight: 90,
                }}
                onPress={handleViewingItem}
            >
                {imageUrl ? (
                    <View
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 12,
                            backgroundColor: "#292934",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 14,
                        }}
                    >
                        <Image
                            source={{ uri: imageUrl }}
                            style={{
                                width: 50,
                                height: 50,
                            }}
                            resizeMode="contain"
                        />
                    </View>
                ) : null}

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        paddingRight: 10,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: "#ffffff",
                            marginBottom: 4,
                        }}
                        numberOfLines={1}
                    >
                        {title}
                    </Text>

                    <Text
                        style={{
                            fontSize: 13,
                            color: "#a9a9b5",
                            lineHeight: 18,
                        }}
                        numberOfLines={2}
                    >
                        {description}
                    </Text>
                </View>

                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 60,
                    }}
                >

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3
                    }}>
                        <MaterialCommunityIcons
                            name="diamond"
                            size={16}
                            color="#635BFF"
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "800",
                                color: progress.coins < price ? '#EF4444' : "#f5c542",
                            }}
                        >
                            {price}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </View>
    )
}

export default Card