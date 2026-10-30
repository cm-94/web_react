"use client";
import { useState } from "react";
import { CandleChart, Tabs } from "@/components/wts/widgets";
import classNames from "classnames/bind";
import styles from "./trading3002.module.scss";
const cx = classNames.bind(styles);

// TODO: 차트 더미화면. 추후 메뉴에 맞춰 수정 필요
export default function Trading3002({ selected }: { selected: string }) {
  const [period, setPeriod] = useState("일");
  return (
    <div className={cx("widget-chart")}>
      <div className={cx("chart-tools")}>⊞　⌁　╱　▦　│　지표　 비교</div>
      <div>
        {selected} <span className={cx("down")}>155,500 (−0.83%)</span>
      </div>
      <CandleChart period={period} />
      <Tabs
        items={["1분", "5분", "일", "주", "월", "년"]}
        initial={2}
        onChange={(i) => setPeriod(["1분", "5분", "일", "주", "월", "년"][i])}
      />
    </div>
  );
}
