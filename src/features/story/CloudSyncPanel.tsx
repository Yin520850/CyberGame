import { useEffect, useState } from "react";
import {
  createGuestPlayer,
  loadCloudProgress,
  loadLeaderboard,
  loadMyCloudProgress,
  loadMyProfile,
  loadMyStats,
  loginAccount,
  logoutAccount,
  registerAccount,
  saveCloudProgress,
  saveMyCloudProgress,
  type AuthResult,
  type CloudStats,
  type LeaderboardEntry
} from "../../game/cloud/client";
import type { PersistedGameState } from "../../game/store/gameStore";

const PLAYER_ID_STORAGE_KEY = "cybergame_player_id";
const ACCESS_TOKEN_STORAGE_KEY = "cybergame_access_token";

interface CloudSyncPanelProps {
  snapshot: PersistedGameState;
  onHydrate: (snapshot: PersistedGameState) => void;
}

function CloudSyncPanel({ snapshot, onHydrate }: CloudSyncPanelProps) {
  const [apiBaseUrl, setApiBaseUrl] = useState("http://localhost:8787");
  const [nickname, setNickname] = useState("访客侦探");
  const [username, setUsername] = useState("player001");
  const [password, setPassword] = useState("secret123");
  const [playerId, setPlayerId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [stats, setStats] = useState<CloudStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [statusText, setStatusText] = useState("未连接云端");

  useEffect(() => {
    const savedId = window.localStorage.getItem(PLAYER_ID_STORAGE_KEY) ?? "";
    const savedToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? "";
    if (savedId) {
      setPlayerId(savedId);
      setStatusText("已读取本地账号信息");
    }
    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);

  useEffect(() => {
    void refreshLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl]);

  const persistAuth = (auth: AuthResult) => {
    setPlayerId(auth.playerId);
    setAccessToken(auth.accessToken);
    window.localStorage.setItem(PLAYER_ID_STORAGE_KEY, auth.playerId);
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, auth.accessToken);
  };

  const clearAuth = () => {
    setPlayerId("");
    setAccessToken("");
    setStats(null);
    window.localStorage.removeItem(PLAYER_ID_STORAGE_KEY);
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  };

  const refreshLeaderboard = async () => {
    try {
      const entries = await loadLeaderboard(apiBaseUrl);
      setLeaderboard(entries.slice(0, 5));
    } catch {
      setLeaderboard([]);
    }
  };

  const refreshStats = async (token = accessToken) => {
    if (!token) {
      return;
    }
    try {
      const profile = await loadMyProfile(apiBaseUrl, token);
      const remoteStats = await loadMyStats(apiBaseUrl, token);
      setStats(remoteStats);
      setStatusText(
        `已登录：${profile?.nickname ?? "未知玩家"}（${profile?.kind ?? "guest"}）`
      );
    } catch {
      setStats(null);
    }
  };

  const handleCreateGuest = async () => {
    setBusy(true);
    try {
      const auth = await createGuestPlayer(apiBaseUrl, nickname);
      persistAuth(auth);
      setStatusText(`访客已创建：${auth.nickname}`);
      await refreshStats(auth.accessToken);
      await refreshLeaderboard();
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "创建访客失败");
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async () => {
    setBusy(true);
    try {
      const auth = await registerAccount(apiBaseUrl, username, password, nickname);
      persistAuth(auth);
      setStatusText(`注册成功：${auth.username ?? auth.nickname}`);
      await refreshStats(auth.accessToken);
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "注册失败");
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async () => {
    setBusy(true);
    try {
      const auth = await loginAccount(apiBaseUrl, username, password);
      persistAuth(auth);
      setStatusText(`登录成功：${auth.username ?? auth.nickname}`);
      await refreshStats(auth.accessToken);
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "登录失败");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    if (!accessToken) {
      clearAuth();
      setStatusText("已清除本地会话");
      return;
    }
    setBusy(true);
    try {
      await logoutAccount(apiBaseUrl, accessToken);
      clearAuth();
      setStatusText("已退出登录");
    } catch (error) {
      clearAuth();
      setStatusText(error instanceof Error ? error.message : "退出失败");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveCloud = async () => {
    if (!accessToken && !playerId) {
      setStatusText("请先登录账号或创建访客");
      return;
    }

    setBusy(true);
    try {
      if (accessToken) {
        await saveMyCloudProgress(apiBaseUrl, accessToken, snapshot);
        await refreshStats(accessToken);
      } else if (playerId) {
        await saveCloudProgress(apiBaseUrl, playerId, snapshot);
      }
      setStatusText("云端上传完成");
      await refreshLeaderboard();
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "上传失败");
    } finally {
      setBusy(false);
    }
  };

  const handleLoadCloud = async () => {
    if (!accessToken && !playerId) {
      setStatusText("请先登录账号或创建访客");
      return;
    }

    setBusy(true);
    try {
      const cloudSnapshot = accessToken
        ? await loadMyCloudProgress(apiBaseUrl, accessToken)
        : await loadCloudProgress(apiBaseUrl, playerId);
      if (!cloudSnapshot) {
        setStatusText("云端暂无存档");
        return;
      }
      onHydrate(cloudSnapshot);
      setStatusText("云端进度已载入");
      if (accessToken) {
        await refreshStats(accessToken);
      }
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "读取失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel cloud-panel">
      <h2>云存档（完整后端）</h2>
      <label className="cloud-row">
        服务地址
        <input
          value={apiBaseUrl}
          onChange={(event) => setApiBaseUrl(event.target.value)}
        />
      </label>
      <label className="cloud-row">
        昵称
        <input value={nickname} onChange={(event) => setNickname(event.target.value)} />
      </label>
      <label className="cloud-row">
        账号
        <input value={username} onChange={(event) => setUsername(event.target.value)} />
      </label>
      <label className="cloud-row">
        密码
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <p>玩家ID：{playerId || "未登录"}</p>
      <div className="cloud-actions">
        <button type="button" disabled={busy} onClick={handleCreateGuest}>
          访客登录
        </button>
        <button type="button" disabled={busy} onClick={handleRegister}>
          注册账号
        </button>
        <button type="button" disabled={busy} onClick={handleLogin}>
          账号登录
        </button>
        <button type="button" disabled={busy} onClick={handleLogout}>
          退出
        </button>
      </div>
      <div className="cloud-actions">
        <button type="button" disabled={busy} onClick={handleSaveCloud}>
          上传到云端
        </button>
        <button type="button" disabled={busy} onClick={handleLoadCloud}>
          从云端读取
        </button>
      </div>
      {stats && (
        <div className="cloud-metrics">
          <p>章节进度：{stats.completedChapters}/5</p>
          <p>线索：发现 {stats.discoveredClues} / 解析 {stats.resolvedClues} / 使用 {stats.usedClues}</p>
        </div>
      )}
      <div className="cloud-rank">
        <p>终章排行榜（前5）</p>
        <ol>
          {leaderboard.map((entry) => (
            <li key={entry.playerId}>
              {entry.nickname} ({entry.storyNode})
            </li>
          ))}
          {leaderboard.length === 0 && <li>暂无数据</li>}
        </ol>
      </div>
      <p role="status">{statusText}</p>
    </section>
  );
}

export default CloudSyncPanel;
