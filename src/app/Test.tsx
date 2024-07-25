"use client";

import React from "react";

export default function Test() {
  const click = async () => {
    const response = await fetch("/api/testDB");
    const result = await response.json();

    response.ok ? console.log(result) : false;
  };

  return <img src="../image/dot.png" alt="" />;
}
