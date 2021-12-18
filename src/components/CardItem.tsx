import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface CardItemProps {
  text: string;
  image?: string;
  url?: string;
}

export default function CardItem({ image, text, url }: CardItemProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{ borderRadius: 20 }}
      className="shadow clickable"
      onClick={() => url && navigate(url)}
    >
      {image && <img alt="ExamplesPage" src={image} width={"100%"}></img>}
      <Typography
        id="spring-modal-title"
        variant="h5"
        component="h2"
        style={{ textAlign: "center", paddingTop: 10, paddingBottom: 10 }}
      >
        {text}
      </Typography>
    </div>
  );
}
