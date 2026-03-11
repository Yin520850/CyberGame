import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import request from "supertest";
import { createCloudServer } from "../../server/app.js";

describe("auth and protected api", () => {
  let tempDir: string;
  let dataFile: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "cybergame-auth-"));
    dataFile = join(tempDir, "db.json");
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  test("supports register, login, protected progress and logout", async () => {
    const app = createCloudServer({ dataFile });

    const root = await request(app).get("/").expect(200);
    expect(root.text).toContain("CyberGame backend");

    const registerRes = await request(app).post("/api/auth/register").send({
      username: "alice",
      password: "secret123",
      nickname: "Alice"
    });
    expect(registerRes.status).toBe(200);
    expect(registerRes.body.playerId).toBeTruthy();
    expect(registerRes.body.accessToken).toBeTruthy();

    const token = registerRes.body.accessToken as string;

    await request(app).get("/api/auth/me").expect(401);
    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(meRes.body.profile.username).toBe("alice");

    await request(app)
      .put("/api/me/progress")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "investigation",
        currentChapterId: "ch4",
        storyNode: "ch3_completed",
        clueStates: { ch4_login_log: "resolved" },
        locationUnlocked: { lab_door: true }
      })
      .expect(200);

    const progressRes = await request(app)
      .get("/api/me/progress")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(progressRes.body.progress.currentChapterId).toBe("ch4");

    await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    await request(app)
      .get("/api/me/progress")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);

    await request(app).post("/api/auth/login").send({
      username: "alice",
      password: "wrong"
    }).expect(401);

    const loginRes = await request(app).post("/api/auth/login").send({
      username: "alice",
      password: "secret123"
    }).expect(200);
    expect(loginRes.body.accessToken).toBeTruthy();
  });

  test("returns chapter meta and leaderboard", async () => {
    const app = createCloudServer({ dataFile });

    const chapterRes = await request(app).get("/api/chapters").expect(200);
    expect(chapterRes.body.chapters).toHaveLength(5);
    expect(chapterRes.body.chapters[0]).toEqual(
      expect.objectContaining({ id: "ch1" })
    );

    const registerA = await request(app).post("/api/auth/register").send({
      username: "usr1",
      password: "secret123"
    }).expect(200);
    const registerB = await request(app).post("/api/auth/register").send({
      username: "usr2",
      password: "secret123"
    }).expect(200);

    await request(app)
      .put("/api/me/progress")
      .set("Authorization", `Bearer ${registerA.body.accessToken as string}`)
      .send({
        mode: "story",
        currentChapterId: "ch5",
        storyNode: "ch5_completed",
        clueStates: {},
        locationUnlocked: {}
      })
      .expect(200);

    await request(app)
      .put("/api/me/progress")
      .set("Authorization", `Bearer ${registerB.body.accessToken as string}`)
      .send({
        mode: "story",
        currentChapterId: "ch3",
        storyNode: "ch2_completed",
        clueStates: {},
        locationUnlocked: {}
      })
      .expect(200);

    const boardRes = await request(app).get("/api/leaderboard").expect(200);
    expect(boardRes.body.entries.length).toBeGreaterThanOrEqual(1);
    expect(boardRes.body.entries[0]).toEqual(
      expect.objectContaining({
        storyNode: "ch5_completed"
      })
    );
  });
});
