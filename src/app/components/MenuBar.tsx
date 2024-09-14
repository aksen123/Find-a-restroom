import React from "react";

interface Props {
  onClose: () => void;
}

export default function MenuBar({ onClose }: Props) {
  const clickDiv = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };
  const addRestroom = () => {
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
        <h3>000님 안녕하세요 or 로그인</h3>
        <ul className="space-y-3">
          <li>
            <button>등록한 화장실</button>
          </li>
          <li>
            <button>화장실 등록</button>
          </li>
          <li>
            <button>꿀팁</button>
          </li>
        </ul>
      </aside>
    </div>
  );
}
