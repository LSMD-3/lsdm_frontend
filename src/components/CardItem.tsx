import { Button, Typography } from "@mui/material";
import SvgIcons from "assets/svg/SvgIcons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import "react-lazy-load-image-component/src/effects/blur.css";

interface CardItemProps {
  text: string;
  image?: string;
  url?: string;
  liked?: boolean;
  quantity?: number;
  limit?: number;
  toggleLike?: () => void;
  increment?: () => void;
  decrement?: () => void;
}

export default function CardItem({
  image,
  text,
  url,
  liked,
  quantity,
  toggleLike,
  increment,
  decrement,
}: CardItemProps) {
  const navigate = useNavigate();
  const showButtons = toggleLike || increment || decrement;

  return (
    <div
      style={{ borderRadius: 20, position: "relative" }}
      className="shadow clickable"
      onClick={() => url && navigate(url)}
    >
      {image && (
        <LazyLoadImage effect="blur" height={300} src={image} width={"100%"} />
      )}

      <Typography
        id="spring-modal-title"
        variant="h5"
        component="h2"
        style={{ textAlign: "center", paddingTop: 10, paddingBottom: 10 }}
      >
        {text}
      </Typography>
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
    </div>
  );
}
