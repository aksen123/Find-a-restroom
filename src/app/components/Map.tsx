"use client";

import { Lng_Lat } from "@/types/service";
import { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { getMarker } from "../service/getMarker";
import test from "/image/dot.png";
export default function MainMap() {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
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
        (error) => console.log(error, "에러!????")
      );
    }
    console.log("!!");
  }, []);
  const createImage = (url: string, size: kakao.maps.Size) =>
    new kakao.maps.MarkerImage(url, size);
  const click = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const mapContainer = document.getElementById("map");
        const option = {
          center: new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          ),
          level: 3,
        };
        const map = new kakao.maps.Map(mapContainer as HTMLElement, option);
        map.setCenter(
          new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          )
        );
        const a = map.getBounds();
        const param = {
          sw_lat: a.getSouthWest().getLat(),
          ne_lat: a.getNorthEast().getLat(),
          sw_lng: a.getSouthWest().getLng(),
          ne_lng: a.getNorthEast().getLng(),
        };
        const restrooms = await getMarker.get(param);
        const markers = restrooms.map((restroom, i) => {
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(
              restroom.latitude,
              restroom.longitude
            ),
            map: map,
            title: restroom.toilet_name,
            image: createImage("/image/dot.png", new kakao.maps.Size(20, 20)),
          });
          return marker;
        });

        setMarkers(markers);
        setMap(map);

        if (map) {
          kakao.maps.event.removeListener(map, "dragend", () => {});
          kakao.maps.event.addListener(map, "dragend", () =>
            console.log("센터 체인지")
          );
        }
      },
      (error) => console.log(error, "에러!")
    );
  };
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
      <div onClick={click} className="z-30 absolute top-6 right-6">
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
