"use client";
import { useScreenNavigation } from "@/contexts/screenNavigation";
import { useState } from "react";
import { indices } from "@/components/wts/data";
import { NewsList, Sparkline, StockList, Tabs } from "@/components/wts/widgets";
import classNames from "classnames/bind";
import styles from "./home1000.module.scss";
const cx = classNames.bind(styles);

// TODO: 홈 더미화면. 추후 메뉴에 맞춰 수정 필요
export default function Home1000() {
  const { openScreen } = useScreenNavigation();
  const [market, setMarket] = useState(0);
  const [newsTab, setNewsTab] = useState(0);
  return (
    <div className={cx("screen", "home-screen")}>
      <div className={cx("screen-toolbar")}>
        <Tabs items={["국내", "해외"]} onChange={setMarket} />
        <span className={cx("announcement")}>
          ✦ KRX 애프터마켓 도입 및 NXT 제도개편 안내 <span>›</span>
        </span>
        <span className={cx("market-status")}>
          <i /> {market ? "해외 시장" : "국내 시장"} · 더미 시세
        </span>
      </div>
      <div className={cx("index-grid")}>
        {indices.map((item, i) => (
          <article className={cx("index-card")} key={item.name}>
            <p>{item.name}</p>
            <strong>{item.value}</strong>
            <span className={cx("down")}>▼ {item.change}</span>
            <Sparkline seed={i + market * 4} />
          </article>
        ))}
      </div>
      <div className={cx("section-heading")}>
        <h1>
          이 시각 뉴스 <span>›</span>
        </h1>
        <span className={cx("muted")}>2026.10.30 기준 · 예시 데이터</span>
      </div>
      <Tabs
        items={["실시간 경제", "주요 뉴스", "인기 뉴스"]}
        onChange={setNewsTab}
      />
      <div key={newsTab}>
        <NewsList />
      </div>
      <div className={cx("section-heading")}>
        <h2>
          실시간 랭킹 주식 <span>›</span>
        </h2>
        <button
          className={cx("screen-link")}
          onClick={() => openScreen("3000")}
        >
          트레이딩 바로가기 ↗
        </button>
      </div>
      <div className={cx("ranking-grid")}>
        {["거래대금", "많이 오른", "많이 내린"].map((title, i) => (
          <section key={title}>
            <h3>
              {title} <span>›</span>
            </h3>
            <StockList variant={i} />
          </section>
        ))}
      </div>
    </div>
  );
}
