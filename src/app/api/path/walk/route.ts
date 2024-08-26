import { Coordinate } from "@/app/Map/page";
import axios from "axios";
import { NextRequest } from "next/server";

interface GeoJSON {
  type: string;
  features: Feature[];
}

interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

interface Geometry {
  type: string;
  coordinates: number[] | number[][];
}

interface Properties {
  [key: string]: any;
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const bounds: string[] = [];
  params.forEach((el) => bounds.push(el));

  const end = bounds.splice(2);
  const url = `https://apis.openapi.sk.com/tmap/routes/pedestrian`;
  const headers = {
    accept: "application/json",
    appKey: process.env.TMAP_WALK_KEY,
    "content-type": "application/json",
  };
  const body = {
    startX: +bounds[1],
    startY: +bounds[0],
    endX: +end[1],
    endY: +end[0],
    startName: "시작점",
    endName: "도착점",
  };
  const { data }: { data: GeoJSON } = await axios.post(url, body, {
    params: { version: "1" },
    headers: headers,
  });
  console.log("🚀 ~ GET ~ data:", data.features[2].geometry.coordinates);
  // const response: Coordinate[] = data.features.map((el)=> {
  //   const coord = el.geometry.coordinates
  //   if(Array.isArray(coord[0])){
  //     return {lat: }
  //   }
  // })

  const path = data.features.flatMap((feature: Feature) => {
    const coords = feature.geometry.coordinates;
    if (Array.isArray(coords[0])) {
      // coords가 이중 배열인 경우
      return (coords as number[][]).map((coord: number[]) => ({
        lat: coord[1],
        lng: coord[0],
      }));
    } else {
      // coords가 단순 배열인 경우
      return { lat: coords[1], lng: coords[0] };
    }
  });

  return Response.json({ data: path });
}
