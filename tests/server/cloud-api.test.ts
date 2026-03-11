import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import request from "supertest";
import { createCloudServer } from "../../server/app.js";

describe("cloud api", () => {
  let tempDir: string;
  let dataFile: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "cybergame-server-"));
    dataFile = join(tempDir, "db.json");
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  test("creates guest player and round-trips progress snapshot", async () => {
    const app = createCloudServer({ dataFile });

    const loginRes = await request(app as any)
      .post("/api/auth/guest")
      .send({ nickname: "Tester" })
      .expect(200);
    const playerId: string = loginRes.body.playerId;

    expect(playerId).toMatch(/^guest_/);

    await request(app as any)
      .put(`/api/progress/${playerId}`)
      .send({
        mode: "investigation",
        currentChapterId: "ch3",
        storyNode: "ch2_completed",
        clueStates: {
          ch2_photo_1: "used_in_reasoning"
        },
        locationUnlocked: {
          lab_door: true
        }
      })
      .expect(200);

    const loadRes = await request(app as any)
      .get(`/api/progress/${playerId}`)
      .expect(200);

    expect(loadRes.body.progress).toEqual(
      expect.objectContaining({
        mode: "investigation",
        currentChapterId: "ch3",
        storyNode: "ch2_completed"
      })
    );
  });
});
