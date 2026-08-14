"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { createBackup, parseBackup, resetVeroPosData, restoreBackup } from "@/lib/repositories/backupRepository";
import { getInstallPrompt, setInstallPrompt } from "@/lib/pwa/installPrompt";

function backupFileName() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `vero-pos-backup-${stamp}.json`;
}

export function V1DataTools() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [online, setOnline] = useState(true);
  const [installReady, setInstallReady] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setOnline(navigator.onLine);
      setInstallReady(Boolean(getInstallPrompt()));
      setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    };
    refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    window.addEventListener("appinstalled", refresh);
    window.addEventListener("vero-install-prompt-change", refresh);
    return () => {
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
      window.removeEventListener("appinstalled", refresh);
      window.removeEventListener("vero-install-prompt-change", refresh);
    };
  }, []);

  async function handleInstall() {
    const prompt = getInstallPrompt();
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") setInstallPrompt(null);
  }

  async function handleBackup() {
    setBusy(true);
    setMessage("");
    try {
      const backup = await createBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = backupFileName();
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Đã tạo bản sao lưu đầy đủ.");
    } catch {
      setMessage("Không thể tạo bản sao lưu. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRestore(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!window.confirm("Khôi phục sẽ thay thế toàn bộ dữ liệu hiện tại. Anh chắc chắn tiếp tục?")) return;

    setBusy(true);
    setMessage("");
    try {
      const backup = parseBackup(await file.text());
      await restoreBackup(backup);
      setMessage("Khôi phục thành công. Đang tải lại dữ liệu...");
      window.setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể khôi phục dữ liệu.");
      setBusy(false);
    }
  }

  async function handleReset() {
    if (!window.confirm("Nên xuất file backup trước khi reset. Anh vẫn muốn tiếp tục?")) return;
    if (!window.confirm("Xóa toàn bộ sản phẩm, danh mục, hóa đơn và thiết lập trên thiết bị này?")) return;

    setBusy(true);
    setMessage("");
    try {
      await resetVeroPosData();
      setMessage("Đã reset dữ liệu. Đang trở về màn hình chào mừng...");
      window.setTimeout(() => window.location.assign("/welcome"), 700);
    } catch {
      setMessage("Không thể reset dữ liệu. Vui lòng thử lại.");
      setBusy(false);
    }
  }

  return (
    <section className="vp-v1-tools">
      <div className="vp-v1-tools-heading">
        <div><span>VERO POS V1</span><h2>Cài đặt &amp; dữ liệu</h2></div>
        <span className={`vp-online-state ${online ? "is-online" : ""}`}>{online ? "Online" : "Offline"}</span>
      </div>
      <div className="vp-tool-grid">
        <article className="vp-tool-card">
          <strong>Cài ứng dụng</strong>
          <span>{installed ? "Đã cài trên thiết bị này" : "Mở nhanh và tiếp tục bán khi mất mạng"}</span>
          <button type="button" onClick={handleInstall} disabled={!installReady || installed}>{installed ? "Đã cài đặt" : installReady ? "Cài VERO POS" : "Dùng menu trình duyệt để cài"}</button>
        </article>
        <article className="vp-tool-card">
          <strong>Sao lưu dữ liệu</strong>
          <span>Sản phẩm, danh mục, thiết lập và hóa đơn</span>
          <button type="button" onClick={handleBackup} disabled={busy}>Xuất file backup</button>
        </article>
        <article className="vp-tool-card vp-tool-card--danger">
          <strong>Khôi phục dữ liệu</strong>
          <span>Thay toàn bộ dữ liệu bằng một bản backup V1</span>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}>Chọn file để khôi phục</button>
          <input ref={inputRef} type="file" accept="application/json,.json" onChange={handleRestore} hidden />
        </article>
        <article className="vp-tool-card vp-tool-card--reset">
          <strong>Reset dữ liệu</strong>
          <span>Xóa toàn bộ dữ liệu thử nghiệm và đưa app về trạng thái ban đầu</span>
          <button type="button" onClick={handleReset} disabled={busy}>Xóa toàn bộ dữ liệu</button>
        </article>
      </div>
      {message && <p className="vp-tool-message" role="status">{message}</p>}
    </section>
  );
}
