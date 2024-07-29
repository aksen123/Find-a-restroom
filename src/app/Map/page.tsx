"use client";

import React, { useEffect, useState } from "react";
import { Map, useKakaoLoader } from "react-kakao-maps-sdk";
import { getMarker, Param } from "../service/getMarker";

interface Location {
  lat: number;
  lng: number;
}

export default function Page() {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [markers, setMarkers] = useState<kakao.maps.Marker[] | null>(null);
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
      console.log(map, "변경!!");
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
    const markers = restrooms.map((el) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(el.latitude, el.longitude),
        title: el.toilet_name,
        map: map,
      });

      return marker;
    });
    // markers.map((el) => el.setMap(null));
    setMarkers(markers);
    console.log(restrooms);
  };
  return (
    <>
      <div className="relative">
        {location && (
          <Map
            center={location}
            style={{ width: "100%", height: "100vh", position: "relative" }}
            level={3}
            onCreate={(map) => setMap(map)}
          ></Map>
        )}
      </div>
    </>
  );
}
