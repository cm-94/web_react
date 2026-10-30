This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 초기 프로젝트 구조

```text
src/
├── app/          # 페이지, 레이아웃, Route Handler
├── assets/       # 코드에서 import하는 이미지·폰트 (URL로 제공할 파일은 public/)
├── components/   # 공통 UI 컴포넌트
├── constants/    # 상수, 서버 환경 설정 environments.ts
├── contexts/     # React Context
├── hooks/        # 커스텀 Hook
├── models/       # 도메인 데이터 모델
├── query/        # 향후 TanStack Query 관련 모듈
├── scss/         # 향후 SCSS 스타일
├── server/       # 서버 전용 API 호출·비즈니스 로직
├── types/        # 공통 TypeScript 타입
└── utils/        # 공통 유틸리티
```

빈 폴더는 `.gitkeep`으로 보존합니다. TanStack Query, Prettier,
Stylelint는 아직 설치하지 않았습니다. 해당 기능을 도입할 때 패키지와 설정을
함께 추가합니다. `proxy.ts`, `instrumentation.ts`, Docker 설정도 사용할 때
추가합니다.

### 환경 설정

로컬 설정 파일 `.env`가 없는 새 체크아웃에서는 `.env.example`을 `.env`로
복사합니다. `.env`와 `.env.local`은 Git에서 제외되며 `.env.example`만 공유합니다.

- `PROFILE`: `local`, `dev`, `alpha`, `test`, `mini`, `stage`, `real` 중 선택합니다. 기본값은 `local`이며 잘못된 값은 오류로 처리합니다.
- `environments.ts`의 `envObject`에서 프로필별 주소를 관리하고 Zod 스키마로 검증한 `env`를 내보냅니다.
- `local`에서는 `DOMAIN`, `BE_DOMESTIC_API_URL`, `BE_FOREIGN_API_URL`, `BE_ASSET_API_URL`, `BE_AUTH_API_URL`, `BE_TOKEN`을 읽습니다. 주소를 생략하면 프런트는 3000, BE는 8080의 localhost를 사용합니다.
- 나머지 환경은 `DEV_DOMAIN`, `DEV_BE_DOMESTIC_API_URL`처럼 프로필 대문자 접두사를 사용합니다. `.env.example`에 환경별 키를 정리했습니다.
- 선택한 프로필의 URL은 모두 필요합니다. 주소 공백을 제거하고 HTTP(S) 형식을 검증합니다. `BE_TOKEN`은 선택 사항이며 자동으로 요청 헤더에 붙이지 않습니다.
- `NODE_ENV`는 Next.js가 관리합니다. `dotenv/config`는 추가하지 않습니다.
- 기존 `APP_ENV`, `LOCAL_API_DOMAIN`, `DEV_API_DOMAIN`, `STG_API_DOMAIN`, `PROD_API_DOMAIN`은 사용하지 않습니다. 기존 `.env`는 위 키로 옮겨 주세요.
- `.env.local`을 만들면 `.env`보다 우선합니다. 변경 후 개발 서버를 재시작합니다.
- `.nvmrc`는 초기 구성 시 로컬 Node.js 버전을 기록했습니다. `nvm use`로 적용합니다.

### BE API 호출

`src/constants/environments.ts`와 `src/server/api.ts`는 서버 전용입니다.
Server Component, Server Action 또는 Route Handler에서만 import합니다.

```ts
import { apiRequest } from "@/server/api";

const result = await apiRequest<{ id: string }>("/users/1");
const overseas = await apiRequest("/stocks", {
  service: "BE_FOREIGN_API_URL",
});
const created = await apiRequest<{ id: string }>("/users", {
  method: "POST",
  json: { name: "홍길동" },
});
```

`GET`, `POST`, `PUT`, `PATCH`, `DELETE`를 지원합니다. HTTP 오류는
`ApiError`의 `status`, `data`로 확인하고 네트워크 오류는 호출부에서 처리합니다.
응답이 비어 있으면 `undefined`를 반환하며, 제네릭 타입은 런타임 검증을 대신하지
않습니다. 기본 캐시는 `no-store`이고 리다이렉트는 허용하지 않습니다.

