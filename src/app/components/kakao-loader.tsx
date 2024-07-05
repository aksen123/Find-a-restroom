import { useKakaoLoader } from "react-kakao-maps-sdk";

export default function KakaoLoader() {
  useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_KEY as string,
    libraries: ["clusterer", "drawing", "services"],
  });
}
