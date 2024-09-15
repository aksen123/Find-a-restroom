import React from "react";

export default function AddOverlay() {
  return (
    <div
      className={`w-fit h-fit p-3 bg-blue-500 flex flex-col gap-3 text-white rounded-xl`}
    >
      <button className="ml-auto">닫기</button>
      <p className="m-auto">이 위치가 맞나요 ?</p>
      <form action="" className="flex flex-col">
        <input type="text" placeholder=" 화장실 이름을 입력해주세요" />
        <input type="text" placeholder="화장실 비밀번호를 입력해 주세요" />
        <button>등록</button>
      </form>
    </div>
  );
}
