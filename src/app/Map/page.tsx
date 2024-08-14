"use client";

import React, { useEffect, useState } from "react";
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  Polyline,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { getMarker, Param } from "../service/getMarker";
import { RestroomsData } from "../api/restrooms/route";

export interface Coordinate {
  lat: number;
  lng: number;
}
interface Overlay {
  location: Coordinate;
  time: string;
  name: string;
  distance: string;
}
export default function Page() {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [markers, setMarkers] = useState<kakao.maps.Marker[] | null>(null);
  const [markers2, setMarkers2] = useState<RestroomsData[] | null>(null);
  const [markerClusterer, setMarkerClusterer] =
    useState<kakao.maps.MarkerClusterer | null>(null);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [search, setSearch] = useState<boolean>(false);
  const [polyline, setPolyline] = useState<Coordinate[] | null>(null);
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
        position: new kakao.maps.LatLng(restroom.lat, restroom.lng),
        title: restroom.name,
        map: map,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        const markersClick = restrooms.filter(
          (r) =>
            Math.abs(r.lat - restroom.lat) < 0.00001 &&
            Math.abs(r.lng - restroom.lng) < 0.00001
        );
        if (markersClick.length > 0) setMarkers2(markersClick);
        //TODO 클릭시 중복된 마커가 있으면 리스트로 보여주고 리스트 클릭시 원래 오버레이 보이게 표기
        // 중복안된 마커는 원래대로 오버레이 보여주기.
        const markerPosition = marker.getPosition();
        const myLocation = new kakao.maps.LatLng(
          location?.lat as number,
          location?.lng as number
        );
        const polyline = new kakao.maps.Polyline({
          path: [markerPosition, myLocation],
        });
        location &&
          setPolyline([
            location,
            { lat: markerPosition.getLat(), lng: markerPosition.getLng() },
          ]);
        const distance =
          polyline.getLength() > 1000
            ? (polyline.getLength() / 1000).toFixed(2) + "km"
            : Math.ceil(polyline.getLength()) + "m";
        const overlay: Overlay = {
          location: { lat: restroom.lat, lng: restroom.lng },
          name: restroom.name,
          time: restroom.time,
          distance: distance,
        };
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
    setSearch(false);
  };

  const changeMap = () => {
    setSearch(true);
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
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
    setOverlay(null);
    setSearch(false);
    map?.setLevel(3);
  };
  const closeOverlay = () => {
    setOverlay(null);
    setPolyline(null);
  };
  const searchButton = () => {
    if (map) getRestroom(map);
  };

  const getPath = async () => {
    const path = await getMarker.test(polyline);
    setPolyline(path);
    setOverlay(null);
    const bounds = new kakao.maps.LatLngBounds();
    path.map((coord) =>
      bounds.extend(new kakao.maps.LatLng(coord.lat, coord.lng))
    );
    map?.setBounds(bounds);
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
            <MapMarker
              position={location}
              image={{
                src: "../image/dot.png",
                size: { height: 30, width: 30 },
              }}
              zIndex={10}
            >
              내위치
            </MapMarker>
            {polyline && (
              <Polyline
                path={polyline}
                strokeWeight={3}
                strokeColor={"#db4040"}
                strokeOpacity={polyline.length <= 2 ? 0 : 1}
                strokeStyle={"solid"}
              />
            )}
            {overlay && (
              <CustomOverlayMap
                position={overlay.location}
                clickable
                zIndex={1}
                yAnchor={1.25}
              >
                <div
                  className={`w-fit h-fit p-3 bg-blue-500 flex flex-col gap-3 text-white`}
                >
                  <div className="flex justify-end">
                    <button onClick={closeOverlay} className="">
                      닫기
                    </button>
                  </div>
                  <div>
                    <p>화장실명: {overlay.name}</p>
                    <p>
                      개방 시간:
                      {overlay.time === "" ? "정보 없음" : overlay.time}
                    </p>
                    <p>직선거리: {overlay.distance}</p>
                    <button onClick={getPath}>길찾기</button>
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
          {search && (
            <button
              onClick={searchButton}
              className="absolute -top-full border-2 border-blue-500 rounded-2xl p-3 text-white bg-blue-500"
            >
              현위치에서 검색
            </button>
          )}
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
