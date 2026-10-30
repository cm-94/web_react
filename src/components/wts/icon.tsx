const paths: Record<string, string> = {
  home: "M3 10 12 3l9 7v11h-6v-7H9v7H3Z",
  star: "m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",
  chart:
    "M3 13h4l3-6 4 12 3-7h4 M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3",
  shield: "m12 2 8 4v8l-8 8-8-8V6Z M9 12l2 2 4-5",
  pie: "M12 3v9h9 M9 4a9 9 0 1 0 11 11",
  search: "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16m6-2 6 7",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M9 3l1-2h4l1 2 3 2 3 1v4l-2 2 2 2v4l-3 1-3 2-1 2h-4l-1-2-3-2-3-1v-4l2-2-2-2V6l3-1Z",
  sun: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10 M12 0v3m0 18v3M0 12h3m18 0h3M3 3l2 2m14 14 2 2M3 21l2-2M19 5l2-2",
  user: "M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10 M3 23v-2a9 9 0 0 1 18 0v2",
  download: "M12 2v13m-5-5 5 5 5-5 M3 16v5h18v-5",
  sound: "m3 9 5 0 6-5v16l-6-5H3Z M18 7a8 8 0 0 1 0 10",
};
/**
 * 이름에 해당하는 공통 선형 아이콘을 렌더링합니다.
 * @param props - 아이콘 설정.
 * @param props.name - 아이콘 이름. 미등록 이름은 차트 아이콘으로 대체합니다.
 * @param props.size - 아이콘 너비와 높이(픽셀).
 * @returns 장식용 SVG 아이콘.
 */
export default function Icon({
  name,
  size = 23,
}: {
  name: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.chart} />
    </svg>
  );
}
