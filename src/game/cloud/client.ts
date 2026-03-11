import type { PersistedGameState } from "../store/gameStore";

interface GuestAuthResponse {
  playerId: string;
  nickname: string;
}

interface LoadProgressResponse {
  playerId: string;
  progress: PersistedGameState | null;
}

function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export async function createGuestPlayer(
  apiBaseUrl: string,
  nickname: string
): Promise<GuestAuthResponse> {
  const response = await fetch(`${trimTrailingSlash(apiBaseUrl)}/api/auth/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname })
  });
  if (!response.ok) {
    throw new Error("创建访客账号失败");
  }
  return (await response.json()) as GuestAuthResponse;
}

export async function saveCloudProgress(
  apiBaseUrl: string,
  playerId: string,
  snapshot: PersistedGameState
): Promise<void> {
  const response = await fetch(
    `${trimTrailingSlash(apiBaseUrl)}/api/progress/${encodeURIComponent(playerId)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snapshot)
    }
  );
  if (!response.ok) {
    throw new Error("上传云存档失败");
  }
}

export async function loadCloudProgress(
  apiBaseUrl: string,
  playerId: string
): Promise<PersistedGameState | null> {
  const response = await fetch(
    `${trimTrailingSlash(apiBaseUrl)}/api/progress/${encodeURIComponent(playerId)}`
  );
  if (!response.ok) {
    throw new Error("读取云存档失败");
  }
  const data = (await response.json()) as LoadProgressResponse;
  return data.progress;
}
