const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const Joi = require("joi");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

// Rate limiting configuration
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Too many requests from this IP, please try again later.",
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(limiter);

// MySQL connection
const db = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
});

db.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL:", err);
		return;
	}
	console.log("Connected to MySQL database");
});

const schema = Joi.object({
	description: Joi.string().min(1).max(255).required(),
	timer: Joi.number().integer().positive().required(),
	link: Joi.string().uri().required(),
	isVisible: Joi.boolean().required(),
});

// Helper function to check if the table is empty
const isTableEmpty = () => {
	return new Promise((resolve, reject) => {
		const checkSql = "SELECT COUNT(*) AS count FROM " + process.env.DATABASE;
		db.query(checkSql, (err, result) => {
			if (err) {
				return reject("Error checking table: " + err);
			}
			resolve(result[0].count === 0);
		});
	});
};

// Helper function to insert a new banner
const insertBanner = (description, timer, link, isVisible) => {
	return new Promise((resolve, reject) => {
		const insertSql =
			"INSERT INTO " +
			process.env.DATABASE +
			" (description, timer, link, isVisible) VALUES (?, ?, ?, ?)";
		db.query(
			insertSql,
			[description, timer, link, isVisible],
			(err, result) => {
				if (err) {
					return reject("Error inserting data: " + err);
				}
				resolve(result.insertId);
			}
		);
	});
};

// Helper function to update the existing banner
const updateBanner = (description, timer, link, isVisible) => {
	return new Promise((resolve, reject) => {
		const updateSql =
			"UPDATE " +
			process.env.DATABASE +
			" SET description = ?, timer = ?, link = ?, isVisible = ? LIMIT 1";
		db.query(
			updateSql,
			[description, timer, link, isVisible],
			(err, result) => {
				if (err) {
					return reject("Error updating data: " + err);
				}
				resolve();
			}
		);
	});
};

// POST: Create a new banner or update the existing one
app.post("/api/banners", async (req, res) => {
	try {
		const { error } = schema.validate(req.body);
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}

		const { description, timer, link, isVisible } = req.body;

		const empty = await isTableEmpty();

		if (empty) {
			// Insert a new banner
			const insertId = await insertBanner(description, timer, link, isVisible);
			res.status(201).json({ id: insertId });
		} else {
			// Update the existing banner
			await updateBanner(description, timer, link, isVisible);
			res.status(200).json({ message: "Banner updated successfully" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Database error" });
	}
});

// GET: Retrieve the latest banner
app.get("/api/banners", (req, res) => {
	const sql =
		"SELECT * FROM " + process.env.DATABASE + " ORDER BY id DESC LIMIT 1";
	db.query(sql, (err, results) => {
		if (err) {
			console.error("Error retrieving data:", err);
			return res.status(500).json({ error: "Database error" });
		}
		res.json(results[0]);
	});
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
