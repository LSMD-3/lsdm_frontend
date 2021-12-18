import Box from "@mui/material/Box";
import NotFound from "./404.svg";
import Logo from "./logo.svg";
import Instagram from "./instagram.svg";
import Facebook from "./facebook.svg";

// add here new svg
const icons = { "404": NotFound, Logo, Instagram, Facebook };

// here you can apply default styles to some svg
let defaultStyles: Record<string, React.CSSProperties> = {
  Logo: { width: 200 },
  Instagram: { width: 60 },
  Facebook: { width: 60 },
};

// don't edit above lines
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
