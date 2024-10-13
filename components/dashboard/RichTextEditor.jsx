import React, { useCallback, useMemo } from "react";
import { createEditor, Transforms, Editor, Text, Element as SlateElement } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
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

const CustomEditor = {
  toggleMark(editor, format) {
    const isActive = this.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },

  toggleBlock(editor, format) {
    const isActive = this.isBlockActive(editor, format);
    const isList = ["numbered-list", "bulleted-list"].includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        ["numbered-list", "bulleted-list"].includes(n.type),
      split: true,
    });

    const newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  },

  isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },

  isBlockActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  },
};

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

const Toolbar = () => (
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

const RichTextEditor = ({ value, onChange }) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  const renderElement = useCallback((props) => {
    const { attributes, children, element } = props;
    switch (element.type) {
      case "heading-one":
        return (
          <h1 {...attributes} className="text-3xl font-bold my-4">
            {children}
          </h1>
        );
      case "heading-two":
        return (
          <h2 {...attributes} className="text-2xl font-bold my-3">
            {children}
          </h2>
        );
      case "heading-three":
        return (
          <h3 {...attributes} className="text-xl font-bold my-2">
            {children}
          </h3>
        );
      case "block-quote":
        return (
          <blockquote {...attributes} className="border-l-4 pl-4 italic my-4">
            {children}
          </blockquote>
        );
      case "numbered-list":
        return (
          <ol {...attributes} className="list-decimal pl-5 my-4">
            {children}
          </ol>
        );
      case "bulleted-list":
        return (
          <ul {...attributes} className="list-disc pl-5 my-4">
            {children}
          </ul>
        );
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "code":
        return (
          <pre {...attributes} className="bg-gray-100 p-2 rounded my-4">
            <code>{children}</code>
          </pre>
        );
      default:
        return (
          <p {...attributes} className="my-2">
            {children}
          </p>
        );
    }
  }, []);

  const renderLeaf = useCallback(({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
      children = <em>{children}</em>;
    }
    if (leaf.underline) {
      children = <u>{children}</u>;
    }
    if (leaf.code) {
      children = <code className="bg-gray-100 px-1 rounded">{children}</code>;
    }
    return <span {...attributes}>{children}</span>;
  }, []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={onChange}
      initialValue={[{ type: "paragraph", children: [{ text: "" }] }]}
    >
      <Toolbar />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter your blog post content here..."
        className="border p-4 rounded-md min-h-[300px] mb-4"
      />
    </Slate>
  );
};

export default RichTextEditor;
