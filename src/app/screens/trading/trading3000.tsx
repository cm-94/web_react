"use client";
import { useState } from "react";
import Workspace from "@/components/workspace/workspace";
import { menu } from "@/constants/menu";
import Trading3001 from "./trading3001";
import Trading3002 from "./trading3002";
import Trading3003 from "./trading3003";
import Trading3004 from "./trading3004";
import Trading3005 from "./trading3005";
import Trading3006 from "./trading3006";
import Trading3007 from "./trading3007";
// TODO: 트레이딩 메인 더미화면. 추후 메뉴에 맞춰 수정 필요
export default function Trading3000() {
  const [selected, setSelected] = useState("KB금융");
  return (
    <Workspace
      {...menu["3000"]}
      renderWidget={(id) => {
        switch (id) {
          case "trading3001":
            return <Trading3001 selected={selected} />;
          case "trading3002":
            return <Trading3002 selected={selected} />;
          case "trading3003":
            return <Trading3003 />;
          case "trading3004":
            return <Trading3004 onSelect={setSelected} />;
          case "trading3005":
            return <Trading3005 />;
          case "trading3006":
            return <Trading3006 selected={selected} />;
          case "trading3007":
            return <Trading3007 />;
        }
      }}
    />
  );
}
