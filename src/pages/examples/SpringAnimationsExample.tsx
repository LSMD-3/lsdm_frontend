import React from "react";
import SpringNumber from "./spring/SpringNumber";
import SpringSvg from "./spring/SpringSvg";

export default function SpringAnimationsExample() {
  return (
    <div>
      <h1>Spring Animations</h1>
      <SpringSvg />
      <SpringNumber />
    </div>
  );
}
