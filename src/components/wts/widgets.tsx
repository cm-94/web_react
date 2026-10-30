"use client";
import classNames from "classnames/bind";
import styles from "./widgets.module.scss";
import { useState } from "react";
import { stocks, news } from "./data";
const cx = classNames.bind(styles);
/**
 * 고정 수식으로 더미 시세 추이를 표시합니다. 실제 시세 요청은 수행하지 않습니다.
 * @param props - 차트 옵션.
 * @param props.seed - 더미 패턴을 구분하는 값.
 * @param props.area - 차트 아래 영역 채우기 여부.
 * @returns 더미 추이 SVG.
 */
export function Sparkline({
  seed = 0,
  area = false,
}: {
  seed?: number;
  area?: boolean;
}) {
  const points = Array.from(
    { length: 40 },
    (_, i) =>
      `${i * 8},${42 + Math.sin(i * 0.65 + seed) * 15 + Math.cos(i * 1.7 + seed) * 7 - i * 0.55}`,
  ).join(" ");
  return (
    <svg
      className={`sparkline ${area ? "area-chart" : ""}`}
      viewBox="0 0 312 80"
      preserveAspectRatio="none"
      aria-label="더미 가격 추이"
      role="img"
    >
      {area && (
        <polygon
          points={`0,80 ${points} 312,80`}
          fill="currentColor"
          opacity=".16"
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
/**
 * 활성 탭을 관리하고 탭 선택 시 변경 콜백을 실행합니다.
 * @param props - 탭 설정.
 * @param props.items - 표시할 탭 이름 배열.
 * @param props.initial - 처음 활성화할 탭의 위치.
 * @param props.onChange - 선택한 위치를 전달받는 함수.
 * @returns 공통 탭 UI.
 */
export function Tabs({
  items,
  initial = 0,
  onChange,
}: {
  items: string[];
  initial?: number;
  onChange?: (index: number) => void;
}) {
  const [active, setActive] = useState(initial);
  return (
    <div className="tabs" role="tablist">
      {items.map((item, i) => (
        <button
          role="tab"
          aria-selected={active === i}
          className={active === i ? "active" : ""}
          key={item}
          onClick={() => {
            setActive(i);
            onChange?.(i);
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
/**
 * 분류에 맞는 더미 종목 목록을 표시하고 선택한 종목명을 전달합니다.
 * @param props - 종목 목록 설정.
 * @param props.variant - 0은 전체, 1은 상승, 2는 하락 목록.
 * @param props.onSelect - 선택한 종목명을 전달받는 함수.
 * @returns 종목 목록 UI.
 */
export function StockList({
  variant = 0,
  onSelect,
}: {
  variant?: number;
  onSelect?: (name: string) => void;
}) {
  const list =
    variant === 1
      ? stocks.filter((s) => s.up)
      : variant === 2
        ? stocks
            .filter((s) => !s.up)
            .slice()
            .reverse()
        : stocks;
  return (
    <div className="stock-list">
      {list.map((stock, i) => (
        <button
          className="stock-row"
          key={stock.code}
          onClick={() => onSelect?.(stock.name)}
        >
          <span className="rank">{i + 1}</span>
          <span className={`stock-badge badge-${i % 4}`}>{stock.badge}</span>
          <span className="stock-name">{stock.name}</span>
          <span className="stock-value">
            <strong>{stock.price}원</strong>
            <small className={stock.up ? "up" : "down"}>
              {stock.up ? "▲" : "▼"} {stock.change}%
            </small>
          </span>
        </button>
      ))}
    </div>
  );
}
/**
 * 고정 더미 뉴스를 일반 또는 간결한 목록으로 표시합니다.
 * @param props - 뉴스 표시 옵션.
 * @param props.compact - 간결한 목록 사용 여부.
 * @returns 더미 뉴스 목록.
 */
export function NewsList({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "news-list compact" : "news-list"}>
      {news.map((item) => (
        <article className="news-item" key={item.title}>
          <div>
            <h3>{item.title}</h3>
            <p>
              {item.source} <span>│</span> 2026.10.30 {item.time}
            </p>
          </div>
          {!compact && <span className="news-logo">{item.source}</span>}
        </article>
      ))}
    </div>
  );
}
/**
 * 고정 수식으로 봉과 거래량을 그립니다. period는 차트의 접근성 설명에 사용하며 실제 시세 주기를 변경하지 않습니다.
 * @param props - 차트 표시 옵션.
 * @param props.period - 표시할 봉 주기 이름.
 * @returns 더미 봉 차트 SVG.
 */
export function CandleChart({ period = "일" }: { period?: string }) {
  return (
    <svg
      className="candle-chart"
      viewBox="0 0 900 380"
      role="img"
      aria-label={`${period}봉 더미 차트`}
    >
      <g className="chart-grid">
        {[40, 100, 160, 220, 280, 340].map((y) => (
          <g key={y}>
            <line x1="10" y1={y} x2="825" y2={y} />
            <text x="840" y={y + 4}>
              {(210000 - y * 160).toLocaleString()}
            </text>
          </g>
        ))}
      </g>
      {Array.from({ length: 100 }, (_, i) => {
        const x = 12 + i * 8;
        const y =
          170 +
          Math.sin(i * 0.13) * 50 +
          Math.sin(i * 0.7) * 20 -
          Math.sin(i * 0.04) * 50;
        const up = Math.sin(i * 2.3) > 0;
        const h = 8 + ((i * 7) % 23);
        return (
          <g key={i} className={up ? "candle-up" : "candle-down"}>
            <line x1={x} y1={y - 12} x2={x} y2={y + h + 12} />
            <rect x={x - 2.5} y={y} width="5" height={h} />
            <rect
              x={x - 2.5}
              y={340 - ((i * 13) % 53)}
              width="5"
              height={((i * 13) % 53) + 8}
              opacity=".4"
            />
          </g>
        );
      })}
      <line x1="10" y1="213" x2="830" y2="213" className="price-line" />
      <g className="chart-grid">
        <text x="80" y="375">
          2026/05
        </text>
        <text x="250" y="375">
          2026/06
        </text>
        <text x="420" y="375">
          2026/07
        </text>
        <text x="590" y="375">
          2026/08
        </text>
        <text x="740" y="375">
          2026/10
        </text>
      </g>
    </svg>
  );
}
/**
 * 모의주문 입력과 금액 계산을 제공합니다. 버튼은 입력 확인 메시지만 표시하며 실제 주문을 전송하지 않습니다.
 * @param props - 주문 패널 설정.
 * @param props.name - 화면에 표시할 종목명.
 * @returns 더미 시세와 모의주문 입력 패널.
 */
export function OrderPanel({ name = "KB금융" }: { name?: string }) {
  const [side, setSide] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(155500);
  const [message, setMessage] = useState("");
  return (
    <aside className="order-panel">
      <div className="eyebrow">
        국내 · KRX <span className="live-dot" /> 실시간 Lite
      </div>
      <h2>{name}</h2>
      <strong className={cx("quote-price")}>{price.toLocaleString()}원</strong>
      <p className="down">▼ 1,300원 (0.83%)</p>
      <Sparkline seed={3} />
      <Tabs items={["1일", "1주", "1개월", "6개월", "1년"]} />
      <div className="order-form">
        <Tabs items={["매수", "매도"]} onChange={setSide} />
        <label>
          계좌
          <select>
            <option>모의투자 123-456-01</option>
          </select>
        </label>
        <label>
          주문유형
          <select>
            <option>지정가</option>
            <option>시장가</option>
          </select>
        </label>
        <label>
          수량
          <div className="stepper">
            <button
              aria-label="수량 줄이기"
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
            >
              −
            </button>
            <input
              aria-label="주문 수량"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
            />
            <span>주</span>
            <button
              aria-label="수량 늘리기"
              onClick={() => setQuantity(quantity + 1)}
            >
              ＋
            </button>
          </div>
        </label>
        <label>
          가격
          <div className="stepper">
            <button
              aria-label="가격 줄이기"
              onClick={() => setPrice(Math.max(0, price - 100))}
            >
              −
            </button>
            <input
              aria-label="주문 가격"
              type="number"
              min="0"
              step="100"
              value={price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
            />
            <span>원</span>
            <button
              aria-label="가격 늘리기"
              onClick={() => setPrice(price + 100)}
            >
              ＋
            </button>
          </div>
        </label>
        <div className="order-total">
          <span>주문 금액</span>
          <strong>{(price * quantity).toLocaleString()}원</strong>
        </div>
        <button
          className={`order-submit ${side ? "sell" : ""}`}
          onClick={() =>
            setMessage(
              quantity
                ? `모의 ${side ? "매도" : "매수"} ${quantity}주를 확인했어요. 실제 주문은 실행되지 않습니다.`
                : "주문 수량을 입력해 주세요.",
            )
          }
        >
          모의 {side ? "매도" : "매수"}
        </button>
        <p className="order-message" role="status">
          {message || "더미 데이터 · 실제 주문이 실행되지 않습니다."}
        </p>
      </div>
    </aside>
  );
}
