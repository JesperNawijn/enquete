const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const bcrypt = require("bcrypt")
const session = require("express-session")
const nodemailer = require("nodemailer")
const path = require("path")
const fs = require("fs")
const { Parser } = require("json2csv")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
)

// Set EJS as templating engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Database setup
const db = new sqlite3.Database("survey.db")

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        age INTEGER,
        gender TEXT,
        country TEXT,
        country_other TEXT,
        weight_problems TEXT,
        self_image TEXT,
        body_satisfaction INTEGER,
        weight_influence TEXT,
        social_media_hours INTEGER,
        platforms TEXT,
        content_types TEXT,
        comparison_frequency TEXT,
        influence_eating TEXT,
        influence_exercise TEXT,
        influence_screen_time TEXT,
        influence_social TEXT,
        solutions TEXT,
        education_importance INTEGER,
        platform_responsibility INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`)

  db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`)

  // Create default admin user (username: admin, password: admin123)
  const hashedPassword = bcrypt.hashSync("admin123", 10)
  db.run(`INSERT OR IGNORE INTO admin_users (username, password) VALUES (?, ?)`, ["admin", hashedPassword])
})

// Email transporter setup (disabled for now)
let transporter = null
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
  console.log("Email notifications enabled")
} else {
  console.log("Email notifications disabled - no email configuration found")
}

// Helper function to send email notifications
async function sendNotificationEmail(responseData) {
  if (!transporter || !process.env.NOTIFICATION_EMAIL) {
    console.log("Email notification skipped - email not configured")
    return
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: "Nieuwe enquête inzending - Sociale Media & Zelfbeeld",
      html: `
                <h2>Nieuwe enquête inzending ontvangen</h2>
                <p><strong>Leeftijd:</strong> ${responseData.age}</p>
                <p><strong>Geslacht:</strong> ${responseData.gender}</p>
                <p><strong>Land:</strong> ${responseData.country}</p>
                <p><strong>Tijdstip:</strong> ${new Date().toLocaleString("nl-NL")}</p>
                <p>Bekijk alle antwoorden in het admin dashboard.</p>
            `,
    })
    console.log("Email notification sent successfully")
  } catch (error) {
    console.error("Email notification failed:", error.message)
  }
}

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.adminId) {
    next()
  } else {
    res.redirect("/admin/login")
  }
}

// Routes

// Home page with survey form
app.get("/", (req, res) => {
  res.render("survey", {
    title: "Enquête: Sociale Media & Zelfbeeld",
    error: null,
  })
})

