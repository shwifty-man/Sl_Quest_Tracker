import { View, Text, Pressable, Image } from "react-native"
import React, { useState } from "react"

import { useNavigation } from "@react-navigation/native"
import { useUser, useAuth } from "../../2_services/context.js"
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";


const Card = ({ id, title, description, price, icon, isItem = false, quantity }) => {
    const navigation = useNavigation()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [itemQuantity, setItemQuantity] = useState(quantity)
    const { progress, getUserInventory, getActiveEffects } = useUser();

    const { token } = useAuth();

    function handleViewingItem() {
        navigation.navigate("ViewItem", {
            item: { id, title, description, price, icon },
        })
    }
    const imageUrl = icon
        ? `${process.env.EXPO_PUBLIC_BACKEND_URL}${icon}`
        : null;

    async function handleUse() {
        if (isSubmitting) return
        console.log(`HandleUse reached: isSubmitting: ${isSubmitting}, `)

        setIsSubmitting(true)

        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/inventory/use`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        itemId: id,
                    }),
                },
            )

            if (!res.ok) {
                throw new Error(`Failed to use item: ${res.status}`)
            }

            const {
                appliedEffect,
                remainingQuantity,
            } = await res.json()

            setItemQuantity(remainingQuantity)

            await getUserInventory()
            await getActiveEffects()
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <View style={isItem ? { flexDirection: 'row', width: '100%', alignItems: "center", paddingHorizontal: 10 } : null}>
            {isItem ? <Text style={{ color: '#fff' }}>{itemQuantity}x</Text> : null}
            <View
                style={[{
                    marginVertical: 8,
                    marginHorizontal: 12,
                    borderRadius: 16,
                    backgroundColor: "#1c1c24",
                    borderWidth: 1,
                    borderColor: "#33333f",
                    overflow: "hidden",
                }, isItem ? { width: '90%' } : null]}
            >
                <Pressable
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 14,
                        minHeight: 90,
                    }}
                    onPress={!isItem ? handleViewingItem : null}
                >
                    {imageUrl ? (
                        <View
                            style={{
                                width: !isItem ? 64 : 50,
                                height: !isItem ? 64 : 50,
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
                                    width: !isItem ? 50 : 40,
                                    height: !isItem ? 50 : 40,
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
                            {!isItem ? (
                                <>
                                    <MaterialCommunityIcons
                                        name="diamond"
                                        size={16}
                                        color="#635BFF"
                                    />

                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "800",
                                            color: progress.coins < price
                                                ? "#EF4444"
                                                : "#f5c542",
                                        }}
                                    >
                                        {price}
                                    </Text>
                                </>
                            ) : <Pressable
                                onPress={() => handleUse()}
                                style={{
                                    backgroundColor: '#4CFF88',
                                    padding: 5,
                                    borderRadius: 10,
                                }}>
                                <Text>Use</Text>
                            </Pressable>}
                        </View>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

export default Card