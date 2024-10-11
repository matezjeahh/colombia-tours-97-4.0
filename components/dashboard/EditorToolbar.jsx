import React from "react";
import { useSlate } from "slate-react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { CustomEditor } from "./editorUtils";

const ToolbarButton = ({ format, icon, isBlock = false }) => {
  const editor = useSlate();
  const isActive = isBlock
    ? CustomEditor.isBlockActive(editor, format)
    : CustomEditor.isMarkActive(editor, format);

  return (
    <Button
      type="button"
      variant={isActive ? "default" : "secondary"}
      onMouseDown={(event) => {
        event.preventDefault();
        isBlock
          ? CustomEditor.toggleBlock(editor, format)
          : CustomEditor.toggleMark(editor, format);
      }}
      className="mr-2"
    >
      {icon}
    </Button>
  );
};

const EditorToolbar = () => (
  <div className="flex flex-wrap gap-1 mb-4 p-2 bg-gray-100 rounded-md">
    <ToolbarButton format="bold" icon={<Bold size={18} />} />
    <ToolbarButton format="italic" icon={<Italic size={18} />} />
    <ToolbarButton format="underline" icon={<Underline size={18} />} />
    <ToolbarButton format="code" icon={<Code size={18} />} />
    <ToolbarButton format="heading-one" icon={<Heading1 size={18} />} isBlock />
    <ToolbarButton format="heading-two" icon={<Heading2 size={18} />} isBlock />
    <ToolbarButton format="heading-three" icon={<Heading3 size={18} />} isBlock />
    <ToolbarButton format="block-quote" icon={<Quote size={18} />} isBlock />
    <ToolbarButton format="numbered-list" icon={<ListOrdered size={18} />} isBlock />
    <ToolbarButton format="bulleted-list" icon={<List size={18} />} isBlock />
  </div>
);

export default EditorToolbar;
