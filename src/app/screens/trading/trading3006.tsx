import { OrderPanel } from "@/components/wts/widgets";
// TODO: 모의주문 더미화면. 추후 메뉴에 맞춰 수정 필요
export default function Trading3006({ selected }: { selected: string }) {
  return <OrderPanel name={selected} />;
}
