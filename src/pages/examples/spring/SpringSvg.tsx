import { useState } from "react";
import { animated, config, useSpring } from "react-spring";

export default function SpringSvg() {
  const [flip, set] = useState(false);
  const { x } = useSpring({
    reset: true,
    reverse: flip,
    from: { x: 0 },
    x: 1,
    delay: 200,
    config: config.molasses,
    onRest: () => set(!flip),
  });

  return (
    <animated.svg
      style={{ margin: 20, width: 80, height: 80, background: "yellow" }}
      viewBox="0 0 45 44"
      strokeWidth="2"
      fill="white"
      stroke="rgb(45, 55, 71)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={156}
      strokeDashoffset={x.to((x) => (1 - x) * 156)}
    >
      <polygon points="100,10 40,180 190,60 10,60 160,180" fill="red" />
    </animated.svg>
  );
}
