import type { MetadataRoute } from "next";
/**
 * 웹과 설치형 앱이 동일한 시작 주소를 사용하도록 PWA 설치 정보를 제공합니다.
 * @returns 앱 식별자, 이름, 아이콘과 독립 창 실행 설정.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "M wide WTS",
    short_name: "M wide",
    description: "나만의 웹 트레이딩 워크스페이스",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#1f1e26",
    theme_color: "#1f1e26",
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/app-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/app-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/app-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
