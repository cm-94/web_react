import classNames from "classnames/bind";
import styles from "./trading3003.module.scss";
const cx = classNames.bind(styles);

// TODO: 호가 더미화면. 추후 메뉴에 맞춰 수정 필요
export default function Trading3003() {
  return (
    <div className={cx("orderbook")}>
      <p className={cx("muted")}>호가 · 더미 데이터</p>
      {Array.from({ length: 12 }, (_, i) => (
        <div className={cx(i < 6 ? "ask" : "bid")} key={i}>
          <span style={{ width: `${20 + ((i * 17) % 70)}%` }} />
          <small>{(263 + i * 79).toLocaleString()}</small>
          <strong>{(156100 - i * 100).toLocaleString()}</strong>
          <small className={i < 6 ? "down" : "up"}>
            {i < 6 ? "매도" : "매수"}
          </small>
        </div>
      ))}
    </div>
  );
}
