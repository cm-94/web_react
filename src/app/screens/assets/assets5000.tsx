"use client";
import { useScreenNavigation } from "@/contexts/screenNavigation";
import { useState } from "react";
import { Sparkline, Tabs } from "@/components/wts/widgets";
import classNames from "classnames/bind";
import styles from "./assets5000.module.scss";
const cx = classNames.bind(styles);

// TODO: 내자산 더미화면. 추후 메뉴에 맞춰 수정 필요
export default function Assets5000() {
  const { openScreen } = useScreenNavigation();
  const [tab, setTab] = useState(0);
  return (
    <div className={cx("screen", "assets-screen")}>
      <div className={cx("section-heading")}>
        <h1>내자산</h1>
        <select aria-label="계좌 선택">
          <option>전체계좌</option>
          <option>모의 종합위탁</option>
        </select>
      </div>
      <section className={cx("asset-summary")}>
        <div className={cx("asset-summary-top")}>
          <div>
            <h2>
              모의투자 님의 총자산 <span className={cx("muted")}>◴</span>
            </h2>
            <p>
              순자산 <b>83,659,046원</b>　 신용대출금 <b>0원</b>　 총 예수금{" "}
              <b>3,904,415원</b>
            </p>
          </div>
          <div className={cx("asset-total")}>
            <strong>83,659,046원</strong>
            <p className={cx("down")}>−12,835,313원 (−14.21%)</p>
          </div>
        </div>
        <div className={cx("asset-grid")}>
          <article>
            <h3>
              계좌 <span>⚙</span>
            </h3>
            {[
              ["종합위탁", "81,376,239"],
              ["CMA", "2,282,807"],
            ].map(([name, value]) => (
              <div className={cx("asset-row")} key={name}>
                <div>
                  {name}
                  <small>123-456-01 모의투자</small>
                </div>
                <div>
                  <strong>{value}원</strong>
                  <small className={name === "CMA" ? "" : "down"}>
                    {name === "CMA" ? "0원 (0.00%)" : "−12,835,313원 (−14.21%)"}
                  </small>
                </div>
              </div>
            ))}
          </article>
          <article>
            <h3>상품</h3>
            {[
              ["국내주식", "0"],
              ["해외주식", "77,471,824"],
              ["금융상품", "2,282,807"],
            ].map(([name, value]) => (
              <div className={cx("asset-row")} key={name}>
                <span>{name}</span>
                <strong>{value}원</strong>
              </div>
            ))}
          </article>
          <article>
            <h3>자산흐름 ›</h3>
            <p className={cx("asset-insight")}>
              지난주보다 자산이 <span className={cx("up")}>1,463,496원</span>{" "}
              늘었어요
            </p>
            <Sparkline area seed={4} />
            <Tabs items={["1주", "1개월", "3개월", "6개월", "1년"]} />
          </article>
        </div>
      </section>
      <Tabs
        items={["국내주식 0", "해외주식 3", "금융상품 1"]}
        onChange={setTab}
      />
      {tab === 0 ? (
        <div className={cx("empty-state")}>
          <span>⌕</span>
          <h3>아직 국내주식을 가지고 있지 않아요</h3>
          <p>어떤 주식을 사야 할 지 모르겠다면?</p>
          <button
            className={cx("screen-link")}
            onClick={() => openScreen("1000")}
          >
            인기 종목 살펴보기 →
          </button>
        </div>
      ) : (
        <div className={cx("table-wrap")}>
          <table>
            <thead>
              <tr>
                {["종목명", "보유수량", "평가금액", "평가손익", "수익률"].map(
                  (s) => (
                    <th key={s}>{s}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {(tab === 1
                ? ["AT&T", "애플", "마이크로소프트"]
                : ["모의 CMA"]
              ).map((name, i) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{i + 1}주</td>
                  <td>{(28081 * (i + 1)).toLocaleString()}원</td>
                  <td className={cx("up")}>+5,370원</td>
                  <td className={cx("up")}>23.64%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
