import React from "react";
import KakaoLoader from "./components/kakao-loader";
import { Map } from "react-kakao-maps-sdk";
import Script from "next/script";
import MainMap from "./components/Map";

export default function Page() {
  return (
    <>
      <MainMap />
    </>
  );
}
