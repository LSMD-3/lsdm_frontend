import Box from "@mui/material/Box";
import NotFound from "./404.svg";
import Logo from "./logo.svg";
import Instagram from "./instagram.svg";
import Facebook from "./facebook.svg";
import Heart from "./heart.svg";
import HeartEmpty from "./heart_empty.svg";
import Minus from "./minus-sign.svg";
import Plus from "./plus.svg";
import DarkMode from "./night-mode.svg";
import LightMode from "./brightness.svg";

// add here new svg
const icons = {
  "404": NotFound,
  Logo,
  Instagram,
  Facebook,
  Heart,
  HeartEmpty,
  Minus,
  Plus,
  DarkMode,
  LightMode,
};

// here you can apply default styles to some svg
let defaultStyles: Record<string, React.CSSProperties> = {
  Logo: { width: 200 },
  Instagram: { width: 60 },
  Facebook: { width: 60 },
  Heart: { width: 30 },
  HeartEmpty: { width: 30 },
  Minus: { width: 30 },
  Plus: { width: 30 },
  DarkMode: { width: 42 },
  LightMode: { width: 42 },
};

//
//
//
//  if edit above lines
//  please open a PR
//
//
//
type SvgIconsType = keyof typeof icons;
const styleKeys = Object.keys(defaultStyles);
Object.keys(icons).forEach((itm: string) => {
  if (!styleKeys.includes(itm)) {
    defaultStyles[itm] = {};
  }
});

interface SvgIconsProps {
  icon: SvgIconsType;
  style?: React.CSSProperties;
}
export default function SvgIcons({ icon, style }: SvgIconsProps) {
  if (!icon) {
    return <p>Missing icon name</p>;
  }
  let appliedStyle = defaultStyles[icon];
  appliedStyle = style ? { ...style, ...appliedStyle } : appliedStyle;
  return (
    <Box>
      <img alt={icon} src={icons[icon]} className="svg" style={appliedStyle} />
    </Box>
  );
}
