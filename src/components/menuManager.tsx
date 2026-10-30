"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { menu, menuCodes, type ScreenId } from "@/constants/menu";
import {
  ScreenNavigationProvider,
  useScreenNavigation,
} from "@/contexts/screenNavigation";
import InstallApp from "@/components/pwa/installApp";
import Icon from "@/components/wts/icon";
import { indices, stocks } from "@/components/wts/data";
const screens: Record<ScreenId, ReturnType<typeof dynamic>> = {
  home1000: dynamic(() => import("@/app/screens/home/home1000")),
  watch2000: dynamic(() => import("@/app/screens/watch/watch2000")),
  trading3000: dynamic(() => import("@/app/screens/trading/trading3000")),
  prime4000: dynamic(() => import("@/app/screens/prime/prime4000")),
  assets5000: dynamic(() => import("@/app/screens/assets/assets5000")),
};
/**
 * 화면 이동 Context를 제공하고 공통 WTS 프레임을 렌더링합니다.
 * @returns 화면 코드 기반 메뉴 관리자.
 */
export default function MenuManager() {
  return (
    <ScreenNavigationProvider>
      <WorkspaceShell />
    </ScreenNavigationProvider>
  );
}
/**
 * 공통 상단·왼쪽 메뉴·하단을 유지하고 선택한 화면만 콘텐츠 영역에 렌더링합니다. URL과 브라우저 방문 기록은 변경하지 않습니다.
 * @returns 현재 화면과 공통 프레임.
 */
function WorkspaceShell() {
  const { code, openScreen } = useScreenNavigation();
  const current = menu[code];
  const Screen = screens[current.screenId];
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [light, setLight] = useState(false);
  const results = search.trim()
    ? stocks.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.code.includes(search),
      )
    : [];
  return (
    <main className={`wts-shell ${light ? "light-theme" : ""}`}>
      <header className="topbar">
        <button
          onClick={() => openScreen("1000")}
          className="brand"
          aria-label="홈"
        >
          <strong>M</strong>
          <small>wide</small>
        </button>
        <div className="search-wrap">
          <label className="search-box">
            <input
              aria-label="주식, 키워드 검색"
              placeholder="주식, 키워드 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <kbd>⌥ K</kbd>
            <Icon name="search" size={20} />
          </label>
          {search && (
            <div className="search-results">
              {results.length ? (
                results.map((s) => (
                  <button
                    key={s.code}
                    onClick={() => {
                      openScreen("3000");
                      setNotice(
                        `${s.name} 검색 결과 · 트레이딩의 종목 목록에서 선택해 주세요.`,
                      );
                      setSearch("");
                    }}
                  >
                    {s.name}
                    <small>{s.code}</small>
                  </button>
                ))
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </div>
          )}
        </div>
        <div className="popular">
          <b>실시간인기</b>
          <span>국내</span> 1. SK하이닉스 <small className="down">▼</small>
        </div>
        <div className="header-actions">
          <span className="demo-label">DEMO WORKSPACE</span>
          <InstallApp />
          <button
            aria-label="공지 안내"
            onClick={() =>
              setNotice("모든 시세와 자산은 화면 확인용 더미 데이터입니다.")
            }
          >
            <Icon name="sound" />
          </button>
          <button
            className="login"
            onClick={() => setNotice("로그인은 연결되지 않은 데모 화면입니다.")}
          >
            <Icon name="user" size={20} /> 로그인
          </button>
        </div>
      </header>
      <aside className="sidebar">
        <nav aria-label="주 메뉴">
          {menuCodes.map((key) => (
            <button
              key={key}
              onClick={() => openScreen(key)}
              className={code === key ? "active" : ""}
              aria-current={code === key ? "page" : undefined}
            >
              <Icon name={menu[key].icon} />
              <span>{menu[key].screenName}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            aria-label="테마 전환"
            aria-pressed={light}
            onClick={() => setLight(!light)}
          >
            <Icon name="sun" />
          </button>
          <button
            aria-label="설정"
            onClick={() =>
              setNotice(
                "왼쪽 메뉴로 화면을 전환합니다. 상단과 왼쪽 영역을 유지하면서 가운데 화면만 교체합니다.",
              )
            }
          >
            <Icon name="settings" />
          </button>
          <button
            aria-label="안내"
            onClick={() =>
              setNotice(
                "KB WTS 화면을 참고한 개발용 데모입니다. 실제 금융 서비스가 아닙니다.",
              )
            }
          >
            <span className="exit-icon">⇥</span>
          </button>
        </div>
      </aside>
      <section
        id="wts-main"
        className="screen-container"
        aria-label={current?.screenName || "화면 없음"}
      >
        <Screen key={code} />
      </section>
      <footer className="ticker">
        <span className="ticker-label">
          <i /> MARKET
        </span>
        {indices.map((item) => (
          <div key={item.name}>
            <span>{item.name}</span>
            <strong className="down">
              {item.value} ▼ {item.change}
            </strong>
          </div>
        ))}
      </footer>
      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button aria-label="알림 닫기" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}
    </main>
  );
}
