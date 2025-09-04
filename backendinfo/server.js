const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
// In your server.js, update the CORS configuration:
app.use(cors({
  origin: [
    'https://aepredicxt.netlify.app', // Your production frontend
    'http://localhost:3000',           // Your local development
    'http://localhost:5000'            // Your local backend (if needed)
  ]
}));

// ---------------- Paths ----------------
const dataDir = path.join(__dirname, "../data");
const configPath = path.join(dataDir, "config.json");

// Each league has its own JSON file
const leagueFiles = {
  laliga: path.join(dataDir, "laliga.json"),
  bundesliga: path.join(dataDir, "bundesliga.json"),
  epl: path.join(dataDir, "epl.json"),
  seriea: path.join(dataDir, "seriea.json"),
  league1: path.join(dataDir, "league1.json"),
  others: path.join(dataDir, "others.json"),
};

// --------------- Ensure files exist ---------------
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(
    configPath,
    JSON.stringify(
      {
        admin: { username: "admin", password: "12345" },
      },
      null,
      2
    )
  );
}
for (const file of Object.values(leagueFiles)) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]");
}

// --------------- Helpers ---------------
const readJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const writeJSON = (filePath, data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
const getConfig = () => readJSON(configPath);

// --------------- Auth ---------------
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const { admin } = getConfig();

  if (username === admin.username && password === admin.password) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// --------------- Public read (GET) ---------------
app.get("/:league", (req, res) => {
  const league = req.params.league;
  const file = leagueFiles[league];
  if (!file)
    return res.status(404).json({ success: false, message: "League not found" });

  return res.json(readJSON(file));
});

// --------------- Public create (POST) ---------------
app.post("/:league", (req, res) => {
  const league = req.params.league;
  const file = leagueFiles[league];
  if (!file)
    return res.status(404).json({ success: false, message: "League not found" });

  const matches = readJSON(file);
  const match = { id: Date.now(), ...req.body };
  matches.push(match);
  writeJSON(file, matches);

  return res.json(match);
});

// --------------- Public update (PUT) ---------------
app.put("/:league/:id", (req, res) => {
  const league = req.params.league;
  const file = leagueFiles[league];
  if (!file)
    return res.status(404).json({ success: false, message: "League not found" });

  const matches = readJSON(file);
  const id = parseInt(req.params.id, 10);
  const idx = matches.findIndex((m) => m.id === id);

  if (idx === -1)
    return res.status(404).json({ success: false, message: "Match not found" });

  matches[idx] = { ...matches[idx], ...req.body, id };
  writeJSON(file, matches);

  return res.json(matches[idx]);
});

// --------------- Public delete (DELETE) ---------------
app.delete("/:league/:id", (req, res) => {
  const league = req.params.league;
  const file = leagueFiles[league];
  if (!file)
    return res.status(404).json({ success: false, message: "League not found" });

  const matches = readJSON(file);
  const id = parseInt(req.params.id, 10);
  const updated = matches.filter((m) => m.id !== id);

  if (matches.length === updated.length) {
    return res.status(404).json({ success: false, message: "Match not found" });
  }

  writeJSON(file, updated);
  return res.json({ success: true });
});

// DRAFTS ENDPOINTS
const draftsFile = path.join(dataDir, "drafts.json");

// Get all drafts
app.get("/drafts", (req, res) => {
  fs.readFile(draftsFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to load drafts" });
    res.json(JSON.parse(data || "[]"));
  });
});

// Add new draft
app.post("/drafts", (req, res) => {
  fs.readFile(draftsFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read drafts" });

    let drafts = [];
    try {
      drafts = JSON.parse(data);
    } catch {
      drafts = [];
    }

    const newDraft = { id: Date.now(), ...req.body };
    drafts.push(newDraft);

    fs.writeFile(draftsFile, JSON.stringify(drafts, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save draft" });
      res.json(newDraft);
    });
  });
});

// Delete draft
app.delete("/drafts/:id", (req, res) => {
  const draftId = parseInt(req.params.id);

  fs.readFile(draftsFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read drafts" });

    let drafts = JSON.parse(data || "[]");
    drafts = drafts.filter((d) => d.id !== draftId);

    fs.writeFile(draftsFile, JSON.stringify(drafts, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to delete draft" });
      res.json({ success: true });
    });
  });
});

// --------------- Start server ---------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log("   → GET:     /laliga | /bundesliga | /epl | /seriea | /league1 | /others");
  console.log("   → POST:    /:league");
  console.log("   → PUT:     /:league/:id");
  console.log("   → DELETE:  /:league/:id");
});