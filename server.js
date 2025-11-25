const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); 




app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.post("/car-enter", async (req, res) => {
    const { car_number } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO parking (car_number, car_enter_time) VALUES ($1, NOW()) RETURNING *",
            [car_number]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


app.post("/car-leave", async (req, res) => {
    const { log_id, amount } = req.body;
    try {
        const updateLog = await pool.query(
            "UPDATE parking SET car_leave_time = NOW() WHERE log_id = $1 RETURNING *",
            [log_id]
        );
        const insertPayment = await pool.query(
            "INSERT INTO payment (log_id, amount, paid_time) VALUES ($1, $2, NOW()) RETURNING *",
            [log_id, amount]
        );
        res.json({ parking: updateLog.rows[0], payment: insertPayment.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


app.get("/parking-list", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM parking ORDER BY car_enter_time DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

