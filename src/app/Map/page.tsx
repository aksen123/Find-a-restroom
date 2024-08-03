"use client";

import React, { useEffect, useState } from "react";
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { getMarker, Param } from "../service/getMarker";
import { time } from "console";

interface Location {
  lat: number;
  lng: number;
}
interface Overlay {
  location: Location;
  time: string;
  name: string;
  distance: number;
}
export default function Page() {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [markers, setMarkers] = useState<kakao.maps.Marker[] | null>(null);
  const [markerClusterer, setMarkerClusterer] =
    useState<kakao.maps.MarkerClusterer | null>(null);
  const [overlay, setOverlay] = useState<Overlay | null>(null);

  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_KEY as string,
    libraries: ["clusterer", "drawing", "services"],
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
        (error) => {
          console.log(error.code);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (location && map) {
      getRestroom(map);
    }
  }, [location, map]);

  const getRestroom = async (map: kakao.maps.Map) => {
    const bounds = map.getBounds();
    const params = {
      sw_lat: bounds.getSouthWest().getLat(),
      ne_lat: bounds.getNorthEast().getLat(),
      sw_lng: bounds.getSouthWest().getLng(),
      ne_lng: bounds.getNorthEast().getLng(),
    };
    const restrooms = await getMarker.get(params as Param);
    const newMarkers = restrooms.map((restroom) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(restroom.latitude, restroom.longitude),
        title: restroom.toilet_name,
        map: map,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        const markerPosition = marker.getPosition();
        const myLocation = new kakao.maps.LatLng(
          location?.lat as number,
          location?.lng as number
        );
        const polyline = new kakao.maps.Polyline({
          path: [markerPosition, myLocation],
        });
        const overlay: Overlay = {
          location: { lat: restroom.latitude, lng: restroom.longitude },
          name: restroom.toilet_name,
          time: restroom.detailed_opening_hours,
          distance: polyline.getLength(),
        };
        //TODO : 마커 클릭시 내위치와 마커의 거리 계산하기
        setOverlay(overlay);
        map.panTo(marker.getPosition());
      });
      return marker;
    });
    const cluster = new kakao.maps.MarkerClusterer({
      map: map,
      markers: newMarkers,
      minLevel: 5,
    });

    markerClusterer?.setMap(null);
    setMarkerClusterer(cluster);
    markers?.forEach((el) => el.setMap(null));
    setMarkers(newMarkers);
  };
  const changeMap = () => {
    if (map) {
      getRestroom(map);
    }
  };
  const myLocationClick = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (map) {
          const newCenter = new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          map.setCenter(newCenter);
          getRestroom(map);
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  };
  const closeOverlay = () => {
    setOverlay(null);
  };

  return (
    <>
      <div className="relative">
        {location && (
          <Map
            center={location}
            style={{ width: "100%", height: "100vh", position: "relative" }}
            level={3}
            onDragEnd={changeMap}
            onZoomChanged={changeMap}
            onCreate={(map) => setMap(map)}
          >
            <MapMarker position={location}>여기</MapMarker>
            {overlay && (
              <CustomOverlayMap
                position={overlay.location}
                clickable
                zIndex={1}
                yAnchor={1.5}
              >
                <div
                  className={`w-fit h-fit p-3 bg-blue-200 flex flex-col gap-3`}
                >
                  <button onClick={closeOverlay} className="text-right">
                    닫기
                  </button>
                  <div>
                    <p>화장실명:{overlay.name}</p>
                    <p>
                      개방 시간:{" "}
                      {overlay.time === "" ? "정보 없음" : overlay.time}
                    </p>
                    <p>직선거리:{overlay.distance}</p>
                    <button>길찾기</button>
                  </div>
                </div>
              </CustomOverlayMap>
            )}
          </Map>
        )}
        <div className="z-30 absolute top-6 left-6">
          <span>메뉴바</span>
        </div>
        <div onClick={myLocationClick} className="z-30 absolute top-6 right-6">
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
    </>
  );
}
