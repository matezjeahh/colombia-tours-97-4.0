"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/custom-alert-dialog";
import RichTextEditor from "./RichTextEditor";
import ImageUploaderAndLightboxManager from "./ImageUploaderAndLightboxManager";

const RichTextMDXEditorUploader = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [editorContent, setEditorContent] = useState([
    { type: "paragraph", children: [{ text: "" }] },
  ]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [lightboxImages, setLightboxImages] = useState([
    { id: Date.now(), file: null, description: "" },
  ]);

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  const replaceCharacters = (text) => {
    const replacements = {
      û: "ű",
      ô: "ő",
      ò: "ó",
    };
    return text.replace(/[ûôò]/g, (char) => replacements[char] || char);
  };

  const serializeToMDX = (nodes) => {
    return nodes
      .map((n) => {
        if (n.text) {
          let string = replaceCharacters(n.text);
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

        const children = n.children.map((child) => serializeToMDX([child])).join("");

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
            return children;
          case "bulleted-list":
            return children;
          case "list-item":
            return `- ${replaceCharacters(children)}\n`;
          case "code":
            return `\`\`\`\n${children}\n\`\`\`\n\n`;
          default:
            return `${children}\n\n`;
        }
      })
      .join("");
  };

  const uploadImage = async (file, folder = "", retryCount = 0) => {
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;

    const datePrefix = new Date().toISOString().split("T")[0];
    const originalFilename = file.name;
    const fileExtension = originalFilename.split(".").pop();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${datePrefix}-${createSlug(
      originalFilename.replace(`.${fileExtension}`, "")
    )}-${uniqueSuffix}.${fileExtension}`;

    const content = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });

    const path = folder ? `${folder}/${filename}` : `public/images/${filename}`;

    try {
      const response = await fetch(`${GITHUB_API_URL}${path}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload image: ${filename}`,
          content: content,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`GitHub API Error (${response.status}):`, errorBody);

        if (response.status === 409 && retryCount < 3) {
          console.log(`Conflict detected, retrying upload (attempt ${retryCount + 1})...`);
          return uploadImage(file, folder, retryCount + 1);
        }

        throw new Error(`Failed to upload image to GitHub: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`Image uploaded successfully:`, result);
      return path.replace("public/", "/");
    } catch (error) {
      console.error(`Error in uploadImage (${filename}):`, error);
      throw error;
    }
  };

  const uploadJSONFile = async (content, filename) => {
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;

    const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify(content))));

    try {
      const response = await fetch(
        `${GITHUB_API_URL}app/(static)/blog/image-descriptions/${filename}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Create JSON file: ${filename}`,
            content: encodedContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload JSON file to GitHub: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`JSON file uploaded successfully: ${result.content.html_url}`);
      return result.content.html_url;
    } catch (error) {
      console.error("Error uploading JSON file to GitHub:", error);
      throw error;
    }
  };

  const createAndUploadMDX = async () => {
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;

    let mainImagePath = "";
    if (image) {
      mainImagePath = await uploadImage(image);
    }

    // Upload lightbox images and create descriptions array
    const lightboxImageInfo = await Promise.all(
      lightboxImages.map(async (img) => {
        if (img.file) {
          const path = await uploadImage(img.file, "app/(static)/blog/lightbox-images");
          return {
            path: path,
            description: img.description,
          };
        }
        return null;
      })
    );

    // Filter out any null values (images that failed to upload)
    const validLightboxImages = lightboxImageInfo.filter((img) => img !== null);

    // Create and upload JSON file with image descriptions
    const imageDescriptions = validLightboxImages.map((img) => img.description);
    const jsonFilename = `${createSlug(title)}-image-descriptions.json`;
    const jsonFileUrl = await uploadJSONFile(imageDescriptions, jsonFilename);

    // Apply replaceCharacters to title and description
    const replacedTitle = replaceCharacters(title);
    const replacedDescription = replaceCharacters(description);

    // Apply replaceCharacters to editor content
    const replacedEditorContent = editorContent.map((node) => {
      if (node.text) {
        return { ...node, text: replaceCharacters(node.text) };
      }
      return {
        ...node,
        children: node.children.map((child) =>
          child.text ? { ...child, text: replaceCharacters(child.text) } : child
        ),
      };
    });

    const mdxContent = serializeToMDX(replacedEditorContent);

    const now = new Date();
    const slug = createSlug(replacedTitle);
    const filename = `${slug}.mdx`;

    const frontMatter = `---
title: "${replacedTitle}"
date: "${now.toISOString()}"
description: "${replacedDescription}"
image: "${mainImagePath}"
lightboxImages: ${JSON.stringify(validLightboxImages.map((img) => img.path))}
imageDescriptionsUrl: "${jsonFileUrl}"
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
          message: `Create MDX file: ${replacedTitle}`,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to upload MDX file to GitHub: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`MDX file uploaded successfully: ${result.content.html_url}`);
      toast.success(`MDX file and JSON file created and uploaded successfully`);
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
      setEditorContent([{ type: "paragraph", children: [{ text: "" }] }]);
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
      // Reset lightbox images
      setLightboxImages([{ id: Date.now(), file: null, description: "" }]);
      toast.success("MDX file created and uploaded successfully");
    } catch (error) {
      console.error("Error creating and uploading MDX file:", error);
      toast.error(`Failed to create and upload MDX file: ${error.message}`);
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

      <ImageUploaderAndLightboxManager
        mainImage={mainImage}
        onMainImageChange={setMainImage}
        lightboxImages={lightboxImages}
        onLightboxImagesChange={setLightboxImages}
      />

      <RichTextEditor value={editorContent} onChange={setEditorContent} />

      <CustomAlertDialog
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={handleMDXCreationAndUpload}
        triggerButton={
          <Button onClick={() => setIsAlertOpen(true)} className="w-full">
            Save and Upload
          </Button>
        }
      />
    </div>
  );
};

export default RichTextMDXEditorUploader;
