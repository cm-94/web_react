import "server-only";
import { z } from "zod";

// NODE_ENV는 Next.js가 관리합니다. 배포 환경은 PROFILE로 구분합니다.
const ProfileSchema = z.enum([
  "local",
  "dev",
  "alpha",
  "test",
  "mini",
  "stage",
  "real",
]);
export type Profile = z.infer<typeof ProfileSchema>;
export const PROFILE: Profile = ProfileSchema.parse(
  process.env.PROFILE ?? "local",
);

/**
 * 서버 호출에 사용할 기본 URL의 Zod 스키마를 생성합니다.
 * 앞뒤 공백은 제거하고 HTTP(S) 이외의 프로토콜, 인증정보, 쿼리와 해시는 거부합니다.
 * @returns 서버 API 기본 주소 검증 스키마.
 */
const urlReq = () =>
  z
    .string()
    .trim()
    .url()
    .refine((value) => {
      const url = new URL(value);
      return (
        ["http:", "https:"].includes(url.protocol) &&
        !url.username &&
        !url.password &&
        !url.search &&
        !url.hash
      );
    }, "HTTP(S) base URL without credentials, query, or hash is required.");

export const EnvSchema = z.object({
  DOMAIN: urlReq(),
  BE_DOMESTIC_API_URL: urlReq(),
  BE_FOREIGN_API_URL: urlReq(),
  BE_ASSET_API_URL: urlReq(),
  BE_AUTH_API_URL: urlReq(),
  BE_TOKEN: z.string().optional(),
});
export type TEnv = z.infer<typeof EnvSchema>;

// 주소가 확정되면 프로필별 객체에 정의할 수 있습니다.
// 토큰은 소스에 기록하지 않고 서버 환경변수에서만 가져옵니다.
const envObject = {
  local: {
    DOMAIN: process.env.DOMAIN ?? "http://localhost:3000",
    BE_DOMESTIC_API_URL:
      process.env.BE_DOMESTIC_API_URL ?? "http://localhost:8080",
    BE_FOREIGN_API_URL:
      process.env.BE_FOREIGN_API_URL ?? "http://localhost:8080",
    BE_ASSET_API_URL: process.env.BE_ASSET_API_URL ?? "http://localhost:8080",
    BE_AUTH_API_URL: process.env.BE_AUTH_API_URL ?? "http://localhost:8080",
    BE_TOKEN: process.env.BE_TOKEN,
  },
  dev: {
    DOMAIN: process.env.DEV_DOMAIN,
    BE_DOMESTIC_API_URL: process.env.DEV_BE_DOMESTIC_API_URL,
    BE_FOREIGN_API_URL: process.env.DEV_BE_FOREIGN_API_URL,
    BE_ASSET_API_URL: process.env.DEV_BE_ASSET_API_URL,
    BE_AUTH_API_URL: process.env.DEV_BE_AUTH_API_URL,
    BE_TOKEN: process.env.DEV_BE_TOKEN,
  },
  alpha: {
    DOMAIN: process.env.ALPHA_DOMAIN,
    BE_DOMESTIC_API_URL: process.env.ALPHA_BE_DOMESTIC_API_URL,
    BE_FOREIGN_API_URL: process.env.ALPHA_BE_FOREIGN_API_URL,
    BE_ASSET_API_URL: process.env.ALPHA_BE_ASSET_API_URL,
    BE_AUTH_API_URL: process.env.ALPHA_BE_AUTH_API_URL,
    BE_TOKEN: process.env.ALPHA_BE_TOKEN,
  },
  test: {
    DOMAIN: process.env.TEST_DOMAIN,
    BE_DOMESTIC_API_URL: process.env.TEST_BE_DOMESTIC_API_URL,
    BE_FOREIGN_API_URL: process.env.TEST_BE_FOREIGN_API_URL,
    BE_ASSET_API_URL: process.env.TEST_BE_ASSET_API_URL,
    BE_AUTH_API_URL: process.env.TEST_BE_AUTH_API_URL,
    BE_TOKEN: process.env.TEST_BE_TOKEN,
  },
  mini: {
    DOMAIN: process.env.MINI_DOMAIN,
    BE_DOMESTIC_API_URL: process.env.MINI_BE_DOMESTIC_API_URL,
    BE_FOREIGN_API_URL: process.env.MINI_BE_FOREIGN_API_URL,
    BE_ASSET_API_URL: process.env.MINI_BE_ASSET_API_URL,
    BE_AUTH_API_URL: process.env.MINI_BE_AUTH_API_URL,
    BE_TOKEN: process.env.MINI_BE_TOKEN,
  },
  stage: {
    DOMAIN: process.env.STAGE_DOMAIN,
    BE_DOMESTIC_API_URL: process.env.STAGE_BE_DOMESTIC_API_URL,
    BE_FOREIGN_API_URL: process.env.STAGE_BE_FOREIGN_API_URL,
    BE_ASSET_API_URL: process.env.STAGE_BE_ASSET_API_URL,
    BE_AUTH_API_URL: process.env.STAGE_BE_AUTH_API_URL,
    BE_TOKEN: process.env.STAGE_BE_TOKEN,
  },
  real: {
    DOMAIN: process.env.REAL_DOMAIN,
    BE_DOMESTIC_API_URL: process.env.REAL_BE_DOMESTIC_API_URL,
    BE_FOREIGN_API_URL: process.env.REAL_BE_FOREIGN_API_URL,
    BE_ASSET_API_URL: process.env.REAL_BE_ASSET_API_URL,
    BE_AUTH_API_URL: process.env.REAL_BE_AUTH_API_URL,
    BE_TOKEN: process.env.REAL_BE_TOKEN,
  },
} satisfies Record<Profile, Record<keyof TEnv, string | undefined>>;

const parsed = EnvSchema.safeParse(envObject[PROFILE]);
if (!parsed.success) {
  // 잘못된 값이나 토큰 원문을 오류 메시지에 포함하지 않습니다.
  const fields = [
    ...new Set(parsed.error.issues.map((issue) => issue.path.join("."))),
  ];
  throw new Error(
    `Invalid environment configuration (${PROFILE}): ${fields.join(", ")}`,
  );
}
/** 선택한 PROFILE의 검증된 서버 전용 설정. 클라이언트 컴포넌트에 전달하지 않습니다. */
export const env: TEnv = parsed.data;
export type ApiService = Exclude<keyof TEnv, "DOMAIN" | "BE_TOKEN">;
