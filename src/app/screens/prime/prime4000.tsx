"use client";
import { useState } from "react";
import { Tabs } from "@/components/wts/widgets";
const cards = [
  {
    art: "◎",
    type: "GLOBAL INSIGHT",
    title: "과감한 베팅 NO! 비중 조절 시기?",
    color: "blue",
    category: "해외주식",
  },
  {
    art: "▧",
    type: "NEXT TECHNOLOGY",
    title: "휴머노이드가 예고하는 노동의 진화",
    color: "mint",
    category: "해외주식",
  },
  {
    art: "↗",
    type: "SMART MONEY",
    title: "2027 연말정산, 달라지는 공제는?",
    color: "cream",
    category: "내돈관리",
  },
];
import classNames from "classnames/bind";
import styles from "./prime4000.module.scss";
const cx = classNames.bind(styles);

// TODO: PRIME CLUB 더미화면. 추후 메뉴에 맞춰 수정 필요
export default function Prime4000() {
  const [selected, setSelected] = useState("");
  return (
    <div className={cx("screen", "prime-screen")}>
      <div className={cx("section-heading")}>
        <h1>PRIME CLUB</h1>
        <span className={cx("prime-banner")}>
          ✦ 국내주식 쿠폰 최대 100만원! ›
        </span>
        <span className={cx("muted")}>MY PRIME　│　PRIME CLUB 구독</span>
      </div>
      <div className={cx("prime-layout")}>
        <div>
          <h2>
            오늘의 콕 <span>›</span>
          </h2>
          <div className={cx("content-cards")}>
            {cards.map((card) => (
              <button
                className={cx("content-card")}
                key={card.title}
                onClick={() => setSelected(card.title)}
              >
                <div className={cx("card-art", card.color)}>
                  <small>{card.type}</small>
                  <span>{card.art}</span>
                  <em>PRIME INSIGHT</em>
                </div>
                <div className={cx("card-copy")}>
                  <h3>{card.title}</h3>
                  <p>{card.category} │ 오늘</p>
                </div>
              </button>
            ))}
          </div>
          <h2>
            오늘의 주식 <span>›</span>
          </h2>
          <div className={cx("content-cards")}>
            {cards.map((card, i) => (
              <button
                className={cx("content-card")}
                key={card.title}
                onClick={() =>
                  setSelected(
                    [
                      "신규 자산 역대 최고치",
                      "보호무역 수혜",
                      "AI 인프라가 이끄는 미래",
                    ][i],
                  )
                }
              >
                <div className={cx("card-art", card.color)}>
                  <small>✦ MONTHLY PICK</small>
                  <span>{["◉", "▥", "◈"][i]}</span>
                  <em>THE NEXT OPPORTUNITY</em>
                </div>
                <div className={cx("card-copy")}>
                  <span className={cx("tag")}>밸류파인더</span>
                  <h3>
                    [월가탑픽]{" "}
                    {
                      [
                        "신규 자산 역대 최고치",
                        "보호무역 수혜",
                        "AI 인프라가 이끄는 미래",
                      ][i]
                    }
                  </h3>
                  <p>by PRIME CLUB</p>
                  <small className={cx("muted")}>
                    2026/10/{29 - i} · 조회 {66 + i * 13}
                  </small>
                </div>
              </button>
            ))}
          </div>
        </div>
        <aside className={cx("broadcast")}>
          <h2>
            증권방송 <span>›</span>
          </h2>
          <button
            className={cx("broadcast-hero")}
            onClick={() => setSelected("키맨의 시크릿 전략")}
          >
            <span className={cx("tag")}>● LIVE</span>
            <strong>
              키맨의
              <br />
              시크릿 전략
            </strong>
            <span className={cx("play")}>▶</span>
            <small>#수급파악　#주도섹터</small>
          </button>
          <h3>⚡ 키선제압 ⚡</h3>
          <p className={cx("muted")}>출연 : 모의투자 리서치팀</p>
          <Tabs items={["지난방송", "최근 본 방송"]} />
          {[
            "실적은 좋다는데 왜 빠질까?",
            "업종별 차별화 기대 | 모닝전략",
            "시장 하락 점검, 다음 투자 전략",
          ].map((s, i) => (
            <button
              className={cx("broadcast-row")}
              key={s}
              onClick={() => setSelected(s)}
            >
              <span>
                ON AIR
                <br />
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                {s}
                <small>전략과 종목 · 2026/10/30</small>
              </div>
            </button>
          ))}
        </aside>
      </div>
      {selected && (
        <div className={cx("modal-backdrop")} onClick={() => setSelected("")}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected}
            className={cx("content-dialog")}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={cx("dialog-close")}
              aria-label="닫기"
              onClick={() => setSelected("")}
            >
              ×
            </button>
            <span className={cx("eyebrow")}>PRIME CLUB · 미리보기</span>
            <h2>{selected}</h2>
            <p>
              선택한 콘텐츠의 더미 상세 화면입니다. 실제 콘텐츠와 방송은
              연결되지 않았습니다.
            </p>
            <button
              className={cx("primary-button")}
              onClick={() => setSelected("")}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
