
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const quizRoutes = require("./quizRoutes");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Only Quiz API
app.use("/api/quizzes", quizRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    const [rows] = await require('./db').query('SELECT 1');
    res.json({ ok: true, db: true });
  } catch (e) {
    res.status(500).json({ ok: false, db: false, error: e.code || e.message });
  }
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
// after app.use('/api/quizzes', quizRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.code || err.message || 'Internal Server Error' });
});
