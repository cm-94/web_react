import { StockList } from "@/components/wts/widgets";
// TODO: 찜한주식 목록 더미화면. 추후 메뉴에 맞춰 수정 필요
export default function Trading3004({
  onSelect,
}: {
  onSelect: (name: string) => void;
}) {
  return <StockList onSelect={onSelect} />;
}
