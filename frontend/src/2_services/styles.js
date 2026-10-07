import { StyleSheet, Text } from "react-native"

export const COLORS = {
  background: "#040E29",
  cardBackground: "#092356",
  accent: "#9FDAEF",
  primary: "#5BA4DE",
  textLight: "#FFFFFF",
  textMuted: "#4F7097",
  textTitle: "#62D5F8",
  warning: "#FF4C4C",
  success: "#4CFF88",
  lightGray: "#CCCCCC",
  mediumGray: "#aaa",
  darkText: "#000",
  hunter: "#1468D7",
  gold: "#FFD166",
  inventory: "#2E4C74",
}

const BORDER = {
  borderColor: COLORS.accent,
  borderWidth: 1,
}

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: COLORS.background,
  },

  innerContainer: {
    backgroundColor: "#092356",
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    borderColor: '#12417E',
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 20,
    justifyContent: 'center'
  }
})

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: COLORS.background,
  },
  edgeGlowContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  edgeGlowTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 36,
  },
  edgeGlowBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
  },
  edgeGlowLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 36,
  },
  edgeGlowRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 36,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
    color: COLORS.accent,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    paddingLeft: 90,
    marginBottom: 12,
    backgroundColor: "#26282B",
    color: COLORS.accent,
  },
  dropdownContainer: {
    marginBottom: 12,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: "#26282B",
    borderRadius: 6,
  },
  dropdownText: {
    color: COLORS.accent,
    paddingLeft: 80,
  },
  dropdownPlaceholder: {
    color: COLORS.accent,
    paddingLeft: 80,
    paddingVertical: 12,
  },
  dropdownList: {
    backgroundColor: "#26282B",
    borderColor: COLORS.accent,
    borderWidth: 1,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
    width: "70%",
    alignSelf: "center",
  },
  pressableButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    margin: 15,
    width: "50%",
    padding: 5,
  },
  pressableButtonToggle: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    margin: 15,
    width: "50%",
    padding: 5,
  },
  pressableText: {
    fontSize: 18,
    color: COLORS.accent,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkText,
  },
  glowLabel: {
    color: COLORS.textLight,
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
    textAlign: "center",

    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  card: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#031936',
    borderWidth: 1,
    borderColor: '#152D53',
    borderStyle: 'solid'
  },
  mainQuestCard: {
    backgroundColor: COLORS.cardBackground,
    ...BORDER,
    borderTopWidth: 1,
    borderRadius: 2,
    minHeight: 150,
    padding: 12,
  },
  mainQuestHeader: {
    minHeight: 24,
    borderRadius: 2,
    marginBottom: 8,
    justifyContent: "center",
  },
  mainQuestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainQuestText: {
    color: COLORS.accent,
    fontSize: 14,
  },
  mainQuestTitle: {
    color: "#FFD166",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 5,
    textShadowColor: "rgba(255, 209, 102, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  sideQuestTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    color: COLORS.accent,
    textShadowColor: "rgba(159, 218, 239, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cardPressable: {
    width: 72,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  cardPressableShape: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  cardPressableText: {
    color: COLORS.darkText,
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    ...BORDER,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  filterRowImage: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  filterColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
    maxWidth: "60%",
  },
  filterPressable: {
    width: 160,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  filterPressableShape: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  filterPressableText: {
    color: COLORS.darkText,
    fontWeight: "600",
  },
  questTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textTitle,
    marginBottom: 4,
  },
  unit: {
    fontSize: 14,
    color: "#ccc",
  },
  progress: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.accent,
    paddingLeft: 10,
  },
  empty: {
    color: COLORS.mediumGray,
    fontSize: 16,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: COLORS.accent,
  },
  deadLine: {
    color: COLORS.textMuted,
    marginTop: 6,
    fontSize: 14,
  },
  progressBarTrackWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  progressBarTrack: {
    width: "100%",
    height: 12,
    backgroundColor: "#101B32",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 10,
  },
})
export const QuestDetails = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    ...BORDER,
    borderRadius: 14,
    width: "100%",
    height: "100%",
    padding: 0,
  },
  detailsContent: {
    width: "100%",
    backgroundColor: COLORS.cardBackground,
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    borderRadius: 14,
  },
  questUnits: {
    marginBottom: 20,
    padding: 2,
    justifyContent: "center",
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
    color: COLORS.textLight,
  },

  sectionLabelRight: {
    fontSize: 14,
    paddingRight: 1,
    color: COLORS.textLight,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textTitle,
    marginBottom: 50,
    alignSelf: "center",
  },
  detailsQuestTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textLight,
    marginBottom: 50,
    alignSelf: "center",
    marginTop: 50,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  arrowColumn: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    marginTop: "auto",
    marginBottom: 60,
  },
  header: {
    minHeight: 100,
    justifyContent: "center",
  },
})

