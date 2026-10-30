"use client";
import { useState } from "react";
import { stocks } from "@/components/wts/data";
import {
  NewsList,
  OrderPanel,
  Sparkline,
  Tabs,
} from "@/components/wts/widgets";
import classNames from "classnames/bind";
import styles from "./watch2000.module.scss";
const cx = classNames.bind(styles);

// TODO: 찜한주식 더미화면. 추후 메뉴에 맞춰 수정 필요
export default function Watch2000() {
  const [selected, setSelected] = useState("KB금융");
  const [group, setGroup] = useState(0);
  return (
    <div className={cx("split-screen")}>
      <div className={cx("screen", "watch-screen")}>
        <div className={cx("section-heading")}>
          <h1>
            찜한주식 <span className={cx("muted")}>ⓘ</span>
          </h1>
          <span className={cx("muted")}>
            종목을 선택하면 주문 영역이 변경돼요
          </span>
        </div>
        <Tabs
          items={[
            "최근조회",
            "보유종목",
            "글로벌",
            "매수 대기",
            "국내",
            "관심그룹1",
          ]}
          initial={2}
          onChange={setGroup}
        />
        <div className={cx("table-wrap")}>
          <table>
            <thead>
              <tr>
                {["종목명", "시세 추이", "현재가", "등락률", "시장"].map(
                  (s) => (
                    <th key={s}>{s}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {stocks
                .filter((s) => group !== 1 || !s.up)
                .map((s, i) => (
                  <tr
                    key={s.code}
                    className={cx({ "selected-row": selected === s.name })}
                  >
                    <td>
                      <button
                        className={cx("stock-select")}
                        onClick={() => setSelected(s.name)}
                      >
                        <span className={`stock-badge badge-${i % 4}`}>
                          {s.badge}
                        </span>
                        <span>
                          <strong>{s.name}</strong>
                          <small>{s.code}</small>
                        </span>
                        <span className={cx("favorite")}>★</span>
                      </button>
                    </td>
                    <td>
                      <Sparkline seed={i} />
                    </td>
                    <td>{s.price}원</td>
                    <td className={s.up ? "up" : "down"}>
                      {s.up ? "▲" : "▼"} {s.change}%
                    </td>
                    <td className={cx("muted")}>KRX</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className={cx("watch-news")}>
          <Tabs items={["뉴스", "공시"]} />
          <NewsList compact />
        </div>
      </div>
      <OrderPanel name={selected} />
    </div>
  );
}
