"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function IntroPage() {
  const { push } = useRouter();
  useEffect(() => {
    const router = setTimeout(() => {
      push("/Map");
    }, 1000);

    return () => clearTimeout(router);
  }, []);
  return (
    <section className="w-full h-screen flex flex-col justify-center items-center relative">
      <p className=" z-10 p-4 text-2xl md:text-4xl font-bold animate-slideInLeft">
        급변(急變)하는 세상
      </p>
      <div className="flex-1 relative w-full">
        <Image
          src={
            "https://i.namu.wiki/i/1QgvpLVSoj5CWHF9Lc2fgaJxtKlVmZR5fZC9SwGpUkYVPYoah6-9MB3yAtVh3T77lSMcVRLML2LSYmlTt2qqQw.webp"
          }
          alt=""
          fill
          sizes="100%"
          className="object-fill lg:object-contain"
        />
      </div>
      <p className="p-4 text-2xl md:text-4xl font-bold animate-slideInRight opacity-0">
        급변(急便)하는 당신을 위해
      </p>
    </section>
  );
}
