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
})
