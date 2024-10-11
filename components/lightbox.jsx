"use client";
import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Button } from "./ui/button";
import { Image } from "lucide-react";
import NextJsImage from "./next-js-image";
// Removed the import for the thumbnails plugin and its CSS
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";

export default function LightBox({ className, slides, variant, text }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setOpen(true)}
        className={`items-center ${className}`}
      >
        <Image size={18} className="mr-1" />
        {text}
      </Button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        render={{ slide: NextJsImage }}
        // Removed thumbnail: NextJsImage since it's for the thumbnail rendering
        plugins={[Zoom, Captions]} // Removed Thumbnails from the plugins array
        animation={{ swipe: 200, fade: 200 }}
        captions={{
          descriptionTextAlign: "center",
          captionContainerStyle: { textAlign: "center" },
        }}
      />
    </>
  );
}
