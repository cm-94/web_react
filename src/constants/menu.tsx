export const menu = {
  "1000": {
    screenId: "home1000",
    screenName: "홈",
    icon: "home",
    isMain: true,
    resizable: false,
  },
  "2000": {
    screenId: "watch2000",
    screenName: "찜한주식",
    icon: "star",
    isMain: true,
    resizable: false,
  },
  "3000": {
    screenId: "trading3000",
    screenName: "트레이딩",
    icon: "chart",
    isMain: true,
    resizable: true,
  },
  "4000": {
    screenId: "prime4000",
    screenName: "PRIME CLUB",
    icon: "shield",
    isMain: true,
    resizable: false,
  },
  "5000": {
    screenId: "assets5000",
    screenName: "내자산",
    icon: "pie",
    isMain: true,
    resizable: false,
  },
} as const;
export type MenuCode = keyof typeof menu;
export type ScreenId = (typeof menu)[MenuCode]["screenId"];
export const menuCodes = Object.keys(menu) as MenuCode[];
/**
 * 메뉴 정의에 등록된 화면 진입 코드인지 확인합니다.
 * @param value - 검증할 메뉴 코드 문자열.
 * @returns 등록된 코드이면 true.
 */
export function isMenuCode(value: string): value is MenuCode {
  return Object.prototype.hasOwnProperty.call(menu, value);
}
