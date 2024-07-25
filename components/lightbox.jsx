import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Button } from "./ui/button";
import { Image } from "lucide-react";
import NextJsImage from "./next-js-image";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

export default function LightBox({ className }) {
  const [open, setOpen] = React.useState(false);

  const thumbnailsRef = React.useRef(null);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={("items-center", className)}
      >
        <Image size={18} className="mr-1" />
        Galéria
      </Button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: "/kep.jpg" }, { src: "/kep.jpg" }, { src: "/kep.jpg" }]}
        render={{ slide: NextJsImage, thumbnail: NextJsImage }}
        plugins={[Thumbnails]}
      />
    </>
  );
}
