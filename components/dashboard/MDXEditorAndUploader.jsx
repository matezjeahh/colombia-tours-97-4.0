"use client";
import React, { useState, useMemo, useCallback } from "react";
import { createEditor, Transforms, Editor, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Quote,
} from "lucide-react";

const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.bold === true,
      universal: true,
    });
    return !!match;
  },

  isItalicMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.italic === true,
      universal: true,
    });
    return !!match;
  },

  isUnderlineMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.underline === true,
      universal: true,
    });
    return !!match;
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "code",
    });
    return !!match;
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleItalicMark(editor) {
    const isActive = CustomEditor.isItalicMarkActive(editor);
    Transforms.setNodes(
      editor,
      { italic: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleUnderlineMark(editor) {
    const isActive = CustomEditor.isUnderlineMarkActive(editor);
    Transforms.setNodes(
      editor,
      { underline: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "code" },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },

  toggleHeading(editor, level) {
    Transforms.setNodes(
      editor,
      { type: `heading-${level}` },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },
};

const Toolbar = ({ editor }) => {
  return (
    <div className="flex flex-wrap gap-1 mb-4 p-2 bg-gray-100 rounded-md">
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleBoldMark(editor);
        }}
        className={`p-2 rounded hover:bg-gray-200 ${
          CustomEditor.isBoldMarkActive(editor) ? "bg-gray-200" : ""
        }`}
      >
        <Bold size={16} />
      </button>
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleItalicMark(editor);
        }}
        className={`p-2 rounded hover:bg-gray-200 ${
          CustomEditor.isItalicMarkActive(editor) ? "bg-gray-200" : ""
        }`}
      >
        <Italic size={16} />
      </button>
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleUnderlineMark(editor);
        }}
        className={`p-2 rounded hover:bg-gray-200 ${
          CustomEditor.isUnderlineMarkActive(editor) ? "bg-gray-200" : ""
        }`}
      >
        <UnderlineIcon size={16} />
      </button>
      {[1, 2, 3].map((level) => (
        <button
          key={level}
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleHeading(editor, level);
          }}
          className="p-2 rounded hover:bg-gray-200"
        >
          {level === 1 && <Heading1 size={16} />}
          {level === 2 && <Heading2 size={16} />}
          {level === 3 && <Heading3 size={16} />}
        </button>
      ))}
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleCodeBlock(editor);
        }}
        className={`p-2 rounded hover:bg-gray-200 ${
          CustomEditor.isCodeBlockActive(editor) ? "bg-gray-200" : ""
        }`}
      >
        <Code size={16} />
      </button>
    </div>
  );
};

const MDXEditorAndUploader = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const editor = useMemo(() => withReact(createEditor()), []);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return (
          <pre {...props.attributes}>
            <code>{props.children}</code>
          </pre>
        );
      case "heading-1":
        return <h1 {...props.attributes}>{props.children}</h1>;
      case "heading-2":
        return <h2 {...props.attributes}>{props.children}</h2>;
      case "heading-3":
        return <h3 {...props.attributes}>{props.children}</h3>;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    let { attributes, children, leaf } = props;
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
      children = <em>{children}</em>;
    }
    if (leaf.underline) {
      children = <u>{children}</u>;
    }
    return <span {...attributes}>{children}</span>;
  }, []);

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
          return string;
        }

        const children = n.children.map((n) => serializeToMDX([n])).join("");

        switch (n.type) {
          case "heading-1":
            return `# ${children}\n\n`;
          case "heading-2":
            return `## ${children}\n\n`;
          case "heading-3":
            return `### ${children}\n\n`;
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

    // Use the original filename
    const filename = file.name;
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

    // Return just the filename instead of the full URL
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
    const timestamp = now.toISOString().split("T")[0].replace(/-/g, "_");
    const filename = `${timestamp}_${title.toLowerCase().replace(/\s+/g, "_")}.mdx`;

    const frontMatter = `---
title: "${title}"
date: "${now.toISOString()}"
description: "${description}"
image: ${imagePath}
---

`;

    const fullContent = frontMatter + mdxContent;
    const content = btoa(unescape(encodeURIComponent(fullContent)));

    try {
      const response = await fetch(`${GITHUB_API_URL}public/${filename}`, {
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
    } catch (error) {
      console.error("Error creating and uploading MDX file:", error);
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
      <Slate editor={editor} initialValue={[{ type: "paragraph", children: [{ text: "" }] }]}>
        <Toolbar editor={editor} />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          className="border p-4 rounded-md min-h-[300px] mb-4"
        />
      </Slate>
      <Button onClick={handleMDXCreationAndUpload} className="w-full">
        Create and Upload MDX
      </Button>
    </div>
  );
};

export default MDXEditorAndUploader;
