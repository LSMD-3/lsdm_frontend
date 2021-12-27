import { Skeleton } from "@mui/material";
import React, { useState } from "react";
import sleep from "utils/helper";
//  TODO Make it better
export default function LoadingImage({ image }: { image: string }) {
  const hasImage = image !== undefined;
  const [imageLoaded, setimageLoaded] = useState(hasImage ? false : true);
  const showSkeleton = hasImage && !imageLoaded;
  return (
    <div>
      {showSkeleton && (
        <Skeleton width={"100%"} height={200} animation="pulse" />
      )}
      {image && (
        <img
          alt="ExamplesPage"
          src={image}
          width={"100%"}
          style={{
            visibility: showSkeleton ? "hidden" : "visible",
            background: "red",
          }}
          onLoad={() => sleep(1000).then(() => setimageLoaded(true))}
        ></img>
      )}
    </div>
  );
}
