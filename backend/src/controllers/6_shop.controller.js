import { buyItem, getShopItems } from "../services/6_shop.service.js"

export async function getShopItemsController(req, res) {
  try {
    const store = await getShopItems()
    res.status(200).json(store)
  } catch (err) {
    console.error("getShopItemsController error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}

// export async function getShopItemController(req, res) {
//   try {
//     res.status(501).json({ error: "Not implemented" })
//   } catch (err) {
//     console.error("getShopItemController error:", err)
//     res.status(500).json({ error: err.message || "Internal Server Error" })
//   }
// }

export async function buyItemController(req, res) {
  try {
    const userId = req.user.id
    const { itemId } = req.body

    if (!itemId) {
      return res.status(400).json({ error: "itemId is required" })
    }

    const newItem = await buyItem(itemId, userId)
    res.status(200).json(newItem)
  } catch (err) {
    console.error("buyItemController error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}