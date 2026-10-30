"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Icon from "@/components/wts/icon";
type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
/**
 * 독립 앱 창 표시 모드의 변경을 구독합니다.
 * @param callback - 표시 모드 변경 시 호출할 함수.
 * @returns 이벤트 구독 정리 함수.
 */
function subscribeDisplayMode(callback: () => void) {
  const media = window.matchMedia("(display-mode: standalone)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
/**
 * 브라우저 표시 모드와 iOS standalone 속성으로 독립 앱 실행 여부를 확인합니다.
 * @returns 독립 앱으로 실행 중이면 true.
 */
function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}
/**
 * 설치 이벤트가 있으면 브라우저의 실제 앱 설치 절차를 실행하고, 없으면 설치 방법을 안내합니다.
 * @returns 앱 다운로드 버튼과 설치 안내 모달.
 */
export default function InstallApp() {
  const standalone = useSyncExternalStore(
    subscribeDisplayMode,
    isStandalone,
    () => false,
  );
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [help, setHelp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    /**
     * 브라우저의 기본 설치 안내를 보류하고 사용자 클릭에 사용할 설치 이벤트를 저장합니다.
     * @param event - beforeinstallprompt 이벤트.
     */
    function ready(event: Event) {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    }
    /**
     * 앱 설치 완료 상태를 반영하고 설치 이벤트와 안내 모달을 정리합니다.
     */
    function done() {
      setInstalled(true);
      setPrompt(null);
      setHelp(false);
      setMessage(
        "앱 설치가 완료되었습니다. 앱 목록이나 Dock에서 실행해 주세요.",
      );
    }
    window.addEventListener("beforeinstallprompt", ready);
    window.addEventListener("appinstalled", done);
    return () => {
      window.removeEventListener("beforeinstallprompt", ready);
      window.removeEventListener("appinstalled", done);
    };
  }, []);
  useEffect(() => {
    if (!help) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    return () => previous?.focus();
  }, [help]);
  /**
   * 사용자 클릭으로 보관한 설치 이벤트를 한 번 사용합니다. 이벤트가 없거나 실행에 실패하면 설치 안내를 표시합니다.
   * @returns 브라우저 설치 선택 결과 처리가 끝나면 완료되는 Promise.
   */
  async function install() {
    if (!prompt) {
      setHelp(true);
      return;
    }
    setBusy(true);
    try {
      // 브라우저가 제공한 이벤트를 사용자 클릭 시점에 한 번만 사용합니다.
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      setMessage(
        outcome === "accepted"
          ? "설치를 요청했습니다. 브라우저의 설치 절차를 완료해 주세요."
          : "설치를 취소했습니다. 웹에서 계속 이용할 수 있어요.",
      );
    } catch {
      setHelp(true);
      setMessage("브라우저 메뉴에서 앱 설치를 진행해 주세요.");
    } finally {
      setPrompt(null);
      setBusy(false);
    }
  }
  return (
    <>
      <button
        className="install-app"
        aria-label={
          standalone
            ? "앱으로 실행 중"
            : installed
              ? "앱 설치됨"
              : "앱 다운로드"
        }
        disabled={busy || installed || standalone}
        onClick={install}
      >
        <Icon name="download" size={20} />
        <span>
          {standalone
            ? "앱 실행 중"
            : installed
              ? "설치됨"
              : busy
                ? "설치 중"
                : "앱 다운로드"}
        </span>
      </button>
      <span className="sr-only" role="status">
        {message}
      </span>
      {help && (
        <div className="modal-backdrop" onClick={() => setHelp(false)}>
          <div
            className="install-dialog"
            ref={dialog}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") setHelp(false);
              if (e.key === "Tab") {
                const buttons =
                  dialog.current?.querySelectorAll<HTMLButtonElement>(
                    "button:not(:disabled)",
                  );
                if (!buttons?.length) return;
                const first = buttons[0],
                  last = buttons[buttons.length - 1];
                if (
                  e.shiftKey &&
                  (document.activeElement === first ||
                    document.activeElement === dialog.current)
                ) {
                  e.preventDefault();
                  last.focus();
                } else if (
                  !e.shiftKey &&
                  (document.activeElement === last ||
                    document.activeElement === dialog.current)
                ) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <button
              className="dialog-close"
              aria-label="설치 안내 닫기"
              onClick={() => setHelp(false)}
            >
              ×
            </button>
            <div className="install-app-mark">M</div>
            <h2 id="install-title">M wide를 앱으로 사용해 보세요</h2>
            <p>
              앱 아이콘으로 실행하고, 독립된 창에서 나만의 작업공간을
              이용하세요. 웹에서도 그대로 사용할 수 있어요.
            </p>
            <ol>
              <li>
                <strong>Chrome · Edge</strong>
                <span>
                  주소창의 설치 아이콘 또는 브라우저 메뉴에서 ‘페이지를 앱으로
                  설치’를 선택하세요.
                </span>
              </li>
              <li>
                <strong>설치 후 실행</strong>
                <span>
                  Mac의 Chrome 앱 폴더·Launchpad 또는 Windows의 시작 메뉴에서 M
                  wide를 실행하세요.
                </span>
              </li>
              <li>
                <strong>iPhone · iPad</strong>
                <span>Safari 공유 메뉴에서 ‘홈 화면에 추가’를 선택하세요.</span>
              </li>
            </ol>
            {!globalThis.isSecureContext && (
              <p className="install-note">
                설치 기능은 HTTPS 또는 localhost에서 사용할 수 있어요.
              </p>
            )}
            <p className="install-note">
              설치 창이 표시되지 않으면 이미 설치되어 있는지 확인하거나 브라우저
              메뉴를 이용해 주세요. 실시간 기능에는 인터넷 연결이 필요합니다.
            </p>
            <div className="install-actions">
              {prompt && (
                <button
                  className="primary-button"
                  onClick={install}
                  disabled={busy}
                >
                  앱 설치
                </button>
              )}
              <button onClick={() => setHelp(false)}>웹에서 계속 사용</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
