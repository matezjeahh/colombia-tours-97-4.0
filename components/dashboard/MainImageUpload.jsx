import React from "react";
import { Input } from "@/components/ui/input";

const MainImageUpload = ({ setImage }) => {
  const handleMainImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return <Input type="file" onChange={handleMainImageChange} accept="image/*" className="mb-4" />;
};

export default MainImageUpload;
