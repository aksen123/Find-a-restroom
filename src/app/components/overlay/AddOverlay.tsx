import React from "react";
interface Props {
  closeButton: () => void;
}

export default function AddOverlay({ closeButton }: Props) {
  return (
    <div
      className={`w-fit h-fit p-3 bg-blue-500 flex flex-col gap-3 text-white rounded-xl`}
    >
      <button className="ml-auto" onClick={closeButton}>
        닫기
      </button>
      <p className="m-auto">이 위치가 맞나요 ?</p>
    </div>
  );
}
