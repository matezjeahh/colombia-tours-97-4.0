"use client";
import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Button } from "./ui/button";
import { Image } from "lucide-react";
import NextJsImage from "./next-js-image";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

export default function LightBox({ className, slides }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={`items-center ${className}`}
      >
        <Image size={18} className="mr-1" />
        Galéria
      </Button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        render={{ slide: NextJsImage, thumbnail: NextJsImage }}
        plugins={[Thumbnails, Zoom]}
      />
    </>
  );
}
