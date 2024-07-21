import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Button } from "./ui/button";
import { Image } from "lucide-react";

export default function LightBox({ className }) {
  const [open, setOpen] = React.useState(false);

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
      />
    </>
  );
}
