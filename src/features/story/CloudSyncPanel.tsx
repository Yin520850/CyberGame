import { useEffect, useState } from "react";
import {
  createGuestPlayer,
  loadCloudProgress,
  saveCloudProgress
} from "../../game/cloud/client";
import type { PersistedGameState } from "../../game/store/gameStore";

const PLAYER_ID_STORAGE_KEY = "cybergame_guest_player_id";

interface CloudSyncPanelProps {
  snapshot: PersistedGameState;
  onHydrate: (snapshot: PersistedGameState) => void;
}

function CloudSyncPanel({ snapshot, onHydrate }: CloudSyncPanelProps) {
  const [apiBaseUrl, setApiBaseUrl] = useState("http://localhost:8787");
  const [nickname, setNickname] = useState("访客侦探");
  const [playerId, setPlayerId] = useState("");
  const [busy, setBusy] = useState(false);
  const [statusText, setStatusText] = useState("未连接云端");

  useEffect(() => {
    const savedId = window.localStorage.getItem(PLAYER_ID_STORAGE_KEY) ?? "";
    if (savedId) {
      setPlayerId(savedId);
      setStatusText("已检测到本地访客ID");
    }
  }, []);

  const handleCreateGuest = async () => {
    setBusy(true);
    try {
      const auth = await createGuestPlayer(apiBaseUrl, nickname);
      setPlayerId(auth.playerId);
      window.localStorage.setItem(PLAYER_ID_STORAGE_KEY, auth.playerId);
      setStatusText(`访客已创建：${auth.nickname}`);
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "创建访客失败");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveCloud = async () => {
    if (!playerId) {
      setStatusText("请先创建访客ID");
      return;
    }

    setBusy(true);
    try {
      await saveCloudProgress(apiBaseUrl, playerId, snapshot);
      setStatusText("云端上传完成");
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "上传失败");
    } finally {
      setBusy(false);
    }
  };

  const handleLoadCloud = async () => {
    if (!playerId) {
      setStatusText("请先创建访客ID");
      return;
    }

    setBusy(true);
    try {
      const cloudSnapshot = await loadCloudProgress(apiBaseUrl, playerId);
      if (!cloudSnapshot) {
        setStatusText("云端暂无存档");
        return;
      }
      onHydrate(cloudSnapshot);
      setStatusText("云端进度已载入");
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "读取失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel cloud-panel">
      <h2>云存档（小后端）</h2>
      <label className="cloud-row">
        服务地址
        <input
          value={apiBaseUrl}
          onChange={(event) => setApiBaseUrl(event.target.value)}
        />
      </label>
      <label className="cloud-row">
        访客名
        <input value={nickname} onChange={(event) => setNickname(event.target.value)} />
      </label>
      <p>访客ID：{playerId || "未创建"}</p>
      <div className="cloud-actions">
        <button type="button" disabled={busy} onClick={handleCreateGuest}>
          创建访客ID
        </button>
        <button type="button" disabled={busy} onClick={handleSaveCloud}>
          上传到云端
        </button>
        <button type="button" disabled={busy} onClick={handleLoadCloud}>
          从云端读取
        </button>
      </div>
      <p role="status">{statusText}</p>
    </section>
  );
}

export default CloudSyncPanel;
