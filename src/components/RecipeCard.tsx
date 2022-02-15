import { Button, Typography } from "@mui/material";
import SvgIcons from "assets/svg/SvgIcons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useSpring, animated, config } from "react-spring";
import { Recipe } from "types";
import { RecipeModal } from "components";
import { useState } from "react";
import { SpaOutlined } from "@mui/icons-material";

interface CardItemProps {
  recipe: Recipe;
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

export default function RecipeCard({
  recipe,
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

  const [recipeDetailModalOpened, setrecipeDetailModalOpened] = useState(false);

  const image = recipe.image_url;
  const text = recipe.recipe_name;

  return (
    <div>
      <animated.div
        style={{ borderRadius: BORDER_RADIUS, position: "relative", ...props }}
        className="shadow"
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
            onClick={onClick ? onClick : () => setrecipeDetailModalOpened(true)}
            className="clickable"
          />
        )}

        {text && (
          <Typography
            id="spring-modal-title"
            variant="h5"
            component="h2"
            style={{
              textAlign: "center",
              paddingTop: 10,
              paddingBottom: 10,
              whiteSpace: "pre-line",
            }}
          >
            {!showButtons && quantity && <span>{quantity} X </span>}
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
      <RecipeModal
        open={recipeDetailModalOpened}
        handleClose={() => setrecipeDetailModalOpened(false)}
        recipe={recipe}
      />
    </div>
  );
}
