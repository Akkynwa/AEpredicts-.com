const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'https://aepredicxt.netlify.app',
    'http://localhost:3000', 
    'http://localhost:5000'
  ]
}));
app.use(express.json());

// ---------------- Paths ----------------
const dataDir = path.join(__dirname, "data");
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

// DRAFTS ENDPOINTS
const draftsFile = path.join(dataDir, "drafts.json");

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
if (!fs.existsSync(draftsFile)) fs.writeFileSync(draftsFile, "[]");

// --------------- Helpers ---------------
const readJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
};

const getConfig = () => readJSON(configPath);

// --------------- Auth ---------------
app.post("/admin/login", (req, res) => {
  try {
    const { username, password } = req.body || {};
    const { admin } = getConfig();

    if (username === admin.username && password === admin.password) {
      return res.json({ success: true });
    }
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// --------------- Public read (GET) ---------------
app.get("/:league", (req, res) => {
  try {
    const league = req.params.league;
    const file = leagueFiles[league];
    
    if (!file) {
      return res.status(404).json({ success: false, message: "League not found" });
    }

    const data = readJSON(file);
    return res.json(data);
  } catch (error) {
    console.error(`Error fetching ${req.params.league}:`, error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// --------------- Public create (POST) ---------------
app.post("/:league", (req, res) => {
  try {
    const league = req.params.league;
    const file = leagueFiles[league];
    
    if (!file) {
      return res.status(404).json({ success: false, message: "League not found" });
    }

    const matches = readJSON(file);
    const match = { 
      id: Date.now(), 
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    matches.push(match);
    writeJSON(file, matches);

    return res.json({ success: true, data: match });
  } catch (error) {
    console.error(`Error creating match in ${req.params.league}:`, error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// --------------- Public update (PUT) ---------------
app.put("/:league/:id", (req, res) => {
  try {
    const league = req.params.league;
    const file = leagueFiles[league];
    
    if (!file) {
      return res.status(404).json({ success: false, message: "League not found" });
    }

    const matches = readJSON(file);
    const id = parseInt(req.params.id, 10);
    const idx = matches.findIndex((m) => m.id === id);

    if (idx === -1) {
      return res.status(404).json({ success: false, message: "Match not found" });
    }

    matches[idx] = { 
      ...matches[idx], 
      ...req.body, 
      id,
      updatedAt: new Date().toISOString()
    };
    
    writeJSON(file, matches);

    return res.json({ success: true, data: matches[idx] });
  } catch (error) {
    console.error(`Error updating match in ${req.params.league}:`, error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// --------------- Public delete (DELETE) ---------------
app.delete("/:league/:id", (req, res) => {
  try {
    const league = req.params.league;
    const file = leagueFiles[league];
    
    if (!file) {
      return res.status(404).json({ success: false, message: "League not found" });
    }

    const matches = readJSON(file);
    const id = parseInt(req.params.id, 10);
    const updated = matches.filter((m) => m.id !== id);

    if (matches.length === updated.length) {
      return res.status(404).json({ success: false, message: "Match not found" });
    }

    writeJSON(file, updated);
    return res.json({ success: true, message: "Match deleted successfully" });
  } catch (error) {
    console.error(`Error deleting match from ${req.params.league}:`, error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// --------------- Drafts Endpoints ---------------

// Get all drafts
app.get("/drafts", (req, res) => {
  try {
    const drafts = readJSON(draftsFile);
    res.json({ success: true, data: drafts });
  } catch (error) {
    console.error("Error fetching drafts:", error);
    res.status(500).json({ success: false, error: "Failed to load drafts" });
  }
});

// Add new draft
app.post("/drafts", (req, res) => {
  try {
    const drafts = readJSON(draftsFile);
    const newDraft = { 
      id: Date.now(), 
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    drafts.push(newDraft);
    writeJSON(draftsFile, drafts);

    res.json({ success: true, data: newDraft });
  } catch (error) {
    console.error("Error saving draft:", error);
    res.status(500).json({ success: false, error: "Failed to save draft" });
  }
});

// Delete draft
app.delete("/drafts/:id", (req, res) => {
  try {
    const draftId = parseInt(req.params.id);
    let drafts = readJSON(draftsFile);
    
    const initialLength = drafts.length;
    drafts = drafts.filter((d) => d.id !== draftId);
    
    if (drafts.length === initialLength) {
      return res.status(404).json({ success: false, error: "Draft not found" });
    }

    writeJSON(draftsFile, drafts);
    res.json({ success: true, message: "Draft deleted successfully" });
  } catch (error) {
    console.error("Error deleting draft:", error);
    res.status(500).json({ success: false, error: "Failed to delete draft" });
  }
});

// --------------- Health Check ---------------
app.get("/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "Server is running", 
    timestamp: new Date().toISOString() 
  });
});

// --------------- Start server ---------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log("   → GET:     /laliga | /bundesliga | /epl | /seriea | /league1 | /others");
  console.log("   → POST:    /:league");
  console.log("   → PUT:     /:league/:id");
  console.log("   → DELETE:  /:league/:id");
  console.log("   → DRAFTS:  /drafts (GET, POST, DELETE)");
  console.log("   → HEALTH:  /health");
  console.log("   → AUTH:    /admin/login (POST)");
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down gracefully');
  process.exit(0);
});