import api from "@/app/service/axios";
import axios from "axios";
import { NextRequest } from "next/server";

// TODO : 경로 갖고오기 완료
// path만 정리해서 반환값으로 넘겨주고 폴리라인 path로 넣어주기

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const test: string[] = [];
  searchParams.forEach((el, i) => {
    test.push(el);
  });
  const origin = test
    .slice(0, 2)
    .reverse()
    .map((coord) => parseFloat(coord).toFixed(7))
    .join(",");
  const destination = test
    .slice(2)
    .reverse()
    .map((coord) => parseFloat(coord).toFixed(7))
    .join(",");
  const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_KEY2;
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
  console.log("🚀 ~ GET ~ queryParams:", newURL, decodeURIComponent(newURL));

  const requestUrl = `${url}?${queryParams}`;

  const response = await axios.get(newURL, {
    method: "GET",
    headers: headers,
  });

  const data = response.data ? response.data : null;
  console.log(data.routes[0].sections[0].roads);
  return Response.json({ data: 1 });
}
