import api from "@/app/service/axios";
import axios from "axios";
import { NextRequest } from "next/server";
import { Coordinate } from "./../../Map/page";

// 인터페이스 정의
interface Location {
  name: string;
  x: number;
  y: number;
}

interface Bound {
  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;
}

interface Fare {
  taxi: number;
  toll: number;
}

interface Summary {
  origin: Location;
  destination: Location;
  waypoints: Location[];
  priority: string;
  bound: Bound;
  fare: Fare;
  distance: number;
  duration: number;
}

interface Road {
  name: string;
  distance: number;
  duration: number;
  traffic_speed: number;
  traffic_state: number;
  vertexes: number[];
}

interface Guide {
  name: string;
  x: number;
  y: number;
  distance: number;
  duration: number;
  type: number;
  guidance: string;
  road_index: number;
}

interface Section {
  distance: number;
  duration: number;
  bound: Bound;
  roads: Road[];
  guides: Guide[];
}

interface Route {
  result_code: number;
  result_msg: string;
  summary: Summary;
  sections: Section[];
}

interface NavigationData {
  trans_id: string;
  routes: Route[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const coordinates: string[] = [];
  searchParams.forEach((el, i) => {
    coordinates.push(el);
  });
  const origin = coordinates
    .slice(0, 2)
    .reverse()
    .map((coord) => parseFloat(coord).toFixed(7))
    .join(",");
  const destination = coordinates
    .slice(2)
    .reverse()
    .map((coord) => parseFloat(coord).toFixed(7))
    .join(",");
  const REST_API_KEY = process.env.KAKAO_CAR_KEY;
  const url = "https://apis-navi.kakaomobility.com/v1/directions";

  const headers = {
    Authorization: `KakaoAK ${REST_API_KEY}`,
    "Content-Type": "application/json",
  };

  const queryParams = new URLSearchParams({
    origin: origin,
    destination: destination,
  });

  const newURL = `${url}?${queryParams}`;

  const response = await axios.get(newURL, {
    headers: headers,
  });

  const data: NavigationData = response.data ? response.data : null;
  const linePath: Coordinate[] = [];
  data.routes[0].sections[0].roads.forEach((router) => {
    router.vertexes.forEach((vertex, index) => {
      if (index % 2 === 0) {
        linePath.push({
          lat: router.vertexes[index + 1],
          lng: router.vertexes[index],
        });
      }
    });
  });
  return Response.json({ data: linePath });
}
