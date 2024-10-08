"use client";
import React, { useState, useMemo, useCallback } from "react";
import { createEditor, Transforms, Editor, Text, Element as SlateElement } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import CustomAlertDialog from "@/components/custom-alert-dialog";

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

const RichTextMDXEditorUploader = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const [editorContent, setEditorContent] = useState([
    { type: "paragraph", children: [{ text: "" }] },
  ]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

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

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/á/g, "a")
      .replace(/é/g, "e")
      .replace(/í/g, "i")
      .replace(/ó/g, "o")
      .replace(/ö/g, "o")
      .replace(/ő/g, "o")
      .replace(/ú/g, "u")
      .replace(/ü/g, "u")
      .replace(/ű/g, "u")
      .replace(/ñ/g, "n")
      .replace(/ç/g, "c")
      .replace(/ß/g, "ss")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  const serializeToMDX = (nodes) => {
    return nodes
      .map((n) => {
        if (Text.isText(n)) {
          let string = n.text;
          if (n.bold) {
            string = `**${string}**`;
          }
          if (n.italic) {
            string = `*${string}*`;
          }
          if (n.underline) {
            string = `<u>${string}</u>`;
          }
          if (n.code) {
            string = `\`${string}\``;
          }
          return string;
        }

        const children = n.children.map((n) => serializeToMDX([n])).join("");

        switch (n.type) {
          case "heading-one":
            return `# ${children}\n\n`;
          case "heading-two":
            return `## ${children}\n\n`;
          case "heading-three":
            return `### ${children}\n\n`;
          case "block-quote":
            return `> ${children}\n\n`;
          case "numbered-list":
            return children; // The list items will handle the numbering
          case "bulleted-list":
            return children; // The list items will handle the bullets
          case "list-item":
            return `- ${children}\n`;
          case "code":
            return `\`\`\`\n${children}\n\`\`\`\n\n`;
          default:
            return `${children}\n\n`;
        }
      })
      .join("");
  };

  const uploadImage = async (file) => {
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;

    const datePrefix = new Date().toISOString().split("T")[0];
    const originalFilename = file.name;
    const fileExtension = originalFilename.split(".").pop();
    const filename = `${datePrefix}-${createSlug(
      originalFilename.replace(`.${fileExtension}`, "")
    )}.${fileExtension}`;

    const content = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });

    const response = await fetch(`${GITHUB_API_URL}public/images/${filename}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload image for blog post: ${title}`,
        content: content,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image to GitHub: ${response.statusText}`);
    }

    return `/images/${filename}`;
  };

  const createAndUploadMDX = async () => {
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;

    let imagePath = "";
    if (image) {
      imagePath = await uploadImage(image);
    }

    const mdxContent = serializeToMDX(editor.children);

    const now = new Date();
    const slug = createSlug(title);
    const filename = `${slug}.mdx`;

    const frontMatter = `---
title: "${title}"
date: "${now.toISOString()}"
description: "${description}"
image: "${imagePath}"
---

`;

    const fullContent = frontMatter + mdxContent;
    const content = btoa(unescape(encodeURIComponent(fullContent)));

    try {
      const response = await fetch(`${GITHUB_API_URL}app/(static)/blog/posts/${filename}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Create MDX file: ${title}`,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to upload MDX file to GitHub: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`MDX file uploaded successfully: ${result.content.html_url}`);
      toast.success(`MDX file created and uploaded successfully`);
      return result.content.html_url;
    } catch (error) {
      console.error("Error uploading MDX file to GitHub:", error);
      toast.error(`Failed to create and upload MDX file: ${error.message}`);
      throw error;
    }
  };

  const handleMDXCreationAndUpload = async () => {
    try {
      await createAndUploadMDX();
      // Reset all inputs and editor content after successful upload
      setTitle("");
      setDescription("");
      setImage(null);
      // Clear the Slate editor content
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });
      // Set the initial content for the editor
      Transforms.insertNodes(editor, [{ type: "paragraph", children: [{ text: "" }] }]);
      // Update the editorContent state
      setEditorContent([{ type: "paragraph", children: [{ text: "" }] }]);
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
      toast.success("MDX file created and uploaded successfully");
    } catch (error) {
      console.error("Error creating and uploading MDX file:", error);
      toast.error(`Failed to create and upload MDX file: ${error.message}`);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto p-4">
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
      <Input type="file" onChange={handleImageChange} accept="image/*" className="mb-4" />
      <Slate
        editor={editor}
        value={editorContent}
        onChange={setEditorContent}
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
      <CustomAlertDialog
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={handleMDXCreationAndUpload}
        triggerButton={
          <Button onClick={() => setIsAlertOpen(true)} className="w-full">
            Mentés
          </Button>
        }
      />
    </div>
  );
};

export default RichTextMDXEditorUploader;
