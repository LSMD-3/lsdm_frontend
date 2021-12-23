import { useState, useEffect } from "react";

type ScreenSize = "mobile" | "desktop" | "medium";
const useWindowsWidth = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>();

  let checkScreenSize = () => {
    if (window.innerWidth < 600) return setScreenSize("mobile");
    if (window.innerWidth < 1000) return setScreenSize("medium");
    setScreenSize("desktop");
  };
  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return screenSize;
};

export default useWindowsWidth;
