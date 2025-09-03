const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/db/ping", async (_req, res) => {
  try {
    const db = require("./db");
    const r = await db.query("SELECT NOW() as now");
    res.json({ db: "ok", now: r.rows[0].now });
  } catch (e) {
    res.status(500).json({ db: "error", error: String(e) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API en http://localhost:${port}`));
