import { useState } from "react";
import { animated, config, useSpring } from "react-spring";

export default function SpringNumber() {
  const [flip, set] = useState(false);
  const { number } = useSpring({
    reset: true,
    reverse: flip,
    from: { number: 0 },
    number: 1,
    delay: 200,
    config: config.molasses,
    onRest: () => set(!flip),
  });

  return (
    <h2>
      <animated.div>{number.to((n) => n.toFixed(2))}</animated.div>
    </h2>
  );
}
