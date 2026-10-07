import {
    View,
    Text,
    Pressable,
    StyleSheet,
    StatusBar,
    Image,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import { useEffect, useState } from "react";

import {
    loadSavedBlockedApps,
    setBlockedApps,
} from "../../2_services/handleOverlay.js";
import { fetchEntertainmentApps } from "../../Providers/AppModule.js";

import { Ionicons } from "@expo/vector-icons";

const BlockedApps = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApps, setSelectedApps] = useState([]);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const [installed, saved] = await Promise.all([
                    fetchEntertainmentApps(),
                    loadSavedBlockedApps(),
                ]);
                if (cancelled) return;

                const list = (installed || [])
                    .filter((app) => app?.packageName)
                    .sort((a, b) =>
                        (a.appName || "").localeCompare(b.appName || "")
                    );
                setApps(list);

                // Pre-select previously saved apps that are still installed
                const installedPackages = new Set(list.map((app) => app.packageName));
                setSelectedApps(saved.filter((pkg) => installedPackages.has(pkg)));
            } catch (err) {
                console.warn("[BlockedApps] Failed to load apps", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const toggleApp = (packageName) => {
        setSelectedApps((current) => {
            if (current.includes(packageName)) {
                return current.filter((pkg) => pkg !== packageName);
            }

            return [...current, packageName];
        });
    };

    const handleContinue = async () => {
        if (selectedApps.length < 2) {
            return;
        }

        await setBlockedApps(selectedApps);

        // Put whatever should happen next here.
        // Example:
        // navigation.navigate("NextScreen");
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#080F1A"
            />

            <Text style={[styles.pageTitle, { marginTop: 20 }]}>
                Blocked Apps
            </Text>

            <View style={styles.card}>
                <View style={styles.header}>
                    <Pressable style={styles.headerButton}>
                        <Ionicons
                            name="arrow-back"
                            size={22}
                            color="#E5ECF7"
                        />
                    </Pressable>

                    <Text style={styles.headerTitle}>
                        Penalty Rules
                    </Text>

                    <Pressable style={styles.headerButton}>
                        <Ionicons
                            name="close"
                            size={20}
                            color="#8D9BB0"
                        />
                    </Pressable>
                </View>

                <View style={styles.content}>
                    <Text style={styles.description}>
                        Select at least 2 apps to block
                    </Text>

                    {loading && (
                        <ActivityIndicator
                            color="#68A9FF"
                            style={styles.status}
                        />
                    )}

                    {!loading && apps.length === 0 && (
                        <Text style={[styles.description, styles.status]}>
                            No entertainment apps found
                        </Text>
                    )}

                    <ScrollView style={styles.list}>
                        {apps.map((app) => {
                            const isSelected = selectedApps.includes(
                                app.packageName
                            );

                            return (
                                <Pressable
                                    key={app.packageName}
                                    onPress={() =>
                                        toggleApp(app.packageName)
                                    }
                                    style={[
                                        styles.rule,
                                        isSelected && styles.ruleSelected,
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.iconBox,
                                            isSelected &&
                                            styles.iconBoxSelected,
                                        ]}
                                    >
                                        {app.icon ? (
                                            <Image
                                                source={{ uri: app.icon }}
                                                style={styles.appIcon}
                                                resizeMode="contain"
                                            />
                                        ) : (
                                            <Ionicons
                                                name="apps"
                                                size={20}
                                                color="#8D9BB0"
                                            />
                                        )}
                                    </View>

                                    <Text
                                        style={styles.ruleName}
                                        numberOfLines={1}
                                    >
                                        {app.appName}
                                    </Text>

                                    <View
                                        style={[
                                            styles.checkbox,
                                            isSelected &&
                                            styles.checkboxSelected,
                                        ]}
                                    >
                                        {isSelected && (
                                            <Ionicons
                                                name="checkmark"
                                                size={16}
                                                color="#FFFFFF"
                                            />
                                        )}
                                    </View>
                                </Pressable>
                            );
                        })}
                    </ScrollView>

                    <Pressable
                        onPress={handleContinue}
                        disabled={selectedApps.length < 2}
                        style={[
                            styles.continueButton,
                            selectedApps.length < 2 &&
                            styles.continueButtonDisabled,
                        ]}
                    >
                        <Text
                            style={[
                                styles.continueText,
                                selectedApps.length < 2 &&
                                styles.continueTextDisabled,
                            ]}
                        >
                            Continue
                        </Text>

                        <Ionicons
                            name="arrow-forward"
                            size={18}
                            color={
                                selectedApps.length >= 2
                                    ? "#68A9FF"
                                    : "#52647C"
                            }
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default BlockedApps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#080F1A",
        paddingHorizontal: 14,
        paddingTop: 10,
    },

    pageTitle: {
        textAlign: "center",
        color: "#83B5FF",
        fontSize: 20,
        fontWeight: "600",
        letterSpacing: 0.5,
        marginBottom: 12,
    },

    card: {
        borderWidth: 1,
        borderColor: "#1C3150",
        borderRadius: 22,
        backgroundColor: "#0D182A",
        overflow: "hidden",
        paddingBottom: 12,
    },

    header: {
        height: 54,
        borderBottomWidth: 1,
        borderBottomColor: "#172941",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
    },

    headerButton: {
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        color: "#E7EDF7",
        fontSize: 16,
        fontWeight: "600",
    },

    content: {
        paddingHorizontal: 12,
        paddingTop: 12,
    },

    list: {
        maxHeight: 420,
    },

    status: {
        marginVertical: 16,
        textAlign: "center",
    },

    description: {
        color: "#8EA1BB",
        fontSize: 13,
        marginBottom: 12,
        marginLeft: 2,
    },

    rule: {
        minHeight: 62,
        borderWidth: 1,
        borderColor: "#1A3152",
        backgroundColor: "#101D31",
        borderRadius: 11,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        marginBottom: 8,
    },

    ruleSelected: {
        borderColor: "#3D87D9",
        backgroundColor: "#142742",
    },

    iconBox: {
        width: 38,
        height: 38,
        borderRadius: 8,
        backgroundColor: "#172641",
        borderWidth: 1,
        borderColor: "#263D60",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    iconBoxSelected: {
        borderColor: "#3D87D9",
    },

    appIcon: {
        width: 28,
        height: 28,
    },

    ruleName: {
        flex: 1,
        color: "#DCE5F2",
        fontSize: 13,
        marginRight: 8,
    },

    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#345071",
        alignItems: "center",
        justifyContent: "center",
    },

    checkboxSelected: {
        backgroundColor: "#347FDB",
        borderColor: "#5A9DF5",
    },

    continueButton: {
        height: 46,
        borderWidth: 1,
        borderColor: "#315D91",
        backgroundColor: "#142944",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 8,
    },

    continueButtonDisabled: {
        backgroundColor: "#0F1A2A",
        borderColor: "#1C2B3F",
    },

    continueText: {
        color: "#68A9FF",
        fontSize: 13,
        fontWeight: "600",
        marginRight: 6,
    },

    continueTextDisabled: {
        color: "#52647C",
    },
});