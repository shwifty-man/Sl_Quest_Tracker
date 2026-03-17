// auth.service.js
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import pool from "../../DB/0_config/db.js"

async function hashPassword(plainPassword) {
  // hash the password using bcrypt and return the hash
  try {
    if (!plainPassword || typeof plainPassword !== "string") {
      throw new Error("Password must be a non-empty string")
    }
    const saltRounds = 10
    const hash = await bcrypt.hash(plainPassword, saltRounds)
    return hash
  } catch (err) {
    throw new Error(err.message)
  }
}

export async function comparePassword(plainPassword, passwordHash) {
  // compare a plain password with a stored hash and return boolean
  try {
    if (
      plainPassword === null ||
      plainPassword === "" ||
      plainPassword === undefined
    ) {
      throw new Error("Password must not be empty")
    }
    const result = await bcrypt.compare(plainPassword, passwordHash)
    if (result) {
      return true
    } else {
      return false
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

export function generateJWT(user) {
  // create and return a signed JWT (7d expiry)
  try {
    if (!user.id || !user.email) {
      throw new Error("Missing required fields")
    }

    const payload = {
      id: user.id,
      email: user.email,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })
    return token
  } catch (err) {
    throw new Error(err.message)
  }
}

export function verifyJWT(token) {
  // verify token signature and return decoded payload or throw on invalid
  try {
    if (!token) {
      throw new Error("No token")
    }
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
    return verifiedToken
  } catch (err) {
    console.warn("verifyJWT failed")
    throw new Error("Invalid or expired token")
  }
}

export async function createUser(email, password) {
  // insert a new user in the DB and return the created user record
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const passwordHash = await hashPassword(password)
    const sql = `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email;`
    const result = await client.query(sql, [email, passwordHash])
    const user = result.rows[0]
    await client.query(`INSERT INTO progress (user_id, level, exp, coins) VALUES ($1, 1, 0, 0)`,[user.id]);
    await client.query(`INSERT INTO user_stats (user_id, discipline, focus, endurance, strength, recovery) VALUES ($1, 1, 1, 1, 1, 1);`, [user.id])

    const defaultBadgeResult = await client.query(`SELECT id FROM badges ORDER BY id LIMIT 1;`)
    if (defaultBadgeResult.rows.length > 0) {
      const defaultBadgeId = defaultBadgeResult.rows[0].id
      await client.query(`INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2)`, [user.id, defaultBadgeId])
    } else {
      await client.query(`INSERT INTO user_badges (user_id, badge_id) VALUES ($1, NULL)`, [user.id])
    }

    await client.query("COMMIT");
    console.info(`User registered: userId=${user.id}`)

    return user
  } catch (err) {
    await client.query("ROLLBACK");
      if (err.code === '23505') {
    throw new Error('Email already exists');
  }
    throw err
  }
}

export async function findUserByEmail(email) {
  // query DB for a user by email and return user record or null
  try {
    const sql = `SELECT * FROM users WHERE email = $1;`
    const result = await pool.query(sql, [email])
    return result.rows[0]
  } catch (err) {
    throw new Error(err.message)
  }
}

export async function findUserById(id) {
  // query DB for a user by id and return user record or null
  try {
    const sql = `SELECT * FROM users WHERE id = $1;`
    const result = await pool.query(sql, [id])
    return result.rows[0]
  } catch (err) {
    throw new Error(err.message)
  }
}
``
export async function loginUser(email, password) {
  // validate credentials, return user info + token if valid, else throw
  try {
    const user = await findUserByEmail(email)
    const verifiedPassword = await comparePassword(password, user.password_hash)

    if (verifiedPassword === false) {
      throw new Error("Password invalid")
    }

    const token = generateJWT(user)

    return {
      token: token,
      user: {
        id: user.id,
        email: user.email,
      },
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

export async function registerUser(email, password) {
  // orchestrate registration: check duplicate, hash pw, create user, return token + user
  try {
    const user = await createUser(email, password)

    const token = generateJWT(user)

    return {
      token: token,
      user: {
        id: user.id,
        email: user.email,
      },
    }
  } catch (err) {
    throw new Error(err.message)
  }
}
