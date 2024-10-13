"use client";
import React, { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Button } from "./ui/button";
import { Image } from "lucide-react";
import NextJsImage from "./next-js-image";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";

export default function LightBox({
  className,
  lightboxImages,
  variant,
  text,
  imageDescriptionsUrl,
}) {
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const unicodeSafeBase64Decode = (str) => {
      try {
        return decodeURIComponent(
          Array.prototype.map
            .call(atob(str), (c) => {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
      } catch (error) {
        console.error("Error decoding string:", error);
        return str; // Return the original string if decoding fails
      }
    };

    const importImages = async () => {
      try {
        if (!lightboxImages) {
          console.error("No image path provided in frontmatter");
          return;
        }

        // Import the JSON file
        const descriptionsModule = await import(imageDescriptionsUrl);
        const encodedDescriptions = descriptionsModule.default.descriptions;

        // Decode the descriptions
        const descriptions = encodedDescriptions.map(unicodeSafeBase64Decode);

        const context = require.context(
          "/app/(static)/blog/lightbox-images",
          true,
          /\.(png|jpe?g|svg)$/
        );

        const allKeys = context.keys();
        console.log("All keys:", allKeys);

        // Adjust the filtering to use the imagePath from frontmatter
        const images = allKeys
          .filter((key) => key.startsWith(`.${lightboxImages}/`))
          .map((key, index) => ({
            src: key.replace("./", "/"),
            description: descriptions[index] || "Nincs leírás",
          }));

        console.log("Filtered images:", images);

        setSlides(images);
      } catch (error) {
        console.error("Error importing images or descriptions:", error);
      }
    };

    importImages();
  }, [slides]);

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
        plugins={[Zoom, Captions]}
        animation={{ swipe: 200, fade: 200 }}
        captions={{
          descriptionTextAlign: "center",
          captionContainerStyle: { textAlign: "center" },
        }}
      />
    </>
  );
}
