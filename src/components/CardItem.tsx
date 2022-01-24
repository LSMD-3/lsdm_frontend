import { Button, Typography } from "@mui/material";
import SvgIcons from "assets/svg/SvgIcons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useSpring, animated, config } from "react-spring";

interface CardItemProps {
  text?: string;
  image?: string;
  url?: string;
  onClick?: () => void;
  liked?: boolean;
  quantity?: number;
  limit?: number;
  children?: JSX.Element;
  toggleLike?: () => void;
  increment?: () => void;
  decrement?: () => void;
  status?: string;
}

const BORDER_RADIUS = 16;

export default function CardItem({
  image,
  text,
  url,
  liked,
  quantity,
  children,
  onClick,
  toggleLike,
  increment,
  decrement,
  status,
}: CardItemProps) {
  const navigate = useNavigate();
  const showButtons = toggleLike || increment || decrement;
  const props = useSpring({
    to: { opacity: 1, y: 0 },
    from: { opacity: 0, y: 100 },
    config: config.molasses,
  });

  return (
    <animated.div
      style={{ borderRadius: BORDER_RADIUS, position: "relative", ...props }}
      className="shadow clickable"
      onClick={onClick ? onClick : () => url && navigate(url)}
    >
      {image && (
        <LazyLoadImage
          effect="blur"
          height={300}
          src={image}
          width={"100%"}
          style={{
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: BORDER_RADIUS,
          }}
        />
      )}

      {text && (
        <Typography
          id="spring-modal-title"
          variant="h5"
          component="h2"
          style={{ textAlign: "center", paddingTop: 10, paddingBottom: 10 }}
        >
          {text}
        </Typography>
      )}
      {status && (
        <Typography
          id="spring-modal-title"
          variant="h5"
          component="h2"
          style={{ textAlign: "center", paddingTop: 10, paddingBottom: 10 }}
        >
          {status}
        </Typography>
      )}
      {children}
      {!showButtons && quantity && (
        <Typography
          id="spring-modal-title"
          variant="h5"
          component="h2"
          style={{ textAlign: "center", paddingTop: 10, paddingBottom: 10 }}
        >
          {quantity}
        </Typography>
      )}
      {showButtons && (
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
            margin: 20,
            paddingBottom: 20,
          }}
        >
          <Button onClick={toggleLike}>
            {liked && <SvgIcons icon="Heart" />}
            {!liked && <SvgIcons icon="HeartEmpty" />}
          </Button>
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {quantity && (
              <div>
                <Button onClick={decrement}>
                  <SvgIcons icon="Minus" />
                </Button>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: 30,
                    marginRight: 10,
                    marginLeft: 10,
                  }}
                >
                  {quantity}
                </span>
              </div>
            )}
            <Button onClick={increment}>
              <SvgIcons icon="Plus" />
            </Button>
          </div>
        </div>
      )}
    </animated.div>
  );
}