export const text = StyleSheet.create({
  normal: {
    color: COLORS.textLight,
    fontSize: 16,
    textAlign: "center",
  },

  dummyText: {
    color: COLORS.textMuted,
  },

  small: {
    color: COLORS.lightGray,
    fontSize: 13,
  },

  warning: {
    color: COLORS.warning,
    fontWeight: "bold",
  },

  success: {
    color: COLORS.success,
    fontWeight: "600",
  },

  level: {
    color: COLORS.hunter,
    fontWeight: "600",
    textShadowColor: "rgba(20, 104, 215, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  name: {
    color: COLORS.accent,
    fontWeight: "600",
    textShadowColor: "rgba(159, 218, 239, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  gold: {
    color: COLORS.gold,
  },
})

export const home = StyleSheet.create({
  questListContainer: {
    flex: 0.5,
    backgroundColor: COLORS.cardBackground,
    ...BORDER,
    borderTopWidth: 0,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderRadius: 1,
  },
  footer: {
    backgroundColor: COLORS.cardBackground,
    ...BORDER,
    borderColor: '#12417E',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row'
  },
  mainQuestContainer: {
    backgroundColor: COLORS.cardBackground,
    ...BORDER,
    borderTopWidth: 1,
    borderBottomWidth: 0,
    padding: 20,
    justifyContent: "flex-start",
  },
  profileContainer: {
    backgroundColor: COLORS.cardBackground,
    ...BORDER,
    borderBottomWidth: 0,
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  hunterLabel: {
    backgroundColor: "#26282B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    gap: 20,
    borderRadius: 50,
  },
  NavPressable: {
    alignItems: "center",
    justifyContent: "center",
  }
})

export default function Warning({ text }) {
  return <Text style={{ color: "red", fontWeight: "bold" }}>{text}</Text>
}

export const errStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 9999,
  },
  card: {
    width: "82%",
    minHeight: 140,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "rgba(9, 35, 86, 0.95)",
    borderWidth: 1,
    borderColor: "#FF4C4C",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  text: {
    color: "#FF4C4C",
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
  },
})

export const questInfoStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  levelBox: {
    width: 45,
    height: 44,
    backgroundColor: "#0C2C5F",
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  levelCircle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  levelText: {
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: "700",
  },
  labelBox: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.accent,
    width: "50%",
    textAlign: "center",
  },
  labelText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    textShadowColor: "rgba(98, 213, 248, 0.9)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    textAlign: "center",
    maxHeight: 1,
  },
})

export const rewardStyles = StyleSheet.create({

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "#020817",

    alignItems: "center",
    justifyContent: "center",

    zIndex: 999,

    paddingHorizontal: 24,
  },

  title: {
    position: "absolute",
    top: 90,

    color: "#FFFFFF",

    fontSize: 28,
    fontWeight: "800",

    letterSpacing: 3,

    textAlign: "center",

    textTransform: "uppercase",
  },

  fadingBox: {
    width: "100%",
    maxWidth: 420,
    height: '60%',

    backgroundColor: "#081426",

    borderWidth: 1,
    borderColor: "#38E6A3",

    borderRadius: 4,

    overflow: "hidden",

    shadowColor: "#38E6A3",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.45,
    shadowRadius: 18,

    elevation: 12,
    borderRadius: 24,
    paddingBottom: 20
  },

  rewardLabel: {
    color: "#38E6A3",

    fontSize: 18,
    fontWeight: "700",

    letterSpacing: 4,

    textAlign: "center",

    marginBottom: 20,
  },

  text: {
    color: "white",

    fontSize: 32,
    fontWeight: "800",

    letterSpacing: 2,

    textAlign: "center",

    textShadowColor: "#38E6A3",
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 12,
  },

})

export const user = StyleSheet.create({
  inventoryContainer: {
    height: '80%',
    width: "80%",
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  inventoryFilterRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
    borderBottomWidth: 2,
    borderColor: COLORS.accent,
  },
  inventoryFilterPressable: {
    flex: 1,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  inventoryFilterShape: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  inventoryFilterText: {
    color: COLORS.darkText,
    fontWeight: "600",
    fontSize: 12,
  },
  gridList: {
    flex: 1,
    width: "100%",
  },
  gridContent: {
    paddingBottom: 24,
    flexGrow: 0.5,
  },
  gridColumn: {
    justifyContent: "space-between",
    marginBottom: 14,
  },
  gridItemWrapper: {
    flex: 1,
    maxWidth: "48%",
  },
  box: {
    width: "100%",
    backgroundColor: COLORS.cardBackground,
    minHeight: 170,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  meta: {
    width: "100%",
    alignItems: "center",
    gap: 4,
  },
  itemName: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  itemQuantity: {
    color: COLORS.textTitle,
    fontSize: 13,
    fontWeight: "700",
  },
  itemImage: {
    width: "70%",
    height: "40%",
    marginVertical: 16,
    borderRadius: 30,
  },
  container: {
    backgroundColor: COLORS.cardBackground,
    ...BORDER,
    borderTopWidth: 1,
    borderRadius: 10,
    height: "80%",
    padding: 20,
    alignItems: "center",
  },
  header: {
    marginTop: 12,
    marginBottom: 24,
  },
  pressableButton: {
    backgroundColor: COLORS.success,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    margin: 15,
    width: "50%",
    padding: 5,
  },
})
