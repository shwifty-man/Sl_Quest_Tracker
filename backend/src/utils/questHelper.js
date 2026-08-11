import pool from "../../DB/0_config/db.js"

export function expToNextLevel(input) {
  let level = Number(input)
  return level * 100
}

export async function createDeadline() {
  try {
    const sql = `SELECT now() + interval '1 minute' AS deadline;`
    const results = await pool.query(sql)
    return results.rows[0].deadline
  } catch (err) {
    throw err
  }
}

//User / EXP Functions
export function computeExp(type, targetValue) {
  const ranges = [
    { max: 20, exp: 10 },
    { max: 50, exp: 25 },
    { max: 100, exp: 50 },
    { max: 200, exp: 100 },
    { max: Infinity, exp: 200 },
  ]

  let exp = 0
  for (let i = 0; i < ranges.length; i++) {
    if (targetValue <= ranges[i].max) {
      exp = ranges[i].exp
      break
    }
  }

  const coinRanges = [
    { max: 10, coins: 5 },
    { max: 15, coins: 10 },
    { max: 20, coins: 15 },
    { max: 30, coins: 20 },
    { max: 40, coins: 25 },
    { max: 50, coins: 40 },
    { max: 60, coins: 50 },
    { max: 100, coins: 60 },
    { max: Infinity, coins: 80 },
  ]

  let coins = 0
  for (let i = 0; i < coinRanges.length; i++) {
    if (targetValue <= coinRanges[i].max) {
      coins = coinRanges[i].coins
      break
    }
  }

  const rewardByType = {
    Workout: { strength: 2, endurance: 1 },
    Study: { focus: 2, discipline: 1 },
    Reading: { focus: 1, recovery: 1 },
    Meditation: { recovery: 2, discipline: 1 },
  }

  const tierMultipliers = [
    { max: 20, multiplier: 1 },
    { max: 50, multiplier: 2 },
    { max: 100, multiplier: 3 },
    { max: 200, multiplier: 4 },
    { max: Infinity, multiplier: 5 },
  ]

  let multiplier = 1
  for (let i = 0; i < tierMultipliers.length; i++) {
    if (targetValue <= tierMultipliers[i].max) {
      multiplier = tierMultipliers[i].multiplier
      break
    }
  }

  const baseRewards = rewardByType[type] || {}
  const statRewards = Object.fromEntries(
    Object.entries(baseRewards).map(([key, value]) => [key, value * multiplier])
  )

  return { exp, coins, stats: statRewards }
}