import useWindowsWidth from "hooks/useWindowWidth";
import React from "react";

export default function HooksExample() {
  const width = useWindowsWidth();
  console.log(width);
  return <h4>I am {width}</h4>;
}
