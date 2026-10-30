"use client";
import { useEffect, useRef, useState } from "react";
import {
  widgetDefinitions,
  type WidgetId,
  type WorkspaceLayout,
} from "./layout";
/**
 * 위젯 분류와 선택 순서, 한 행의 열 수를 편집합니다. 완료 시에만 부모에 반영하고 취소 시에는 변경을 버립니다.
 * @param props - 팝업 구성.
 * @param props.layout - 편집 시작 시 현재 배치.
 * @param props.onApply - 선택한 화면 코드와 열 수를 전달받는 적용 함수.
 * @param props.onClose - 변경을 적용하지 않고 닫는 함수.
 * @returns 위젯 설정 모달.
 */
export default function WidgetSettings({
  layout,
  onApply,
  onClose,
}: {
  layout: WorkspaceLayout;
  onApply: (ids: WidgetId[], columns: number) => void;
  onClose: () => void;
}) {
  const [ids, setIds] = useState<WidgetId[]>(layout.ids);
  const [category, setCategory] = useState("현재가");
  const [columns, setColumns] = useState(layout.columns);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    return () => previous?.focus();
  }, []);
  const shown = (Object.keys(widgetDefinitions) as WidgetId[]).filter(
    (id) => widgetDefinitions[id].category === category,
  );
  /**
   * 선택한 위젯을 해제하거나 선택 목록의 마지막 순서에 추가합니다.
   * @param id - 선택을 전환할 하위 화면 코드.
   */
  function toggle(id: WidgetId) {
    setIds((current) =>
      current.includes(id) ? current.filter((v) => v !== id) : [...current, id],
    );
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="widget-settings"
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="widget-settings-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Tab") {
            const elements = dialog.current?.querySelectorAll<HTMLElement>(
              "button:not(:disabled), input, select",
            );
            if (!elements?.length) return;
            const first = elements[0],
              last = elements[elements.length - 1];
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
        <h2 id="widget-settings-title">위젯 설정</h2>
        <button
          className="dialog-close"
          aria-label="설정 닫기"
          onClick={onClose}
        >
          ×
        </button>
        <div className="widget-settings-body">
          <nav aria-label="위젯 분류">
            {["현재가", "주문/잔고", "투자정보"].map((name) => (
              <button
                key={name}
                className={category === name ? "active" : ""}
                onClick={() => setCategory(name)}
              >
                {name}
              </button>
            ))}
          </nav>
          <div className="widget-options">
            <label className="select-all">
              <input
                type="checkbox"
                checked={shown.every((id) => ids.includes(id))}
                onChange={(e) =>
                  setIds((current) =>
                    e.target.checked
                      ? [
                          ...current,
                          ...shown.filter((id) => !current.includes(id)),
                        ]
                      : current.filter((id) => !shown.includes(id)),
                  )
                }
              />{" "}
              현재 분류 전체선택
            </label>
            {shown.map((id) => (
              <label key={id}>
                <input
                  type="checkbox"
                  checked={ids.includes(id)}
                  onChange={() => toggle(id)}
                />
                <span>
                  <strong>{widgetDefinitions[id].name}</strong>
                  <small>{widgetDefinitions[id].description}</small>
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="selection-order">
          <p>선택 순서대로 왼쪽 → 오른쪽, 다음 행에 배치됩니다.</p>
          <div>
            {ids.map((id, i) => (
              <button
                key={id}
                onClick={() => toggle(id)}
                aria-label={`${widgetDefinitions[id].name} 선택 해제`}
              >
                {i + 1}. {widgetDefinitions[id].name} ×
              </button>
            ))}
          </div>
        </div>
        <label className="column-select">
          한 행의 열 수{" "}
          <select
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
          >
            <option value={1}>1열</option>
            <option value={2}>2열</option>
            <option value={3}>3열</option>
          </select>
        </label>
        <div className="settings-actions">
          <button onClick={onClose}>취소</button>
          <button disabled={!ids.length} onClick={() => onApply(ids, columns)}>
            완료
          </button>
        </div>
        {!ids.length && (
          <p role="status" className="muted">
            최소 한 개의 위젯을 선택해 주세요.
          </p>
        )}
      </div>
    </div>
  );
}
