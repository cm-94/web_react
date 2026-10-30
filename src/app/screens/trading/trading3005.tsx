import { Tabs } from "@/components/wts/widgets";
// TODO: 주문내역 더미화면. 추후 메뉴에 맞춰 수정 필요
export default function Trading3005() {
  return (
    <div>
      <Tabs items={["주문내역", "잔고", "체결"]} />
      <div className="empty-state">
        <span>≡</span>
        <h3>모의 주문내역이 없습니다</h3>
        <p>실제 계좌와 연결되지 않은 데모입니다.</p>
      </div>
    </div>
  );
}
