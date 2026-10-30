import "server-only";

import { env, type ApiService } from "@/constants/environments";

/** BE HTTP 오류의 상태 코드와 해석한 응답 본문을 보관합니다. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly data: unknown,
  ) {
    super(`BE API request failed (${status}).`);
    this.name = "ApiError";
  }
}

type ApiOptions = Omit<RequestInit, "method" | "body" | "redirect"> & {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  json?: unknown;
  service?: ApiService;
};

/**
 * 선택한 서버 전용 BE 기본 주소에 HTTP 요청을 전송합니다. 기본 주소 밖 이동과 리다이렉트를 차단하고 응답 형식에 맞게 본문을 해석합니다.
 * @param path - BE 기본 주소 하위의 API 경로.
 * @param options - HTTP 메서드, JSON 본문, 서비스 키 및 fetch 옵션.
 * @returns 응답 본문. 빈 응답은 undefined이며 제네릭 타입은 런타임 검증을 수행하지 않습니다.
 * @throws HTTP 오류는 ApiError, 잘못된 경로·본문·JSON 또는 네트워크 오류는 해당 오류를 전달합니다.
 */
export async function apiRequest<T = unknown>(
  path: string,
  {
    method = "GET",
    json,
    headers,
    service = "BE_DOMESTIC_API_URL",
    ...options
  }: ApiOptions = {},
): Promise<T | undefined> {
  const apiDomain = env[service];
  const base = new URL(`${apiDomain.replace(/\/+$/, "")}/`);
  const url = new URL(path.replace(/^\/+/, ""), base);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) {
    throw new Error("API path must stay within the configured BE base URL.");
  }
  if (method === "GET" && json !== undefined) {
    throw new Error("GET requests cannot have a JSON body.");
  }

  const requestHeaders = new Headers(headers);
  if (json !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    method,
    headers: requestHeaders,
    body: json === undefined ? undefined : JSON.stringify(json),
    redirect: "error",
  });

  const text = await response.text();
  let data: unknown = text || undefined;
  if (text && response.headers.get("content-type")?.includes("json")) {
    try {
      data = JSON.parse(text);
    } catch {
      if (response.ok) throw new Error("BE API returned invalid JSON.");
    }
  }
  if (!response.ok) throw new ApiError(response.status, data);
  return data as T | undefined;
}
