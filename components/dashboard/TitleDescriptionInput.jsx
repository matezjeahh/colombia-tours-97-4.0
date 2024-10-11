import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TitleDescriptionInput = ({ title, setTitle, description, setDescription }) => (
  <>
    <Input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Enter blog post title"
      className="mb-4"
    />
    <Textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Enter blog post description"
      className="mb-4"
    />
  </>
);

export default TitleDescriptionInput;
