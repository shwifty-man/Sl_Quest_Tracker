import { StyleSheet } from "react-native"

export const statsStyles = StyleSheet.create({

  title: {
    color: "#6CAEFF",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 16,
  },

  headerText: {
    color: "#FFFFFF",
    fontSize: 17,
  },

  headerSpacer: {
    width: 26,
  },

  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(13, 28, 50, 0.5)",
    borderWidth: 1,
    borderColor: "#18385A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    width: '100%'
  },

  label: {
    color: "#B7C2D8",
    fontSize: 14,
  },

  streakRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 5,
  },

  streakNumber: {
    color: "#FFFFFF",
    fontSize: 34,
  },

  days: {
    color: "#73809A",
    fontSize: 13,
    marginLeft: 5,
  },

  statsCard: {
    backgroundColor: "rgba(13, 28, 50, 0.5)",
    borderWidth: 1,
    borderColor: "#18385A",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    width: '100%'
  },

  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 54,
  },

  statLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 17,
  },

  divider: {
    height: 1,
    backgroundColor: "#18324E",
  },

  weeklyCard: {
    backgroundColor: "#0D1C32",
    borderWidth: 1,
    borderColor: "#18385A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

})