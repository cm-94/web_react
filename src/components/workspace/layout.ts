export const widgetDefinitions = {
  trading3001: {
    name: "종목개요",
    category: "현재가",
    description: "현재가와 기본 종목정보를 한눈에 확인할 수 있어요.",
  },
  trading3002: {
    name: "차트",
    category: "현재가",
    description: "기간별 가격 추이를 차트로 확인할 수 있어요.",
  },
  trading3003: {
    name: "호가",
    category: "현재가",
    description: "매수·매도 호가와 잔량을 확인할 수 있어요.",
  },
  trading3004: {
    name: "찜한주식",
    category: "투자정보",
    description: "관심 종목을 선택하고 시세를 확인할 수 있어요.",
  },
  trading3005: {
    name: "주문내역",
    category: "주문/잔고",
    description: "모의 주문내역과 잔고를 확인할 수 있어요.",
  },
  trading3006: {
    name: "주문",
    category: "주문/잔고",
    description: "모의 매수·매도 주문을 입력할 수 있어요.",
  },
  trading3007: {
    name: "뉴스",
    category: "투자정보",
    description: "시장 주요 뉴스와 투자정보를 확인할 수 있어요.",
  },
} as const;
export type WidgetId = keyof typeof widgetDefinitions;
export type WorkspaceLayout = {
  ids: WidgetId[];
  columns: number;
  widths: number[];
  heights: number[];
};
export const defaultLayout: WorkspaceLayout = {
  ids: [
    "trading3001",
    "trading3002",
    "trading3003",
    "trading3004",
    "trading3005",
    "trading3006",
  ],
  columns: 3,
  widths: [24, 52, 24],
  heights: [430, 390],
};
/**
 * 선택 순서를 유지하며 중복을 제거하고 행 우선 배치와 초기 크기를 생성합니다.
 * @param ids - 사용자가 선택한 순서의 하위 화면 코드.
 * @param columns - 한 행의 열 수. 1~3의 정수로 보정합니다.
 * @returns 초기 열 너비와 행 높이를 포함한 배치.
 * @throws 선택한 화면이 없으면 오류가 발생합니다.
 */
export function arrange(ids: WidgetId[], columns: number): WorkspaceLayout {
  if (!ids.length) throw new Error("At least one widget is required.");
  const unique = [...new Set(ids)];
  const count = Math.max(1, Math.min(3, Math.floor(columns) || 1));
  return {
    ids: unique,
    columns: count,
    widths: Array(count).fill(100 / count),
    heights: Array(Math.ceil(unique.length / count)).fill(380),
  };
}
/**
 * 저장된 배치 JSON을 검증하고 복원합니다. 손상된 데이터나 지원하지 않는 화면·크기는 기본 배치로 대체합니다.
 * @param raw - 저장소에서 읽은 배치 JSON 문자열.
 * @returns 검증된 배치 또는 기본 배치.
 */
export function parseLayout(raw: string): WorkspaceLayout {
  try {
    const value = JSON.parse(raw) as WorkspaceLayout;
    if (
      !Array.isArray(value.ids) ||
      value.ids.length < 1 ||
      value.ids.length > 7 ||
      new Set(value.ids).size !== value.ids.length ||
      value.ids.some(
        (id) => !Object.prototype.hasOwnProperty.call(widgetDefinitions, id),
      )
    )
      return defaultLayout;
    if (
      ![1, 2, 3].includes(value.columns) ||
      !Array.isArray(value.widths) ||
      value.widths.length !== value.columns ||
      value.widths.some((n) => !Number.isFinite(n) || n < 8) ||
      !Array.isArray(value.heights) ||
      value.heights.length !== Math.ceil(value.ids.length / value.columns) ||
      value.heights.some((n) => !Number.isFinite(n) || n < 180 || n > 1200)
    )
      return defaultLayout;
    return value;
  } catch {
    return defaultLayout;
  }
}
/**
 * 기존 크기를 유지하면서 패널 하나를 지정한 순서로 이동합니다. 원본 배치는 변경하지 않습니다.
 * @param layout - 현재 배치.
 * @param from - 이동할 패널의 0부터 시작하는 위치.
 * @param to - 이동 후 위치.
 * @returns 순서가 변경된 배치. 위치가 유효하지 않으면 원본을 반환합니다.
 */
export function reorder(
  layout: WorkspaceLayout,
  from: number,
  to: number,
): WorkspaceLayout {
  if (
    from < 0 ||
    to < 0 ||
    from >= layout.ids.length ||
    to >= layout.ids.length
  )
    return layout;
  const ids = [...layout.ids];
  const [id] = ids.splice(from, 1);
  ids.splice(to, 0, id);
  return { ...layout, ids };
}

/**
 * 인접한 두 영역의 크기 합계를 유지하면서 양쪽 최소·최대 크기를 보장합니다.
 * @param values - 열 너비 또는 행 높이 배열.
 * @param index - 조절할 첫 번째 영역의 위치. 다음 영역과 크기를 나눕니다.
 * @param delta - 첫 번째 영역에 더할 크기.
 * @param min - 각 영역의 최소 크기.
 * @param max - 각 영역의 최대 크기. 기본값은 제한 없음.
 * @returns 크기가 조절된 새 배열.
 */
export function resizePair(
  values: number[],
  index: number,
  delta: number,
  min: number,
  max = Infinity,
): number[] {
  const next = [...values];
  const total = next[index] + next[index + 1];
  next[index] = Math.max(
    Math.max(min, total - max),
    Math.min(Math.min(max, total - min), next[index] + delta),
  );
  next[index + 1] = total - next[index];
  return next;
}
