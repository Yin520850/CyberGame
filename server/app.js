import express from "express";
import cors from "cors";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const DEFAULT_DB_PATH = resolve(process.cwd(), "server", "data", "db.json");

function ensureDbFile(dataFile) {
  if (!existsSync(dirname(dataFile))) {
    mkdirSync(dirname(dataFile), { recursive: true });
  }
  if (!existsSync(dataFile)) {
    writeFileSync(
      dataFile,
      JSON.stringify(
        {
          players: {},
          progress: {}
        },
        null,
        2
      ),
      "utf8"
    );
  }
}

function readDb(dataFile) {
  ensureDbFile(dataFile);
  try {
    const raw = readFileSync(dataFile, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return { players: {}, progress: {} };
    }
    return {
      players: parsed.players && typeof parsed.players === "object" ? parsed.players : {},
      progress: parsed.progress && typeof parsed.progress === "object" ? parsed.progress : {}
    };
  } catch {
    return { players: {}, progress: {} };
  }
}

function writeDb(dataFile, db) {
  ensureDbFile(dataFile);
  writeFileSync(dataFile, JSON.stringify(db, null, 2), "utf8");
}

function createGuestId() {
  return `guest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function isObjectRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeProgressSnapshot(input) {
  if (!isObjectRecord(input)) {
    return null;
  }

  const mode = input.mode === "investigation" ? "investigation" : "story";
  const currentChapterId =
    typeof input.currentChapterId === "string" ? input.currentChapterId : "ch1";
  const storyNode = typeof input.storyNode === "string" ? input.storyNode : "ch1_start";

  const clueStates = {};
  if (isObjectRecord(input.clueStates)) {
    Object.entries(input.clueStates).forEach(([key, value]) => {
      if (
        value === "undiscovered" ||
        value === "discovered" ||
        value === "resolved" ||
        value === "used_in_reasoning"
      ) {
        clueStates[key] = value;
      }
    });
  }

  const locationUnlocked = {};
  if (isObjectRecord(input.locationUnlocked)) {
    Object.entries(input.locationUnlocked).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        locationUnlocked[key] = value;
      }
    });
  }

  return {
    mode,
    currentChapterId,
    storyNode,
    clueStates,
    locationUnlocked
  };
}

export function createCloudServer(options = {}) {
  const dataFile = options.dataFile ?? DEFAULT_DB_PATH;
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.post("/api/auth/guest", (req, res) => {
    const nickname =
      typeof req.body?.nickname === "string" && req.body.nickname.trim().length > 0
        ? req.body.nickname.trim().slice(0, 24)
        : "访客玩家";
    const playerId = createGuestId();
    const db = readDb(dataFile);

    db.players[playerId] = {
      playerId,
      nickname,
      createdAt: new Date().toISOString()
    };
    writeDb(dataFile, db);

    res.json({ playerId, nickname });
  });

  app.get("/api/progress/:playerId", (req, res) => {
    const db = readDb(dataFile);
    const playerId = req.params.playerId;
    const progress = db.progress[playerId] ?? null;

    res.json({ playerId, progress });
  });

  app.put("/api/progress/:playerId", (req, res) => {
    const playerId = req.params.playerId;
    const snapshot = sanitizeProgressSnapshot(req.body);
    if (!snapshot) {
      res.status(400).json({ message: "invalid snapshot payload" });
      return;
    }

    const db = readDb(dataFile);
    if (!db.players[playerId]) {
      db.players[playerId] = {
        playerId,
        nickname: "未命名访客",
        createdAt: new Date().toISOString()
      };
    }

    db.progress[playerId] = {
      ...snapshot,
      updatedAt: new Date().toISOString()
    };
    writeDb(dataFile, db);
    res.json({ ok: true, playerId });
  });

  return app;
}