// Submit survey response
app.post("/submit", async (req, res) => {
  try {
    const {
      age,
      gender,
      country,
      country_other,
      weight_problems,
      self_image,
      body_satisfaction,
      weight_influence,
      social_media_hours,
      platforms,
      content_types,
      comparison_frequency,
      influence_eating,
      influence_exercise,
      influence_screen_time,
      influence_social,
      solutions,
      education_importance,
      platform_responsibility,
    } = req.body

    // Uitgebreide validatie - alle velden zijn verplicht
    const requiredFields = {
      age: "Leeftijd",
      gender: "Geslacht",
      country: "Land",
      weight_problems: "Zorgen over gewicht",
      self_image: "Zelfbeeld",
      body_satisfaction: "Tevredenheid lichaam",
      weight_influence: "Invloed gewicht op gevoel",
      social_media_hours: "Sociale media uren",
      comparison_frequency: "Vergelijking frequentie",
      influence_eating: "Invloed op eetgedrag",
      influence_exercise: "Invloed op beweeggedrag",
      influence_screen_time: "Invloed op schermtijd",
      influence_social: "Invloed op sociaal gedrag",
      education_importance: "Belang voorlichting",
      platform_responsibility: "Platform verantwoordelijkheid",
    }

    // Check required fields
    const missingFields = []
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field] || req.body[field] === "") {
        missingFields.push(label)
      }
    }

    // Check required checkbox groups
    const platformsArray = Array.isArray(platforms) ? platforms : platforms ? [platforms] : []
    const contentTypesArray = Array.isArray(content_types) ? content_types : content_types ? [content_types] : []
    const solutionsArray = Array.isArray(solutions) ? solutions : solutions ? [solutions] : []

    if (platformsArray.length === 0) {
      missingFields.push("Sociale media platforms (minimaal één)")
    }
    if (contentTypesArray.length === 0) {
      missingFields.push("Content types (minimaal één)")
    }
    if (solutionsArray.length === 0) {
      missingFields.push("Oplossingen/maatregelen (minimaal één)")
    }

    // Special validation for country_other
    if (country === "Anders" && (!country_other || country_other.trim() === "")) {
      missingFields.push('Land specificatie (bij "Anders")')
    }

    if (missingFields.length > 0) {
      return res.render("survey", {
        title: "Enquête: Sociale Media & Zelfbeeld",
        error: `De volgende velden zijn verplicht: ${missingFields.join(", ")}`,
      })
    }

    const platformsStr = Array.isArray(platforms) ? platforms.join(",") : platforms || ""
    const contentTypesStr = Array.isArray(content_types) ? content_types.join(",") : content_types || ""
    const solutionsStr = Array.isArray(solutions) ? solutions.join(",") : solutions || ""

    db.run(
      `INSERT INTO responses (
            age, gender, country, country_other, weight_problems, self_image,
            body_satisfaction, weight_influence, social_media_hours, platforms,
            content_types, comparison_frequency, influence_eating, influence_exercise,
            influence_screen_time, influence_social, solutions, education_importance,
            platform_responsibility
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        age,
        gender,
        country,
        country_other,
        weight_problems,
        self_image,
        body_satisfaction,
        weight_influence,
        social_media_hours,
        platformsStr,
        contentTypesStr,
        comparison_frequency,
        influence_eating,
        influence_exercise,
        influence_screen_time,
        influence_social,
        solutionsStr,
        education_importance,
        platform_responsibility,
      ],
      (err) => {
        if (err) {
          console.error(err)
          return res.render("survey", {
            title: "Enquête: Sociale Media & Zelfbeeld",
            error: "Er is een fout opgetreden. Probeer opnieuw.",
          })
        }

        // Send email notification
        sendNotificationEmail(req.body)

        res.render("thank-you", { title: "Bedankt voor je deelname!" })
      },
    )
  } catch (error) {
    console.error(error)
    res.render("survey", {
      title: "Enquête: Sociale Media & Zelfbeeld",
      error: "Er is een fout opgetreden. Probeer opnieuw.",
    })
  }
})

// Admin login page
app.get("/admin/login", (req, res) => {
  res.render("admin/login", {
    title: "Admin Login",
    error: null,
  })
})

// Admin login process
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body

  db.get("SELECT * FROM admin_users WHERE username = ?", [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.render("admin/login", {
        title: "Admin Login",
        error: "Ongeldige inloggegevens",
      })
    }

    req.session.adminId = user.id
    res.redirect("/admin/dashboard")
  })
})

// Admin logout
app.get("/admin/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/admin/login")
})

// Admin dashboard
app.get("/admin/dashboard", requireAuth, (req, res) => {
  const page = Number.parseInt(req.query.page) || 1
  const limit = 20
  const offset = (page - 1) * limit

  const ageFilter = req.query.age
  const genderFilter = req.query.gender
  const countryFilter = req.query.country
  const sortBy = req.query.sort || "created_at"
  const sortOrder = req.query.order || "DESC"

  let whereClause = ""
  const params = []

  if (ageFilter) {
    whereClause += " WHERE age = ?"
    params.push(ageFilter)
  }
  if (genderFilter) {
    whereClause += whereClause ? " AND gender = ?" : " WHERE gender = ?"
    params.push(genderFilter)
  }
  if (countryFilter) {
    whereClause += whereClause ? " AND country = ?" : " WHERE country = ?"
    params.push(countryFilter)
  }

  const query = `SELECT * FROM responses${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`
  const countQuery = `SELECT COUNT(*) as total FROM responses${whereClause}`

  db.get(countQuery, params, (err, countResult) => {
    if (err) {
      console.error(err)
      return res.status(500).send("Database error")
    }

    const totalResponses = countResult.total
    const totalPages = Math.ceil(totalResponses / limit)

    db.all(query, [...params, limit, offset], (err, responses) => {
      if (err) {
        console.error(err)
        return res.status(500).send("Database error")
      }

      res.render("admin/dashboard", {
        title: "Admin Dashboard",
        responses,
        currentPage: page,
        totalPages,
        totalResponses,
        filters: { age: ageFilter, gender: genderFilter, country: countryFilter },
        sort: { by: sortBy, order: sortOrder },
      })
    })
  })
})

// Admin statistics page
app.get("/admin/statistics", requireAuth, (req, res) => {
  const queries = {
    ageDistribution: "SELECT age, COUNT(*) as count FROM responses GROUP BY age ORDER BY age",
    genderDistribution: "SELECT gender, COUNT(*) as count FROM responses GROUP BY gender",
    countryDistribution: "SELECT country, COUNT(*) as count FROM responses GROUP BY country",
    platformUsage: `SELECT 
            SUM(CASE WHEN platforms LIKE '%Instagram%' THEN 1 ELSE 0 END) as Instagram,
            SUM(CASE WHEN platforms LIKE '%TikTok%' THEN 1 ELSE 0 END) as TikTok,
            SUM(CASE WHEN platforms LIKE '%Snapchat%' THEN 1 ELSE 0 END) as Snapchat,
            SUM(CASE WHEN platforms LIKE '%YouTube%' THEN 1 ELSE 0 END) as YouTube,
            SUM(CASE WHEN platforms LIKE '%Facebook%' THEN 1 ELSE 0 END) as Facebook,
            SUM(CASE WHEN platforms LIKE '%Twitter%' THEN 1 ELSE 0 END) as Twitter
            FROM responses`,
    socialMediaHours:
      "SELECT social_media_hours, COUNT(*) as count FROM responses WHERE social_media_hours IS NOT NULL GROUP BY social_media_hours ORDER BY social_media_hours",
  }

  const results = {}
  let completed = 0

  Object.keys(queries).forEach((key) => {
    db.all(queries[key], (err, rows) => {
      if (!err) results[key] = rows
      completed++

      if (completed === Object.keys(queries).length) {
        res.render("admin/statistics", {
          title: "Statistieken",
          stats: results,
        })
      }
    })
  })
})

// Export to CSV
app.get("/admin/export", requireAuth, (req, res) => {
  db.all("SELECT * FROM responses ORDER BY created_at DESC", (err, responses) => {
    if (err) {
      console.error(err)
      return res.status(500).send("Database error")
    }

    try {
      const fields = [
        "id",
        "age",
        "gender",
        "country",
        "country_other",
        "weight_problems",
        "self_image",
        "body_satisfaction",
        "weight_influence",
        "social_media_hours",
        "platforms",
        "content_types",
        "comparison_frequency",
        "influence_eating",
        "influence_exercise",
        "influence_screen_time",
        "influence_social",
        "solutions",
        "education_importance",
        "platform_responsibility",
        "created_at",
      ]

      const parser = new Parser({ fields })
      const csv = parser.parse(responses)

      res.setHeader("Content-Type", "text/csv")
      res.setHeader("Content-Disposition", 'attachment; filename="survey-responses.csv"')
      res.send(csv)
    } catch (error) {
      console.error(error)
      res.status(500).send("Export error")
    }
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log("Admin login: username=admin, password=admin123")
})