Client Component에서는 `/api/...`의 Route Handler를 호출하고 해당 핸들러가
`apiRequest`를 사용하도록 구성합니다. 실제 BE 엔드포인트가 정해지면 기능별
핸들러와 입력 검증·인증을 추가합니다. 서버 주소나 BE 오류 원문은 클라이언트에
그대로 반환하지 않습니다. 현재는 실제 BE 호출이나 공개 API 경로를 추가하지 않았습니다.

### 검증

```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
pnpm dev
```


## WTS 화면 코드와 메뉴 관리

메인 주소는 `/`로 고정합니다. 메뉴는 URL이나 브라우저 방문 기록을 변경하지 않고
내부 화면 코드 상태를 변경합니다. 상단·왼쪽 메뉴·하단과 `section#wts-main` 요소를
유지하고 section 내부 화면만 교체합니다. 새로고침과 앱 재실행 시 홈부터 시작합니다.
메뉴 이동 시 화면 내부 상태는 초기화되지만 저장한 작업공간 배치는 유지됩니다.

| 메뉴 코드 | 화면 코드 | 파일 |
| --- | --- | --- |
| 1000 | home1000 | src/app/screens/home/home1000.tsx |
| 2000 | watch2000 | src/app/screens/watch/watch2000.tsx |
| 3000 | trading3000 | src/app/screens/trading/trading3000.tsx |
| 4000 | prime4000 | src/app/screens/prime/prime4000.tsx |
| 5000 | assets5000 | src/app/screens/assets/assets5000.tsx |

- `src/constants/menu.tsx`: 메뉴 코드, 화면 코드, 메뉴명, 아이콘 정의.
- `src/components/menuManager.tsx`: 메뉴 활성화, 화면 동적 로딩과 공통 셸.
- `src/components/wts/`: 더미 데이터와 시세·뉴스·차트·모의주문 공통 컴포넌트.
- `src/scss/_theme.scss`: RGB 색상 토큰과 다크/라이트 테마.
- `src/scss/_typography.scss`: 폰트, 크기, 굵기 토큰.
- `src/scss/wts.scss`: 공통 셸, 화면 스타일, 반응형 배치.

화면 추가 시 `src/app/screens/기능명/화면코드.tsx`를 생성하고 메뉴 정의와
`menuManager.tsx`의 `screens` 매핑에 등록합니다. `page.tsx`라는 이름을 사용하지
않으므로 각 화면 파일 자체가 Next.js의 별도 URL 경로가 되지는 않습니다.

화면은 KB WTS 참고 이미지 기반의 개발용 데모입니다. 모든 시세·뉴스·계좌는
고정 더미 데이터이며 주문과 로그인은 실제 서비스에 연결되지 않습니다.
SCSS를 위해 Sass를 개발 의존성으로 설치했습니다.

### 커스텀 트레이딩 작업공간

트레이딩(메뉴 코드 `3000`)의 속성은 `isMain: true`, `resizable: true`입니다.
공통 `Workspace`는 두 값이 모두 참일 때 편집 기능을 제공합니다.

- 패널의 점 세 개 버튼(`src/assets/images/common/icon_info.png`)을 누르면
  **위젯 추가 / 전체화면** 메뉴가 열립니다.
- 위젯 설정에서 하위 화면을 체크한 순서대로 왼쪽부터 오른쪽, 다음 행 순서로
  배치합니다. 한 행에 1~3열을 지정할 수 있습니다. 취소는 배치에 반영하지 않습니다.
- 패널 제목을 다른 패널로 드래그해 순서를 변경합니다. 제목 옆 화살표로도 이동할 수 있습니다.
- 패널 사이의 경계선을 드래그해 열 너비와 행 높이를 변경합니다. 경계선에
  키보드 포커스를 두고 방향키로도 조절할 수 있습니다. 열 너비는 같은 열의 패널에,
  행 높이는 같은 행의 패널에 함께 적용됩니다.
- 배치는 화면 코드별 `localStorage`에 저장하며 메뉴 재진입·새로고침 시 복원합니다.
  저장소 사용이 제한되면 현재 페이지 메모리에서 유지합니다. **기본 배치**로 초기화합니다.
