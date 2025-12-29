// auth.service.js
import bcrypt from "bcrypt"
import pool from "../../DB/0_config/db.js"

async function hashPassword(plainPassword) {
  // hash the password using bcrypt and return the hash
  try {
    if (plainPassword === null || plainPassword === "" || plainPassword === undefined) {
      throw new Error("Password must not be empty")
    }
    const saltRounds = 10
    const hash = await bcrypt.hash(plainPassword, saltRounds)
    return hash
  } catch (err) {
    throw new Error("Error: " + err.message)
  }
}

export async function comparePassword(plainPassword, passwordHash) {
  // compare a plain password with a stored hash and return boolean
  try {
    if (plainPassword === null || plainPassword === "" || plainPassword === undefined) {
      throw new Error("Password must not be empty")
    }
    const result = await bcrypt.compare(plainPassword, passwordHash)
    if (result) {
      return true
    } else {
      return false
    }
  } catch (err) {
    throw new Error("Error: " + err.message)
  }
}

export function generateJWT(user) {
  // create and return a signed JWT (7d expiry)
  try {
    if (!user.email || !user.id) {
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
    throw new Error("Error: " + err.message)
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
    throw new Error("Invalid or expired token")
  }
}

export async function createUser({ email, password }) {
  // insert a new user in the DB and return the created user record
  try {
    const passwordHash = await hashPassword(password)
    const sql = `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id;`
    const result = await pool.query(sql, [email, passwordHash])
    return result.rows[0]
  } catch (err) {
    throw new Error("Error: " + err.message)
  }
}

export async function findUserByEmail(email) {
  // query DB for a user by email and return user record or null
    try {
      const sql = `SELECT * FROM users WHERE email = $1;`
      const result = await pool.query(sql, [email])
      return result.rows[0]
    } catch (err) {
      throw new Error("Error: " + err.message)
    }
}

export async function findUserById(id) {
  // query DB for a user by id and return user record or null
    try {
      const sql = `SELECT * FROM users WHERE id = $1;`
      const result = await pool.query(sql, [id])
      return result.rows[0]
    } catch (err) {
      throw new Error("Error: " + err.message)
    }
}

export async function loginUser({ email, password }) {
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
          email: user.email
        }
      }
    } catch (err) {
      throw new Error("Error: " + err.message)
    }
}

export async function registerUser({ email, password }) {
  // orchestrate registration: check duplicate, hash pw, create user, return token + user
    try {
      const user = await createUser({ email, password })

      const token = generateJWT(user)

      return {
        token: token,
        user: {
          id: user.id,
          email: user.email
        }
      }
    } catch (err) {
      throw new Error("Error: " + err.message)
    }
}
