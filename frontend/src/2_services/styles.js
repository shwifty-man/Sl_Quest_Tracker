import { StyleSheet } from "react-native"
import { Text } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#040E29",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
    color: "#9FDAEF",
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    paddingLeft: 30,
    marginBottom: 12,
    backgroundColor: "#26282B",
    color: "#9FDAEF",
  },
  button: {
    backgroundColor: "#5BA4DE",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
    width: "70%",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  glowLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
    textAlign: "center",

    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  card: {
    backgroundColor: "#092356",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#62D5F8",
    marginBottom: 4,
  },
  unit: {
    fontSize: 14,
    color: "#ccc",
  },
  progress: {
    marginTop: 6,
    fontSize: 14,
    color: "#9FDAEF",
  },
  empty: {
    color: "#aaa",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deadLine: {
    color: "#4F7097",
    marginTop: 6,
    fontSize: 14,
  },
})

export const QuestDetails = StyleSheet.create({
  detailsContent: {
    width: "100%",
    backgroundColor: "#092356",
    flex: 1,
    justifyContent: "center",
    padding: 20,
    borderRadius: 14,
    marginBottom: 18,
  },
  questUnits: {
    marginBottom: 20,
    padding: 2
  },
  sectionLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionLabelLeft: {
    fontSize: 16,
    paddingRight: 14,
    color: "#ffffff",
  },

  sectionLabelRight: {
    fontSize: 14,
    paddingRight: 1,
    color: "#ffffff",
  },
  questTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#62D5F8",
    marginBottom: 50,
    alignSelf: "center",
  },
  progressContainer: {
    // NEW
    flexDirection: "row",
    alignItems: "center",
  },

  arrowColumn: {
    // NEW
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
})

export const text = StyleSheet.create({
  normal: {
    color: "#FFFFFF",
    fontSize: 16,
    width: "50%",
    alignSelf: "center",
  },

  dummyText: {
    color: "#4F7097",
  },

  small: {
    // NEW
    color: "#CCCCCC",
    fontSize: 13,
  },

  warning: {
    // NEW
    color: "#FF4C4C",
    fontWeight: "bold",
  },

  success: {
    // NEW
    color: "#4CFF88",
    fontWeight: "600",
  },
})


export default function Warning({text}) {
  return <Text style={{ color: "red", fontWeight: "bold" }}>{text}</Text>
}