- 트레이딩 하위 화면은 `trading3001`~`trading3007`입니다. 등록 정보는
  `src/components/workspace/layout.ts`, 렌더링 연결은 `trading3000.tsx`에 있습니다.
- 작은 화면에서는 작업공간을 가로로 스크롤합니다. 마우스 드래그 대신
  패널 제목의 화살표와 경계선 방향키를 사용할 수 있습니다.

배치 로직 검증: `node --test tests/workspace-layout.test.mjs`


### 앱 설치와 웹 접속

웹과 설치형 앱은 동일한 Next.js 코드와 배포 서버를 사용합니다.
운영 환경은 HTTPS로 제공하고, 개발 시에는 `http://localhost:3000`에서 확인합니다.

- `src/app/manifest.ts`: 앱 이름, 식별자, `/` 시작 주소, 범위, `standalone` 창 설정.
- `public/icons/`: 192/512 PNG, maskable 아이콘, Apple 홈 화면 아이콘.
- `src/components/pwa/installApp.tsx`: 상단 **앱 다운로드** 버튼과 설치 안내.
- `src/contexts/screenNavigation.tsx`: URL을 사용하지 않는 내부 메뉴 전환.
  하위 화면에서는 `useScreenNavigation().openScreen("3000")`처럼 호출합니다.

Chrome이 `beforeinstallprompt`를 제공하면 다운로드 버튼에서 브라우저의 실제 설치 창을
엽니다. 설치 여부는 사용자가 브라우저에서 승인합니다. 지원되지 않거나 설치 이벤트가
아직 오지 않은 경우 브라우저 메뉴의 설치 방법을 안내합니다. 앱으로 실행 중이면 버튼은
**앱 실행 중**으로 표시됩니다. 웹 탭에서도 모든 기능을 계속 사용할 수 있습니다.

Mac에서는 Chrome이 앱 실행용 항목을 Chrome 앱 폴더 등에 생성합니다. 별도의 `.dmg`나
설치 파일을 서버에서 내려주는 방식이 아닙니다. 설치 창의 문구와 앱 항목의 위치는 OS와
브라우저 버전에 따라 달라질 수 있습니다.

서비스 워커와 오프라인 캐시는 추가하지 않았습니다. 화면과 API는 온라인 연결을 사용하고,
시세·계좌·주문 응답을 오프라인 캐시에 저장하지 않습니다. 서버 배포 후 앱을 다시 열거나
새로고침하면 새 화면을 불러오며, 이미 열려 있는 화면의 코드를 강제로 교체하지 않습니다.

설치 안내 참고: [Chrome 웹 앱 사용하기](https://support.google.com/chrome/answer/9658361?hl=ko).

### 화면별 스타일

화면 전용 SCSS는 화면 파일과 같은 폴더에 `화면코드.module.scss`로 작성합니다.
Next.js의 CSS Module 파일명 규칙은 `.module.scss`입니다.

```tsx
import classNames from "classnames/bind";
import styles from "./trading3001.module.scss";

const cx = classNames.bind(styles);

<strong className={cx("quote-price")}>155,500원</strong>
```

홈·찜한주식·PRIME·내자산과 트레이딩 종목개요·차트·호가는 화면별 모듈로
관리합니다. 자체 스타일 없이 공통 위젯을 조립하는 화면은 불필요한 모듈을 만들지 않습니다.
`wts.scss`에는 공통 프레임·작업공간·재사용 UI 스타일을 유지하며 색상과 폰트는
기존 테마·타이포그래피 토큰을 사용합니다. 공통 주문 위젯의 가격 스타일은
`src/components/wts/widgets.module.scss`에 있습니다.


### 소스 주석 규칙

- 더미 화면의 기본 함수 바로 위에 `TODO: 화면명 더미화면. 추후 메뉴에 맞춰 수정 필요`를 기록합니다.
- 공통 함수는 JSDoc으로 역할을 설명하고 필요에 따라 `@param`, `@returns`, `@throws`를 작성합니다.
- 실제 동작의 범위를 명시합니다. 더미 차트는 시세를 요청하지 않고 모의주문은 실제 주문을 전송하지 않습니다.
