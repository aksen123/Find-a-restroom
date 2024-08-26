import React from "react";
import loading from "@/../public/loading.json";
import Lottie from "lottie-react";

export default function Loading() {
  return (
    <Lottie loop animationData={loading} style={{ width: 150, height: 150 }}>
      Loading
    </Lottie>
  );
}
