import type { PersistedGameState } from "../store/gameStore";

export interface AuthResult {
  playerId: string;
  nickname: string;
  kind: "guest" | "account";
  accessToken: string;
  username?: string;
}

interface ProfileResponse {
  profile: {
    playerId: string;
    nickname: string;
    kind: "guest" | "account";
    username?: string;
  } | null;
}

interface LoadProgressResponse {
  playerId: string;
  progress: PersistedGameState | null;
}

export interface CloudStats {
  playerId: string;
  storyNode: string;
  completedChapters: number;
  discoveredClues: number;
  resolvedClues: number;
  usedClues: number;
}

export interface LeaderboardEntry {
  playerId: string;
  nickname: string;
  username?: string;
  storyNode: string;
  completedAt: string;
}

function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function authHeaders(accessToken: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`
  };
}

async function parseJsonResponse<T>(response: Response, message: string): Promise<T> {
  if (!response.ok) {
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export async function createGuestPlayer(
  apiBaseUrl: string,
  nickname: string
): Promise<AuthResult> {
  const response = await fetch(`${trimTrailingSlash(apiBaseUrl)}/api/auth/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname })
  });
  return parseJsonResponse<AuthResult>(response, "创建访客账号失败");
}

export async function registerAccount(
  apiBaseUrl: string,
  username: string,
  password: string,
  nickname: string
): Promise<AuthResult> {
  const response = await fetch(`${trimTrailingSlash(apiBaseUrl)}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, nickname })
  });
  return parseJsonResponse<AuthResult>(response, "注册失败");
}

export async function loginAccount(
  apiBaseUrl: string,
  username: string,
  password: string
): Promise<AuthResult> {
  const response = await fetch(`${trimTrailingSlash(apiBaseUrl)}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return parseJsonResponse<AuthResult>(response, "登录失败");
}

export async function loadMyProfile(
  apiBaseUrl: string,
  accessToken: string
): Promise<ProfileResponse["profile"]> {
  const response = await fetch(`${trimTrailingSlash(apiBaseUrl)}/api/auth/me`, {
    headers: authHeaders(accessToken)
  });
  const result = await parseJsonResponse<ProfileResponse>(response, "读取账户信息失败");
  return result.profile;
}

export async function logoutAccount(
  apiBaseUrl: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(`${trimTrailingSlash(apiBaseUrl)}/api/auth/logout`, {
    method: "POST",
    headers: authHeaders(accessToken)
  });
  if (!response.ok) {
    throw new Error("退出登录失败");
  }
}

export async function saveMyCloudProgress(
  apiBaseUrl: string,
  accessToken: string,
  snapshot: PersistedGameState
): Promise<void> {
  const response = await fetch(`${trimTrailingSlash(apiBaseUrl)}/api/me/progress`, {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: JSON.stringify(snapshot)
  });
  if (!response.ok) {
    throw new Error("上传云存档失败");
  }
}

export async function loadMyCloudProgress(
  apiBaseUrl: string,
  accessToken: string
): Promise<PersistedGameState | null> {
  const response = await fetch(`${trimTrailingSlash(apiBaseUrl)}/api/me/progress`, {
    headers: authHeaders(accessToken)
  });
  const result = await parseJsonResponse<LoadProgressResponse>(response, "读取云存档失败");
  return result.progress;
}

export async function loadMyStats(
  apiBaseUrl: string,
  accessToken: string
): Promise<CloudStats> {
  const response = await fetch(`${trimTrailingSlash(apiBaseUrl)}/api/me/stats`, {
    headers: authHeaders(accessToken)
  });
  return parseJsonResponse<CloudStats>(response, "读取统计失败");
}

export async function loadLeaderboard(apiBaseUrl: string): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${trimTrailingSlash(apiBaseUrl)}/api/leaderboard`);
  const result = await parseJsonResponse<{ entries: LeaderboardEntry[] }>(
    response,
    "读取排行榜失败"
  );
  return result.entries;
}

// Legacy endpoints kept for compatibility with old guest-only flow.
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
  const result = await parseJsonResponse<LoadProgressResponse>(response, "读取云存档失败");
  return result.progress;
}
