"use client";
import Image from "next/image";
import {
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type PointerEvent,
} from "react";
import infoIcon from "@/assets/images/common/icon_info.png";
import {
  arrange,
  resizePair,
  defaultLayout,
  parseLayout,
  reorder,
  widgetDefinitions,
  type WidgetId,
  type WorkspaceLayout,
} from "./layout";
import WidgetSettings from "./widgetSettings";
const fallback = JSON.stringify(defaultLayout);
const memory = new Map<string, string>();
/**
 * 다른 탭의 저장소 변경과 현재 창의 배치 변경 이벤트를 구독합니다.
 * @param callback - 배치가 변경되었을 때 실행할 함수.
 * @returns 이벤트 구독을 해제하는 정리 함수.
 */
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("wts-layout", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("wts-layout", callback);
  };
}
/**
 * 화면 코드별 커스텀 작업공간을 구성합니다. isMain과 resizable이 모두 true일 때 위젯 선택·이동·크기 조절을 제공합니다.
 * @param props - 작업공간 설정.
 * @param props.screenId - 배치 저장 키를 구분하는 메인 화면 코드.
 * @param props.isMain - 메인 화면 여부.
 * @param props.resizable - 배치 편집 허용 여부.
 * @param props.renderWidget - 하위 화면 코드에 대응하는 컴포넌트를 반환하는 함수.
 * @returns 저장된 배치와 위젯 설정 UI.
 */
