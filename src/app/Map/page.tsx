"use client";

import React, { useEffect, useState } from "react";
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  Polyline,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { getMarker, Range } from "../service/getMarker";
import { RestroomsData } from "../api/restrooms/route";
import { getRoute } from "../service/getRoute";
import Loading from "../components/loading/Loading";
import MenuBar from "../components/MenuBar";
import MarkerOverlay from "../components/overlay/MarkerOverlay";
import AddOverlay from "../components/overlay/AddOverlay";
export interface Coordinate {
  lat: number;
  lng: number;
}
export interface Overlay {
  location: Coordinate;
  time: string;
  name: string;
  distance: string;
  info: {
    distance: string;
    minuteTime: string;
  } | null;
}

export type AddOverlayType = Pick<Overlay, "location">;
interface AddOverlay {}
export default function Page() {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [markers, setMarkers] = useState<kakao.maps.Marker[] | null>(null);
  const [destinationMarker, setDestinationMarker] =
    useState<kakao.maps.Marker | null>(null);
  const [markerClusterer, setMarkerClusterer] =
    useState<kakao.maps.MarkerClusterer | null>(null);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [addOverlay, setAddOverlay] = useState<AddOverlayType | null>(null);
  const [search, setSearch] = useState<boolean>(false);
  const [polyline, setPolyline] = useState<Coordinate[] | null>(null);
  const [pathLoading, setPathLoading] = useState<boolean>(false);
  const [menuToggle, setMenuToggle] = useState<boolean>(false);
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

  const closeMenu = () => {
    setMenuToggle(false);
  };

  const changeDistance = (distance: number) => {
    const changeDistance =
      distance > 1000
        ? (distance / 1000).toFixed(2) + "km"
        : Math.ceil(distance) + "m";
    return changeDistance;
  };

  const getRestroom = async (map: kakao.maps.Map) => {
    const bounds = map.getBounds();
    const params: Range = {
      sw_lat: bounds.getSouthWest().getLat(),
      ne_lat: bounds.getNorthEast().getLat(),
      sw_lng: bounds.getSouthWest().getLng(),
      ne_lng: bounds.getNorthEast().getLng(),
    };

    const restrooms = await getMarker.get(params);
    const newMarkers = restrooms.map((restroom) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(restroom.lat, restroom.lng),
        title: restroom.name,
      });
      kakao.maps.event.addListener(marker, "click", () => {
        const markersClick = restrooms.filter(
          (r) =>
            Math.abs(r.lat - restroom.lat) < 0.00001 &&
            Math.abs(r.lng - restroom.lng) < 0.00001
        );
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

        const start = location as Coordinate;
        const end = {
          lat: markerPosition.getLat(),
          lng: markerPosition.getLng(),
        };
        location && setPolyline([start, end]);
        const distance = changeDistance(polyline.getLength());
        const overlay: Overlay = {
          location: { lat: restroom.lat, lng: restroom.lng },
          name: restroom.name,
          time:
            restroom.detail_time === "" || "-" || ":~:"
              ? restroom.open_time
              : restroom.detail_time,
          distance: distance,
          info: null,
        };
        setOverlay(overlay);
        setDestinationMarker(marker);
        map.panTo(marker.getPosition());
      });
      return marker;
    });
    const cluster = new kakao.maps.MarkerClusterer({
      map: map,
      markers: newMarkers,
      minLevel: 5,
    });

    setMarkerClusterer(cluster);
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
    closeOverlay();
    setSearch(false);
    setPolyline(null);
    map?.setLevel(3);
  };
  const closeOverlay = () => {
    setOverlay(null);
  };
  const searchButton = () => {
    if (map) getRestroom(map);
  };

  const getPath = async () => {
    setOverlay(null);
    setPathLoading(() => true);

    if (overlay) {
      if (+overlay?.distance.replace("km", "") > 1.5) {
        return alert(`화장실이 너무 멀리 있습니다.`);
      }
      try {
        const path = await getRoute.walk(polyline as Coordinate[]);
        const distance = new kakao.maps.Polyline({
          path: path.map((el) => new kakao.maps.LatLng(el.lat, el.lng)),
        }).getLength();

        const minuteTime = ((distance / 1000 / 5) * 60).toFixed(0);
        const info = {
          distance: changeDistance(distance),
          minuteTime: minuteTime + "분",
        };
        const half = path[Math.ceil(path.length / 2)];
        const location = { lat: half.lat, lng: half.lng };
        setPolyline(path);
        setTimeout(() => {
          setOverlay({ ...overlay, location, info });
        }, 0);

        const bounds = new kakao.maps.LatLngBounds();
        path.map((coord) =>
          bounds.extend(new kakao.maps.LatLng(coord.lat, coord.lng))
        );
        hideMarkerCluster();
        destinationMarker?.setMap(map);
        map?.setBounds(bounds);
      } catch (error) {
        alert("경로를 찾지 못했습니다.");
      } finally {
        setPathLoading(false);
      }
    }
  };
  const hideMarkerCluster = () => {
    if (map && markerClusterer) {
      markerClusterer.clear();
    }
  };
  const viewMarkerCluster = () => {
    console.log("메뉴 클릭2");
    if (map && markers) {
      const cluster = new kakao.maps.MarkerClusterer({
        map: map,
        markers,
        minLevel: 5,
      });
      setMarkerClusterer(cluster);
    }
  };
  const clickMenu = () => setMenuToggle(true);
  const clickAddRestroom = () => {
    setOverlay(null);
    closeMenu();
  };
  const clickMap = (event: kakao.maps.event.MouseEvent) => {
    if (map) {
      const latLng = event.latLng;
      const size = new kakao.maps.Size(30, 30);
      const newMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(latLng.getLat(), latLng.getLng()),
        image: new kakao.maps.MarkerImage("../image/dot.png", size),
      });
      const overlay = {
        location: { lat: latLng.getLat(), lng: latLng.getLng() },
      };
      map.panTo(newMarker.getPosition());
      setAddOverlay(overlay);
      newMarker.setMap(map);
    }
  };
  if (loading) return <div>맵 로딩중</div>;
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
            onClick={(_, event) => clickMap(event)}
          >
            <MapMarker
              position={location}
              image={{
                src: "../image/dot.png",
                size: { height: 30, width: 30 },
              }}
              zIndex={10}
            ></MapMarker>
            {addOverlay && (
              <CustomOverlayMap
                position={addOverlay.location}
                clickable
                zIndex={1}
                yAnchor={1.25}
              >
                <AddOverlay />
              </CustomOverlayMap>
            )}
            {polyline && (
              <Polyline
                path={polyline}
                strokeWeight={5}
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
                <MarkerOverlay
                  overlay={overlay}
                  closeOverlay={closeOverlay}
                  getPath={getPath}
                />
              </CustomOverlayMap>
            )}
          </Map>
        )}
        <button
          onClick={clickMenu}
          className="bg-blue-500 p-3 text-white font-semibold rounded-2xl z-[5] absolute top-6 left-6"
        >
          메뉴
        </button>
        <button
          onClick={myLocationClick}
          className="bg-blue-500 p-3 text-white font-semibold rounded-2xl z-[5] absolute top-6 right-6"
        >
          내 위치
        </button>
        {search && (
          <button
            onClick={searchButton}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 border-2 border-blue-500 rounded-2xl p-3 text-white bg-blue-500"
          >
            현위치에서 검색
          </button>
        )}
        {menuToggle && <MenuBar onClose={closeMenu} />}
        {pathLoading && (
          <div className="absolute z-10 bg-black bg-opacity-75 top-0 w-full h-full flex items-center justify-center">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}
