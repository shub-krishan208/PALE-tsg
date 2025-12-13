require('dotenv').config()
const express = require('express')
const pool = require('../db')
const crypto = require('crypto')

const router = express.Router()




// ================== CONFIG ==================
const algorithm = 'aes-256-cbc'
const secretKey = Buffer.from(process.env.ENCRYPT_KEY, 'hex')
const ROLL_REGEX = /^\d{2}[A-Z]{2}[A-Z0-9]{5}$/i

// ================== CRYPTO ==================
function encrypt(text) {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv)

    let encrypted = cipher.update(text, 'utf8', 'base64')
    encrypted += cipher.final('base64')

    return `${iv.toString('base64')}:${encrypted}`
}

function decrypt(text) {
    const [ivPart, encryptedPart] = text.split(':')
    if (!ivPart || !encryptedPart) throw new Error('Invalid encrypted format')

    const iv = Buffer.from(ivPart, 'base64')
    const encryptedText = Buffer.from(encryptedPart, 'base64')

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv)

    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString('utf8')
}

const payload = {
  roll: "23CS30012",
  type: "entry",
  laptop: true,
  books: ["DSA"]
}

const encrypted = encrypt(JSON.stringify(payload))
console.log(encrypted);

// ================== HELPERS ==================
function msToInterval(ms) {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${hours} hours ${minutes} minutes ${seconds} seconds`
}

// ================== QR ENDPOINT ==================
router.post('/', async (req, res) => {
    const { data } = req.body
    if (!data) {
        return res.status(400).json({ error: 'Encrypted QR data missing' })
    }

    let payload
    try {
        const decrypted = decrypt(data)
        payload = await JSON.parse(decrypted)
    } catch {
        return res.status(400).json({ error: 'Invalid or tampered QR data' })
    }

    const { roll, type, laptop, books } = payload

    if (!roll || !type) {
        return res.status(400).json({ error: 'Invalid payload structure' })
    }

    if (!ROLL_REGEX.test(roll)) {
        return res.status(400).json({ error: 'Invalid roll number format' })
    }

    try {
        // ---------- ENTRY ----------
        if (type === 'entry') {
            const lastEntry = await pool.query(
                `SELECT * FROM logs WHERE roll=$1 AND event_type='entry'
                 ORDER BY event_time DESC LIMIT 1`,
                [roll]
            )

            const lastExit = await pool.query(
                `SELECT * FROM logs WHERE roll=$1 AND event_type='exit'
                 ORDER BY event_time DESC LIMIT 1`,
                [roll]
            )

            const alreadyInside =
                lastEntry.rows.length > 0 &&
                (lastExit.rows.length === 0 ||
                 new Date(lastExit.rows[0].event_time) <
                 new Date(lastEntry.rows[0].event_time))

            if (alreadyInside) {
                return res.status(400).json({ error: 'Student already inside' })
            }

            await pool.query(
                `INSERT INTO logs (roll, event_type, laptop, books)
                 VALUES ($1,'entry',$2,$3)`,
                [
                    roll,
                    laptop ?? null,
                    Array.isArray(books) ? books : null
                ]
            )

            return res.json({ message: 'Entry recorded' })
        }

        // ---------- EXIT ----------
        if (type === 'exit') {
            const entryRes = await pool.query(
                `SELECT * FROM logs WHERE roll=$1 AND event_type='entry'
                 ORDER BY event_time DESC LIMIT 1`,
                [roll]
            )

            if (entryRes.rows.length === 0) {
                return res.status(400).json({ error: 'No prior entry found' })
            }

            const entryLog = entryRes.rows[0]
            const entryTime = new Date(entryLog.event_time)

            const exitRes = await pool.query(
                `SELECT * FROM logs WHERE roll=$1 AND event_type='exit'
                 ORDER BY event_time DESC LIMIT 1`,
                [roll]
            )

            if (
                exitRes.rows.length > 0 &&
                new Date(exitRes.rows[0].event_time) > entryTime
            ) {
                return res.status(400).json({ error: 'Already exited' })
            }

            const durationMs = Date.now() - entryTime
            const durationInterval = msToInterval(durationMs)

            await pool.query(
                `INSERT INTO logs (roll, event_type, stay_duration, laptop, books)
                 VALUES ($1,'exit',$2::interval,$3,$4)`,
                [
                    roll,
                    durationInterval,
                    entryLog.laptop,
                    entryLog.books
                ]
            )

            return res.json({
                message: 'Exit recorded',
                duration: durationInterval
            })
        }

        return res.status(400).json({ error: 'Invalid type value' })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router
