import express from "express";
import cors from "cors";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const DEFAULT_DB_PATH = resolve(process.cwd(), "server", "data", "db.json");
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

const CHAPTERS = [
  { id: "ch1", title: "失控的匿名帖", clueCount: 4 },
  { id: "ch2", title: "照片里的路线", clueCount: 5 },
  { id: "ch3", title: "神秘便签与隐藏信息", clueCount: 4 },
  { id: "ch4", title: "谁在制造误导", clueCount: 4 },
  { id: "ch5", title: "夜鸦现身", clueCount: 3 }
];

const STORY_RANK = {
  ch1_start: 0,
  ch1_completed: 1,
  ch2_completed: 2,
  ch3_completed: 3,
  ch4_completed: 4,
  ch5_completed: 5
};

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(3).toString("hex")}`;
}

function isObjectRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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
          progress: {},
          accounts: {},
          sessions: {}
        },
        null,
        2
      ),
      "utf8"
    );
  }
}

function normalizeDbShape(raw) {
  if (!isObjectRecord(raw)) {
    return {
      players: {},
      progress: {},
      accounts: {},
      sessions: {}
    };
  }
  return {
    players: isObjectRecord(raw.players) ? raw.players : {},
    progress: isObjectRecord(raw.progress) ? raw.progress : {},
    accounts: isObjectRecord(raw.accounts) ? raw.accounts : {},
    sessions: isObjectRecord(raw.sessions) ? raw.sessions : {}
  };
}

function readDb(dataFile) {
  ensureDbFile(dataFile);
  try {
    return normalizeDbShape(JSON.parse(readFileSync(dataFile, "utf8")));
  } catch {
    return normalizeDbShape({});
  }
}

function writeDb(dataFile, db) {
  ensureDbFile(dataFile);
  writeFileSync(dataFile, JSON.stringify(db, null, 2), "utf8");
}

function parseClueState(value) {
  return (
    value === "undiscovered" ||
    value === "discovered" ||
    value === "resolved" ||
    value === "used_in_reasoning"
  );
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
      if (parseClueState(value)) {
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

function hashPassword(password, salt) {
  return pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
}

function safeString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeUsername(value) {
  return safeString(value).trim().toLowerCase();
}

function createSession(db, playerId) {
  const token = randomBytes(24).toString("hex");
  const createdAt = nowIso();
  db.sessions[token] = {
    token,
    playerId,
    createdAt,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString()
  };
  return token;
}

function pruneSessions(db) {
  const now = Date.now();
  Object.entries(db.sessions).forEach(([token, session]) => {
    if (!isObjectRecord(session)) {
      delete db.sessions[token];
      return;
    }
    const expiresAt = Date.parse(safeString(session.expiresAt, ""));
    if (Number.isNaN(expiresAt) || expiresAt <= now) {
      delete db.sessions[token];
    }
  });
}

function getBearerToken(req) {
  const header = safeString(req.headers.authorization, "");
  if (!header.startsWith("Bearer ")) {
    return "";
  }
  return header.slice("Bearer ".length).trim();
}

function saveProgressForPlayer(db, playerId, snapshot) {
  db.progress[playerId] = {
    ...snapshot,
    updatedAt: nowIso()
  };
}

function getPlayerProfile(db, playerId) {
  if (!db.players[playerId]) {
    return null;
  }
  const profile = db.players[playerId];
  return {
    playerId,
    nickname: safeString(profile.nickname, "未命名玩家"),
    kind: safeString(profile.kind, "guest"),
    username: safeString(profile.username, "")
  };
}

function buildProgressStats(progress) {
  if (!progress) {
    return {
      completedChapters: 0,
      discoveredClues: 0,
      resolvedClues: 0,
      usedClues: 0
    };
  }

  const clueStates = isObjectRecord(progress.clueStates) ? progress.clueStates : {};
  let discoveredClues = 0;
  let resolvedClues = 0;
  let usedClues = 0;

  Object.values(clueStates).forEach((state) => {
    if (state === "discovered" || state === "resolved" || state === "used_in_reasoning") {
      discoveredClues += 1;
    }
    if (state === "resolved" || state === "used_in_reasoning") {
      resolvedClues += 1;
    }
    if (state === "used_in_reasoning") {
      usedClues += 1;
    }
  });

  const storyNode = safeString(progress.storyNode, "ch1_start");
  return {
    completedChapters: STORY_RANK[storyNode] ?? 0,
    discoveredClues,
    resolvedClues,
    usedClues
  };
}

function buildLeaderboard(db) {
  const entries = [];

  Object.entries(db.progress).forEach(([playerId, progress]) => {
    if (!isObjectRecord(progress)) {
      return;
    }
    const storyNode = safeString(progress.storyNode, "");
    if ((STORY_RANK[storyNode] ?? 0) < STORY_RANK.ch5_completed) {
      return;
    }
    const profile = getPlayerProfile(db, playerId);
    entries.push({
      playerId,
      nickname: profile?.nickname ?? "未知玩家",
      username: profile?.username ?? "",
      storyNode,
      completedAt: safeString(progress.updatedAt, nowIso())
    });
  });

  entries.sort((a, b) => Date.parse(a.completedAt) - Date.parse(b.completedAt));
  return entries.slice(0, 20);
}

function readSessionPlayer(req, res, dataFile) {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ message: "missing bearer token" });
    return null;
  }

  const db = readDb(dataFile);
  pruneSessions(db);

  const session = db.sessions[token];
  if (!session || !isObjectRecord(session)) {
    writeDb(dataFile, db);
    res.status(401).json({ message: "invalid session" });
    return null;
  }

  if (!db.players[safeString(session.playerId, "")]) {
    delete db.sessions[token];
    writeDb(dataFile, db);
    res.status(401).json({ message: "player not found" });
    return null;
  }

  return {
    db,
    token,
    playerId: safeString(session.playerId, "")
  };
}

function createGuestPlayer(db, nickname) {
  const playerId = createId("guest");
  db.players[playerId] = {
    playerId,
    nickname,
    kind: "guest",
    createdAt: nowIso()
  };
  return playerId;
}

function createCloudServer(options = {}) {
  const dataFile = options.dataFile ?? DEFAULT_DB_PATH;
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.type("text/html").send(
      [
        "<h1>CyberGame backend</h1>",
        "<p>API is running.</p>",
        "<ul>",
        "<li>GET /api/health</li>",
        "<li>POST /api/auth/guest</li>",
        "<li>POST /api/auth/register</li>",
        "<li>POST /api/auth/login</li>",
        "<li>GET /api/chapters</li>",
        "</ul>"
      ].join("")
    );
  });

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "cybergame-backend" });
  });

  app.get("/api/chapters", (_req, res) => {
    res.json({ chapters: CHAPTERS });
  });

  app.get("/api/game/content", (_req, res) => {
    res.json({
      chapters: CHAPTERS.map((chapter) => ({
        ...chapter,
        scene: chapter.id === "ch5" ? "finale" : "investigation"
      }))
    });
  });

  app.post("/api/auth/guest", (req, res) => {
    const db = readDb(dataFile);
    pruneSessions(db);
    const nickname =
      safeString(req.body?.nickname, "").trim().slice(0, 24) || "访客玩家";
    const playerId = createGuestPlayer(db, nickname);
    const accessToken = createSession(db, playerId);
    writeDb(dataFile, db);
    res.json({ playerId, nickname, accessToken, kind: "guest" });
  });

  app.post("/api/auth/register", (req, res) => {
    const username = normalizeUsername(req.body?.username);
    const password = safeString(req.body?.password, "");
    const nickname =
      safeString(req.body?.nickname, "").trim().slice(0, 24) || username || "账号玩家";

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      res.status(400).json({ message: "username must match /^[a-z0-9_]{3,20}$/" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: "password must be at least 6 chars" });
      return;
    }

    const db = readDb(dataFile);
    pruneSessions(db);
    if (db.accounts[username]) {
      writeDb(dataFile, db);
      res.status(409).json({ message: "username exists" });
      return;
    }

    const accountId = createId("acct");
    const playerId = createId("user");
    const salt = randomBytes(16).toString("hex");
    db.accounts[username] = {
      accountId,
      username,
      passwordHash: hashPassword(password, salt),
      salt,
      playerId,
      createdAt: nowIso()
    };
    db.players[playerId] = {
      playerId,
      nickname,
      kind: "account",
      username,
      createdAt: nowIso()
    };
    const accessToken = createSession(db, playerId);
    writeDb(dataFile, db);

    res.json({ playerId, nickname, username, accessToken, kind: "account" });
  });

  app.post("/api/auth/login", (req, res) => {
    const username = normalizeUsername(req.body?.username);
    const password = safeString(req.body?.password, "");
    const db = readDb(dataFile);
    pruneSessions(db);

    const account = db.accounts[username];
    if (!account || !isObjectRecord(account)) {
      writeDb(dataFile, db);
      res.status(401).json({ message: "invalid credentials" });
      return;
    }

    const expected = Buffer.from(safeString(account.passwordHash, ""), "hex");
    const actual = Buffer.from(
      hashPassword(password, safeString(account.salt, "")),
      "hex"
    );
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      writeDb(dataFile, db);
      res.status(401).json({ message: "invalid credentials" });
      return;
    }

    const playerId = safeString(account.playerId, "");
    const accessToken = createSession(db, playerId);
    writeDb(dataFile, db);
    const profile = getPlayerProfile(db, playerId);
    res.json({
      playerId,
      username,
      nickname: profile?.nickname ?? "账号玩家",
      accessToken,
      kind: "account"
    });
  });

  app.get("/api/auth/me", (req, res) => {
    const session = readSessionPlayer(req, res, dataFile);
    if (!session) {
      return;
    }

    writeDb(dataFile, session.db);
    res.json({
      profile: getPlayerProfile(session.db, session.playerId)
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    const session = readSessionPlayer(req, res, dataFile);
    if (!session) {
      return;
    }
    delete session.db.sessions[session.token];
    writeDb(dataFile, session.db);
    res.json({ ok: true });
  });

  app.get("/api/progress/:playerId", (req, res) => {
    const db = readDb(dataFile);
    const playerId = req.params.playerId;
    res.json({ playerId, progress: db.progress[playerId] ?? null });
  });

  app.put("/api/progress/:playerId", (req, res) => {
    const snapshot = sanitizeProgressSnapshot(req.body);
    if (!snapshot) {
      res.status(400).json({ message: "invalid snapshot payload" });
      return;
    }

    const db = readDb(dataFile);
    const playerId = req.params.playerId;
    if (!db.players[playerId]) {
      db.players[playerId] = {
        playerId,
        nickname: "未命名访客",
        kind: "guest",
        createdAt: nowIso()
      };
    }
    saveProgressForPlayer(db, playerId, snapshot);
    writeDb(dataFile, db);
    res.json({ ok: true, playerId });
  });

  app.get("/api/me/progress", (req, res) => {
    const session = readSessionPlayer(req, res, dataFile);
    if (!session) {
      return;
    }

    writeDb(dataFile, session.db);
    res.json({
      playerId: session.playerId,
      progress: session.db.progress[session.playerId] ?? null
    });
  });

  app.put("/api/me/progress", (req, res) => {
    const session = readSessionPlayer(req, res, dataFile);
    if (!session) {
      return;
    }
    const snapshot = sanitizeProgressSnapshot(req.body);
    if (!snapshot) {
      res.status(400).json({ message: "invalid snapshot payload" });
      return;
    }

    saveProgressForPlayer(session.db, session.playerId, snapshot);
    writeDb(dataFile, session.db);
    res.json({ ok: true, playerId: session.playerId });
  });

  app.get("/api/me/stats", (req, res) => {
    const session = readSessionPlayer(req, res, dataFile);
    if (!session) {
      return;
    }
    const progress = session.db.progress[session.playerId] ?? null;
    const stats = buildProgressStats(progress);
    writeDb(dataFile, session.db);
    res.json({
      playerId: session.playerId,
      storyNode: progress?.storyNode ?? "ch1_start",
      ...stats
    });
  });

  app.get("/api/leaderboard", (_req, res) => {
    const db = readDb(dataFile);
    const entries = buildLeaderboard(db);
    res.json({ entries });
  });

  return app;
}

export { createCloudServer };
