import React from "react";
import { Overlay } from "@/app/Map/page";

interface Props {
  overlay: Overlay;
  closeOverlay: () => void;
  getPath: () => void;
}

export default function MarkerOverlay({
  closeOverlay,
  getPath,
  overlay,
}: Props) {
  return (
    <div
      className={`w-fit h-fit p-3 bg-blue-500 flex flex-col gap-3 text-white rounded-xl`}
    >
      <div className="flex justify-end">
        <button onClick={closeOverlay} className="">
          닫기
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {overlay.info ? (
          <>
            <p className="font-bold">경로 거리: {overlay.info.distance}</p>
            <p className="font-bold">예상 시간: {overlay.info.minuteTime}</p>
          </>
        ) : (
          <>
            <p className="font-bold">화장실명: {overlay.name}</p>
            <p className="font-bold">개방 시간: {overlay.time}</p>
            <p className="font-bold">직선거리: {overlay.distance}</p>
            <div className="flex justify-around">
              <button onClick={getPath}>길 찾기</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
