import { StyleSheet } from "react-native";

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
})
