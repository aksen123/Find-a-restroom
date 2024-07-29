import { Children } from "react";
import { useKakaoLoader } from "react-kakao-maps-sdk";

export default function KakaoLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_KEY as string,
    libraries: ["clusterer", "drawing", "services"],
  });

  if (loading) return <h1>loading..</h1>;

  return <>{children}</>;
}
