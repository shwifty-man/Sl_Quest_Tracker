import { FlatList, Text, Pressable, View } from "react-native"
import { styles } from "../../2_services/styles"
import { questDetailsStyles } from "../../Styles/questDetailsStyles"
import QuestCard from "./QuestCard"

function QuestList({ limit = false, quests = [], showSeeAll = false, navigation, filters }) {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#010C1F',
                borderRadius: 20,
                borderWidth: 1,
                borderColor: showSeeAll ? '#172D4D' : null,
                padding: 14,
            }}>

            {filters ? (filters.map((Component, index) => {
                <Component key={index} />
            })) : null}

            <FlatList
                style={{ flex: 1 }}
                data={limit ? quests.slice(0, 6) : quests}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={({ item }) => (
                    <QuestCard
                        id={item.id}
                        title={item.title}
                        deadLine={item.deadline}
                        createdAt={item.created_at}
                        reward={item.reward}
                        status={item.status}
                        type={item.type}
                        difficulty={item.difficulty}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        No active quests.
                    </Text>
                }
                contentContainerStyle={{
                    gap: 10,
                    ...(quests.length === 0 ? styles.center : {}),
                }}
            />

            {showSeeAll && (
                <Pressable
                    style={[
                        {
                            height: 46,
                            width: '100%',
                            alignSelf: 'center',
                            marginTop: 10,
                            borderRadius: 9,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: '#0A143A',
                            borderColor: '#4C73FF',
                            borderWidth: 1,
                            borderStyle: 'solid',
                        },
                    ]}
                    onPress={() => navigation.navigate("QuestsList")}
                >
                    <Text
                        style={[
                            questDetailsStyles.completeButtonText,
                            { fontSize: 18, color: '#4C73FF' },
                        ]}
                    >
                        View all
                    </Text>
                </Pressable>
            )}
        </View>
    )
}

export default QuestList;