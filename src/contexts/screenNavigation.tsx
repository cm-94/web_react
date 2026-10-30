"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { MenuCode } from "@/constants/menu";
type Navigation = { code: MenuCode; openScreen: (code: MenuCode) => void };
const ScreenNavigationContext = createContext<Navigation | null>(null);
/**
 * 선택한 메뉴 코드를 하위 화면에 공유합니다. 최초 진입과 새로고침 시 홈 화면에서 시작합니다.
 * @param props - Provider 구성.
 * @param props.children - 화면 이동 상태를 공유할 하위 컴포넌트.
 * @returns 화면 이동 Context Provider.
 */
export function ScreenNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [code, setCode] = useState<MenuCode>("1000");
  return (
    <ScreenNavigationContext value={{ code, openScreen: setCode }}>
      {children}
    </ScreenNavigationContext>
  );
}
/**
 * 현재 메뉴 코드와 화면 전환 함수를 가져옵니다. openScreen은 콘텐츠 영역의 화면 코드만 변경합니다.
 * @returns 현재 code와 openScreen 함수.
 * @throws Provider 외부에서 호출하면 오류가 발생합니다.
 */
export function useScreenNavigation() {
  const navigation = useContext(ScreenNavigationContext);
  if (!navigation) throw new Error("ScreenNavigationProvider is required.");
  return navigation;
}
