"use client";

import { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useKakaoLoader } from "react-kakao-maps-sdk";
export default function MainMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_KEY as string,
  });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.log(error, "에러!")
      );
    }
  }, []);

  return (
    <div className="relative">
      <Map
        id="map"
        center={location}
        style={{ width: "100%", height: "100vh", position: "relative" }}
        level={3}
      >
        <MapMarker position={location}>여기 ?</MapMarker>
      </Map>
      <div className="z-30 absolute top-6 left-6">
        <span>메뉴바</span>
      </div>
      <div className="z-30 absolute top-6 right-6">
        <span>내 위치</span>
      </div>
      <div className="absolute bottom-0 bg-slate-500 w-full h-20 z-30 rounded-t-3xl flex items-center justify-center">
        <form
          action=""
          className="relative w-4/5 h-1/2 bg-white rounded-2xl overflow-hidden flex items-center px-1"
        >
          <input type="text" className="w-full h-full outline-none p-3" />
          <button className="border-2 w-8 h-8 border-blue-700 rounded-2xl"></button>
        </form>
      </div>
    </div>
  );
}

//
