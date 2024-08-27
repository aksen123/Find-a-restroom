import React from "react";

interface Props {
  onClose: () => void;
}

export default function MenuBar({ onClose }: Props) {
  const clickDiv = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };
  return (
    <div
      onClick={clickDiv}
      className="absolute w-full h-full bg-black bg-opacity-75 top-0 left-0 z-10"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-fit h-full p-5 space-y-8"
      >
        <h3>000님 안녕하세요</h3>
        <ul className="space-y-3">
          <li>내가 저장한 화장실</li>
          <li>급할때</li>
        </ul>
      </aside>
    </div>
  );
}
