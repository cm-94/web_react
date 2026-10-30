import { Tabs } from "@/components/wts/widgets";
import classNames from "classnames/bind";
import styles from "./trading3001.module.scss";
const cx = classNames.bind(styles);

// TODO: 종목개요 더미화면. 추후 메뉴에 맞춰 수정 필요
export default function Trading3001({ selected }: { selected: string }) {
  return (
    <div className={cx("stock-overview")}>
      <Tabs items={["통합", "KRX", "NXT"]} />
      <p className={cx("muted")}>ⓘ KRX가 지원됩니다.　☀ 정규장</p>
      <h2>
        {selected} <span className={cx("favorite")}>☆</span>
      </h2>
      <strong className={cx("quote-price")}>155,500원</strong>
      <p className={cx("down")}>▼ 1,300원 (0.83%)</p>
      <small className={cx("muted")}>105560 │ KOSPI │ 금융</small>
    </div>
  );
}