export default function Workspace({
  screenId,
  isMain,
  resizable,
  renderWidget,
}: {
  screenId: string;
  isMain: boolean;
  resizable: boolean;
  renderWidget: (id: WidgetId) => ReactNode;
}) {
  const editable = isMain && resizable;
  const storageKey = `wts.workspace.v1.${screenId}`;
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return (
          localStorage.getItem(storageKey) ?? memory.get(storageKey) ?? fallback
        );
      } catch {
        return memory.get(storageKey) ?? fallback;
      }
    },
    () => fallback,
  );
  const layout = useMemo(() => parseLayout(raw), [raw]);
  const [settings, setSettings] = useState(false);
  const [menu, setMenu] = useState<WidgetId | null>(null);
  const [fullscreen, setFullscreen] = useState<WidgetId | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const board = useRef<HTMLDivElement>(null);
  const resize = useRef<{
    axis: "x" | "y";
    index: number;
    start: number;
    size: number;
    layout: WorkspaceLayout;
  } | null>(null);
  /**
   * 배치를 localStorage와 현재 페이지 메모리에 기록하고 변경 이벤트를 알립니다.
   * @param next - 저장할 새 배치.
   */
  function save(next: WorkspaceLayout) {
    const value = JSON.stringify(next);
    memory.set(storageKey, value);
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      /* 메모리에서 계속 사용합니다. */
    }
    window.dispatchEvent(new Event("wts-layout"));
  }
  /**
   * 포인터를 캡처하고 드래그 시작 좌표와 기존 배치를 보관합니다.
   * @param e - 경계선의 포인터 시작 이벤트.
   * @param axis - 가로 너비(x) 또는 세로 높이(y).
   * @param index - 조절할 경계선 앞 영역의 위치.
   */
  function startResize(
    e: PointerEvent<HTMLDivElement>,
    axis: "x" | "y",
    index: number,
  ) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    resize.current = {
      axis,
      index,
      start: axis === "x" ? e.clientX : e.clientY,
      size: Math.max(
        1,
        (board.current?.clientWidth ?? 1) - (layout.columns - 1) * 8,
      ),
      layout,
    };
  }
  /**
   * 드래그 시작점과 현재 포인터의 차이로 인접 영역의 크기를 계산하고 저장합니다.
   * @param e - 포인터 이동 이벤트.
   */
  function moveResize(e: PointerEvent<HTMLDivElement>) {
    const state = resize.current;
    if (!state) return;
    const next = {
      ...state.layout,
      widths: [...state.layout.widths],
      heights: [...state.layout.heights],
    };
    if (state.axis === "x") {
      const values = next.widths;
      const delta =
        ((e.clientX - state.start) / state.size) *
        values.reduce((a, b) => a + b, 0);
      next.widths = resizePair(values, state.index, delta, 8);
    } else {
      next.heights = resizePair(
        next.heights,
        state.index,
        e.clientY - state.start,
        180,
        1200,
      );
    }
    save(next);
  }
  /**
   * 방향키 입력으로 인접한 두 영역의 크기를 조절하고 배치를 저장합니다.
   * @param axis - 가로 너비(x) 또는 세로 높이(y).
   * @param index - 조절할 경계선 앞 영역의 위치.
   * @param delta - 증감할 크기. 너비는 비율, 높이는 픽셀입니다.
   */
  function keyboardResize(axis: "x" | "y", index: number, delta: number) {
    const next = {
      ...layout,
      widths: [...layout.widths],
      heights: [...layout.heights],
    };
    if (axis === "x") next.widths = resizePair(next.widths, index, delta, 8);
    else next.heights = resizePair(next.heights, index, delta, 180, 1200);
    save(next);
  }
  const rows = Math.ceil(layout.ids.length / layout.columns);
  return (
    <div className="workspace">
      <div className="workspace-toolbar">
        <strong>나의 트레이딩</strong>
        <span>패널 제목을 드래그해 이동 · 경계선을 드래그해 크기 조절</span>
        {editable && (
          <>
            <button onClick={() => setSettings(true)}>＋ 위젯 설정</button>
            <button onClick={() => save(defaultLayout)}>기본 배치</button>
          </>
        )}
      </div>
      <div
        className="workspace-board"
        ref={board}
        style={{
          gridTemplateColumns: layout.widths
            .map((w) => `minmax(0, ${w}fr)`)
            .join(" 8px "),
          gridTemplateRows: layout.heights.map((h) => `${h}px`).join(" 8px "),
        }}
      >
        {layout.ids.map((id, i) => (
          <section
            key={id}
            className={`workspace-panel ${fullscreen === id ? "widget-fullscreen" : ""} ${dragging === i ? "is-dragging" : ""}`}
            style={{
              gridColumn: (i % layout.columns) * 2 + 1,
              gridRow: Math.floor(i / layout.columns) * 2 + 1,
            }}
            onDragOver={(e) => {
              if (editable) e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (editable && dragging !== null)
                save(reorder(layout, dragging, i));
              setDragging(null);
            }}
          >
            <header
              className="widget-header"
              draggable={editable && !fullscreen}
              onDragStart={(e) => {
                setDragging(i);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(i));
              }}
              onDragEnd={() => setDragging(null)}
            >
              <h2>{widgetDefinitions[id].name}</h2>
              <div className="widget-header-actions">
                {editable && (
                  <>
                    <button
                      aria-label={`${widgetDefinitions[id].name} 앞으로 이동`}
                      disabled={i === 0}
                      onClick={() => save(reorder(layout, i, i - 1))}
                    >
                      ‹
                    </button>
                    <button
                      aria-label={`${widgetDefinitions[id].name} 뒤로 이동`}
                      disabled={i === layout.ids.length - 1}
                      onClick={() => save(reorder(layout, i, i + 1))}
                    >
                      ›
                    </button>
                    <button
                      aria-label={`${widgetDefinitions[id].name} 메뉴`}
                      aria-expanded={menu === id}
                      onClick={() => setMenu(menu === id ? null : id)}
                    >
                      <Image src={infoIcon} alt="" width={20} height={20} />
                    </button>
                  </>
                )}
                {fullscreen === id && (
                  <button
                    aria-label="전체화면 닫기"
                    onClick={() => setFullscreen(null)}
                  >
                    ×
                  </button>
                )}
              </div>
              {menu === id && (
                <>
                  <button
                    className="widget-menu-dismiss"
                    aria-label="위젯 메뉴 닫기"
                    onClick={() => setMenu(null)}
                  />
                  <div
                    className="widget-menu"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setMenu(null);
                    }}
                  >
                    <button
                      onClick={() => {
                        setMenu(null);
                        setSettings(true);
                      }}
                    >
                      위젯 추가 <span>＋</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenu(null);
                        setFullscreen(fullscreen === id ? null : id);
                      }}
                    >
                      전체화면 <span>↗</span>
                    </button>
                  </div>
                </>
              )}
            </header>
            <div className="widget-content">{renderWidget(id)}</div>
          </section>
        ))}
        {editable && (
          <>
            {Array.from({ length: layout.columns - 1 }, (_, index) => (
              <div
                key={`col-${index}`}
                className="workspace-splitter vertical"
                role="separator"
                aria-label={`열 ${index + 1} 너비 조절`}
                aria-orientation="vertical"
                aria-valuenow={Math.round(layout.widths[index])}
                tabIndex={0}
                style={{
                  gridColumn: index * 2 + 2,
                  gridRow: `1 / ${rows * 2}`,
                }}
                onPointerDown={(e) => startResize(e, "x", index)}
                onPointerMove={moveResize}
                onPointerUp={() => {
                  resize.current = null;
                }}
                onPointerCancel={() => {
                  resize.current = null;
                }}
                onKeyDown={(e) => {
                  if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
                    e.preventDefault();
                    keyboardResize("x", index, e.key === "ArrowRight" ? 2 : -2);
                  }
                }}
              />
            ))}
            {Array.from({ length: rows - 1 }, (_, index) => (
              <div
                key={`row-${index}`}
                className="workspace-splitter horizontal"
                role="separator"
                aria-label={`행 ${index + 1} 높이 조절`}
                aria-orientation="horizontal"
                aria-valuenow={layout.heights[index]}
                tabIndex={0}
                style={{
                  gridRow: index * 2 + 2,
                  gridColumn: `1 / ${layout.columns * 2}`,
                }}
                onPointerDown={(e) => startResize(e, "y", index)}
                onPointerMove={moveResize}
                onPointerUp={() => {
                  resize.current = null;
                }}
                onPointerCancel={() => {
                  resize.current = null;
                }}
                onKeyDown={(e) => {
                  if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                    e.preventDefault();
                    keyboardResize(
                      "y",
                      index,
                      e.key === "ArrowDown" ? 15 : -15,
                    );
                  }
                }}
              />
            ))}
          </>
        )}
      </div>
      {settings && editable && (
        <WidgetSettings
          layout={layout}
          onClose={() => setSettings(false)}
          onApply={(ids, columns) => {
            save(arrange(ids, columns));
            setFullscreen(null);
            setSettings(false);
          }}
        />
      )}
    </div>
  );
}
